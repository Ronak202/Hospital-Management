const path = require('path');
const PDFDocument = require('pdfkit');
const pool = require('../models/db');

async function generateInvoice(req, res) {
  const appointmentId = req.params.id;

  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.appointment_time,
             du.name AS doctor_name,
             pu.name AS patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      WHERE a.id = ?
    `, [appointmentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctorFee = 500;
    const { patient_name, doctor_name, appointment_time } = rows[0];

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${appointmentId}.pdf`);

    doc.pipe(res);

    const bgPath = path.join(__dirname, '../../images/bg blur2.jpg');
    const logoPath = path.join(__dirname, '../../images/logo.png');
    const qrImagePath = path.join(__dirname, '../../images/qr.jpg');

    doc.image(bgPath, 0, 0, { width: 595, height: 842, opacity: 0.15 });

    // Logo only once at top-left
    doc.image(logoPath, 50, 45, { width: 100 });

    // Title bold & cursive
    doc
      .fillColor('#000')
      .font('Times-BoldItalic')
      .fontSize(30)
      .text('HealthCare Invoice', 0, 160, { align: 'center' });

    doc.moveDown(2);

    doc.font('Times-Roman').fontSize(20);

    // Appointment details centered
    doc
      .text(`Patient Name: ${patient_name}`, { align: 'center' })
      .text(`Doctor Name: ${doctor_name}`, { align: 'center' })
      .text(`Appointment Time: ${new Date(appointment_time).toLocaleString()}`, { align: 'center' })
      .text(`Consultation Fees: Rs${doctorFee}`, { align: 'center' });

    doc.moveDown(2);

    doc.fontSize(24).text('Thank you for visiting HealthCare.', { align: 'center' });

    // QR code below the thank you note, centered
    const pageWidth = 595;
    doc.image(qrImagePath, (pageWidth - 130) / 2, doc.y + 10, { width: 150 });

    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = { generateInvoice };
