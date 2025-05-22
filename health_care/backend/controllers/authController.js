const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) 
      return res.status(400).json({ message: 'Email already registered' });

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into users table
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
      [name, email, hashedPassword, role || 'patient']
    );

    // Depending on role, create corresponding entry in patients or doctors table
    if (role === 'patient') {
      await pool.query('INSERT INTO patients (user_id) VALUES (?)', [result.insertId]);
    } else if (role === 'doctor') {
      await pool.query('INSERT INTO doctors (user_id) VALUES (?)', [result.insertId]);
    } else if (role === 'admin') {
      // Optional: Add admin-specific logic here if needed
      console.log('Admin registered');
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  // Role is required in the login request
  if (!role) {
    return res.status(400).json({ message: 'Role is required for login' });
  }

  try {
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) 
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];

    // Check if role matches
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: `Role mismatch. You are registered as '${user.role}'` });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) 
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token with user id, role, and name
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respond with token and user info
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
