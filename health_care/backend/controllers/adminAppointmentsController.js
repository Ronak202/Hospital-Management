const pool = require('../models/db');

// List all appointments (admin)
async function getAllAppointments(req, res) {
  try {
    const [appointments] = await pool.query(`
     SELECT 
    a.id,
    a.status,
    a.appointment_time,
    a.reason,
    up.name AS patient_name,
    ud.name AS doctor_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users up ON p.user_id = up.id
JOIN doctors d ON a.doctor_id = d.id
JOIN users ud ON d.user_id = ud.id
ORDER BY a.appointment_time DESC;

    `);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an appointment by ID (admin)
async function deleteAppointment(req, res) {
  const appointmentId = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllAppointments,
  deleteAppointment,
};
