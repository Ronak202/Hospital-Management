const pool = require('../models/db');
const nodemailer = require('nodemailer');

exports.createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[patient]] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [userId]);

    if (!patient) {
      return res.status(400).json({ message: 'Patient record not found.' });
    }

    const { doctor_id, appointment_time, reason } = req.body;
    if (!appointment_time) {
      return res.status(400).json({ message: 'Appointment time is required.' });
    }

    await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, status, appointment_time, reason) VALUES (?, ?, 'pending', ?, ?)`,
      [patient.id, doctor_id, appointment_time, reason || null]
    );

    res.json({ message: 'Appointment created successfully' });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role === 'patient') {
      const [[patient]] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (!patient) return res.status(400).json({ message: 'Patient record not found.' });

      const [appointments] = await pool.query('SELECT * FROM appointments WHERE patient_id = ?', [patient.id]);
      return res.json(appointments);
    }

    if (req.user.role === 'doctor') {
      const [[doctor]] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
      if (!doctor) return res.status(400).json({ message: 'Doctor record not found.' });

      const [appointments] = await pool.query(`
        SELECT 
          a.id, 
          a.status, 
          a.appointment_time, 
          a.reason,
          u.name AS patient_name,
          u.email AS patient_email
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ?
      `, [doctor.id]);

      return res.json(appointments);
    }

    res.status(403).json({ message: 'Unauthorized role for appointments' });

  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

    // Fetch appointment info with doctor name, appointment time, and reason
    const [[appointment]] = await pool.query(`
      SELECT 
        a.id, 
        a.status, 
        a.appointment_time,
        a.reason,
        p.id AS patient_id, 
        up.email AS patient_email,
        ud.name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users ud ON d.user_id = ud.id
      WHERE a.id = ?
    `, [id]);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (status.toLowerCase() === 'approved') {
      // Get current history
      const [patients] = await pool.query('SELECT history FROM patients WHERE id = ?', [appointment.patient_id]);
      if (patients.length > 0) {
        let currentHistory = patients[0].history || '';

        const newEntry = `Appointment ID ${appointment.id} Appointment Time: ${appointment.appointment_time}  Doctor Name Dr.${appointment.doctor_name}\nHistory: ${appointment.reason || "No reason provided"}`;

        // Append if not already present
        if (!currentHistory.includes(newEntry)) {
          currentHistory += currentHistory ? `\n\n${newEntry}` : newEntry;

          // Update patient history
          await pool.query('UPDATE patients SET history = ? WHERE id = ?', [currentHistory, appointment.patient_id]);
        }
      }
    }
    
    if (['approved', 'rejected'].includes(status)) {
      try {
        await sendStatusUpdateEmail(
          appointment.patient_email,
          status,
          appointment.appointment_time,
          appointment.doctor_name
        );
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr.message);
      }
    }

    res.json({ message: 'Appointment status updated' });

  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

async function sendStatusUpdateEmail(toEmail, status, appointmentTime, doctorName) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Appointment Status Update',
    text: `Your appointment with Dr. ${doctorName} on ${new Date(appointmentTime).toLocaleString()} has been: ${status}.`,
  };

  await transporter.sendMail(mailOptions);
}
exports.getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(`
      SELECT d.id, u.name, u.email, d.specialization,d.availability
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};