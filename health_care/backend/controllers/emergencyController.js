const pool = require('../models/db');

// controllers/emergencyController.js

// Patient requests emergency with reason
exports.requestEmergency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason is required' });
    }

    // Get patient profile by user id
    const [[patient]] = await pool.query(
      'SELECT id FROM patients WHERE user_id = ?',
      [userId]
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    console.log('Found patient:', patient);

    // Check if emergency already flagged
    const [[existing]] = await pool.query(
      'SELECT emergency_flag FROM patients WHERE id = ?',
      [patient.id]
    );

    if (!existing) {
      return res.status(404).json({ message: 'Patient not found for emergency check' });
    }

    console.log('Existing emergency_flag:', existing.emergency_flag);

    if (existing.emergency_flag) {
      return res.status(400).json({ message: 'Emergency already triggered' });
    }

    // Begin transaction (optional but safer)
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Flag emergency for patient
      const [flagResult] = await conn.query(
        'UPDATE patients SET emergency_flag = TRUE WHERE id = ?',
        [patient.id]
      );
      console.log('Flag emergency result:', flagResult);

      // Insert emergency log with reason
      const [insertResult] = await conn.query(
        'INSERT INTO emergency_log (patient_id, reason) VALUES (?, ?)',
        [patient.id, reason]
      );
      console.log('Insert emergency_log result:', insertResult);

      await conn.commit();
      res.json({ message: 'Emergency flagged successfully' });
    } catch (txErr) {
      await conn.rollback();
      console.error('Transaction error:', txErr);
      res.status(500).json({ message: 'Failed to flag emergency' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin fetches all active emergencies (unresolved)
exports.getEmergencies = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const [rows] = await pool.query(`
      SELECT 
        e.id, 
        e.patient_id, 
        e.reason,
        e.triggered_at, 
        e.resolved_at,
        p.emergency_flag,
        u.name AS patient_name, 
        u.email AS patient_email
      FROM emergency_log e
      JOIN patients p ON e.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE p.emergency_flag = TRUE AND e.resolved_at IS NULL
      ORDER BY e.triggered_at DESC
    `);

    console.log('Fetched emergencies:', rows.length);
    res.json(rows);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin resolves an emergency
exports.resolveEmergency = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { id } = req.params; // emergency_log id

    const [[entry]] = await pool.query(
      'SELECT patient_id FROM emergency_log WHERE id = ?',
      [id]
    );

    if (!entry) {
      return res.status(404).json({ message: 'Emergency entry not found' });
    }

    // Begin transaction (optional but recommended)
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Reset emergency_flag for patient
      const [flagResetResult] = await conn.query(
        'UPDATE patients SET emergency_flag = FALSE WHERE id = ?',
        [entry.patient_id]
      );
      console.log('Reset emergency_flag result:', flagResetResult);

      // Mark emergency_log entry as resolved
      const [resolveResult] = await conn.query(
        'UPDATE emergency_log SET resolved_at = NOW() WHERE id = ?',
        [id]
      );
      console.log('Resolved emergency_log result:', resolveResult);

      await conn.commit();
      res.json({ message: `Emergency resolved for patient ID ${entry.patient_id}` });
    } catch (txErr) {
      await conn.rollback();
      console.error('Transaction error:', txErr);
      res.status(500).json({ message: 'Failed to resolve emergency' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
