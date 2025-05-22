const pool = require('../models/db'); // Already a promise pool

// === PATIENT PROFILE ===
async function getPatientProfile(req, res) {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied, not a patient' });
    }

    const userId = req.user.id;

    const query = `
      SELECT u.id, u.name, u.email, p.id AS patient_id
      FROM users u
      JOIN patients p ON p.user_id = u.id
      WHERE u.id = ?
    `;

    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const profile = rows[0];
    res.json({
      id: profile.patient_id,
      name: profile.name,
      email: profile.email
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updatePatientProfile(req, res) {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied, not a patient' });
    }

    const userId = req.user.id;
    const { name, email } = req.body;

    const query = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    await pool.query(query, [name, email, userId]);

    res.json({ message: 'Patient profile updated successfully' });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// === DOCTOR PROFILE ===
async function getDoctorProfile(req, res) {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied, not a doctor' });
    }

    const userId = req.user.id;

    const query = `
      SELECT u.id, u.name, u.email, d.id AS doctor_id, d.specialization, d.availability
      FROM users u
      JOIN doctors d ON d.user_id = u.id
      WHERE u.id = ?
    `;

    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const profile = rows[0];
    res.json({
      id: profile.doctor_id,
      name: profile.name,
      email: profile.email,
      specialization: profile.specialization,
      availability: profile.availability
    });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateDoctorProfile(req, res) {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied, not a doctor' });
    }

    const userId = req.user.id;
    const { name, email, specialization, availability } = req.body;

    await pool.query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, userId]);
    await pool.query(`UPDATE doctors SET specialization = ?, availability = ? WHERE user_id = ?`, [specialization, availability, userId]);

    res.json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getPatientProfile,
  updatePatientProfile,
  getDoctorProfile,
  updateDoctorProfile
};
