-- Active: 1744921430700@@127.0.0.1@3306@health_care
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS Health_Care;
USE Health_Care;

-- Users table: stores login info and roles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * from users;
SELECT * FROM users WHERE email = 'admin@example.com' AND role = 'admin';

-- Patients table: additional patient info
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    history TEXT,
    emergency_flag BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Doctors table: additional doctor info
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100),
    availability TEXT, -- e.g. JSON string or free text for simplicity
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO doctors (user_id, specialization, availability) VALUES (2, 'Cardiology', 'Mon-Fri 9am-5pm');
-- Appointments table: tracks appointment requests and status
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    appointment_time DATETIME NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
SELECT * FROM patients;
SELECT * FROM doctors;
SELECT * FROM appointments;



CREATE TABLE emergency_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
ALTER TABLE emergency_log
ADD COLUMN resolved_at DATETIME NULL;
select * from emergency_log;
DELIMITER //
ALTER TABLE emergency_log
ADD COLUMN reason TEXT;

CREATE TABLE admin_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

DELIMITER //

CREATE TRIGGER notify_admin_on_emergency
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
    DECLARE admin_id INT;
    DECLARE msg_text TEXT;

    IF NEW.emergency_flag = TRUE AND OLD.emergency_flag = FALSE THEN
        SET msg_text = CONCAT('🚨 Emergency triggered by patient ID: ', NEW.id);

        -- Assuming admin has a fixed user ID or role
        -- You can loop through all admins if there are multiple
        INSERT INTO admin_notifications(patient_id, message, created_at)
        VALUES (NEW.id, msg_text, NOW());
    END IF;
END;
//

DELIMITER ;
select * from emergency_log;

select * from admin_notifications;
SELECT * from messages;
