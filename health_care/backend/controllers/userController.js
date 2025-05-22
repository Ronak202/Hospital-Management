const pool = require('../models/db');
const bcrypt = require('bcryptjs');

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, availability } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'doctor')`,
      [name, email, hashedPassword]
    );

    const userId = userResult.insertId;

    await pool.query(
      `INSERT INTO doctors (user_id, specialization, availability) VALUES (?, ?, ?)`,
      [userId, specialization, availability]
    );

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, u.name, u.email, d.specialization, d.availability 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const [[doctorRow]] = await pool.query(
      `SELECT user_id FROM doctors WHERE id = ?`,
      [doctorId]
    );

    if (!doctorRow) return res.status(404).json({ error: 'Doctor not found' });

    const userId = doctorRow.user_id;

    await pool.query(`DELETE FROM users WHERE id = ?`, [userId]);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addDoctor, getDoctors, deleteDoctor };
