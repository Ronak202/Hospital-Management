const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== IMPORT ROUTES =====
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');          // general user routes (optional)
const patientRoutes = require('./routes/patientRoutes');    // patient-specific routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const patientRoutes1 = require('./routes/patientRoutes1');
const profileRoutes = require('./routes/profileRoutes'); 
const adminAppointmentsRoutes = require('./routes/adminAppointmentsRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const manageUserRoutes = require('./routes/manageUserRoutes');

// ===== USE ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);           
app.use('/api/patients', patientRoutes);     
app.use('/api/appointments', appointmentRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/patients1', patientRoutes1);
app.use('/api/profile', profileRoutes);
app.use('/api/admin/appointments', adminAppointmentsRoutes);
app.use('/api', invoiceRoutes);
app.use('/api/manage-users', manageUserRoutes);

// ===== CENTRALIZED ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
