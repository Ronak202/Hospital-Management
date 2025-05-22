const pool = require('../models/db');

// For doctor/admin: Get history by patient ID
exports.getPatientHistoryById = async (req, res) => {
  const patientId = req.params.id;

  try {
    const [result] = await pool.query('SELECT history FROM patients WHERE id = ?', [patientId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ history: result[0].history || 'No history available.' });
  } catch (err) {
    console.error('Error fetching patient history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

