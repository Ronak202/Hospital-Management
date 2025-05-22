const pool = require('../models/db'); // ✅ Import the DB connection
const jwt = require('jsonwebtoken');

exports.getOwnHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all appointments of this patient
   const [rows] = await pool.query(`
  SELECT a.id, a.appointment_time, u.name AS doctor_name, a.reason
  FROM patients p
  JOIN appointments a ON a.patient_id = p.id
  JOIN doctors d ON d.id = a.doctor_id
  JOIN users u ON u.id = d.user_id
  WHERE p.user_id = ?
  ORDER BY a.appointment_time DESC
`, [userId]);


    if (rows.length === 0) {
      return res.status(404).json({ message: 'No history found' });
    }

    res.json({ history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

