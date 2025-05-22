# HealthCare
###  Live Site  
[🌐 healthcare2823ronak.netlify.app](https://healthcare2823ronak.netlify.app/)
###
A comprehensive **Hospital Management System** web application that allows **Admins, Doctors, and Patients** to manage appointments, medical records, emergency requests, and communications through dedicated dashboards.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Folder Structure](#folder-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Screenshots](#screenshots)  
- [Contributing](#contributing)  
- [Contact](#contact)  
- [License](#license)  

---

## Project Overview

This project is a Hospital Management Portal designed to streamline healthcare operations by providing a unified platform for managing doctor-patient interactions, appointments, health records, and emergency requests.

The portal supports three user roles with distinct capabilities:

- **Admin:** Manages doctors, patients, appointments, emergency cases, and invoice generation.  
- **Doctor:** Views and approves appointments, accesses patient medical histories, and manages consultations.  
- **Patient:** Books appointments, views medical history, and requests emergency help.

Additionally, the portal features a professional homepage with sections such as About Us, Services, Team, Testimonials, and Social Media links.

---

## Features

### Common

- Responsive homepage with navigation and informative sections  
- Role-based login and registration system  
- Secure access control and authorization  
- Role-based dashboard redirection  

### Admin Dashboard

- Manage doctors and patients (Create, Read, Update, Delete)  
- Manage appointments and generate invoices  
- Handle emergency requests from patients  
- View detailed reports and statistics  

### Doctor Dashboard

- View and approve appointments  
- Access and update patient medical records  
- Secure chat functionality (can be extended)
- Manage personal profile (update emmail info, specialization, etc.)  

### Patient Dashboard

- Book new appointments with doctors  
- View appointment history and medical records  
- Request emergency assistance  
- Profile management  

### Additional Features

- Emergency management workflow routed through Admin  
- Role verification before dashboard access  
- Easy navigation with logout functionality  

---

## Technologies Used

| Frontend          | Backend          | Database        | Tools & Libraries      |
| ----------------- | ---------------- | --------------- | --------------------- |
| HTML5, CSS3, JS   | Node.js, Express | MySQL           | FontAwesome, Flaticon  |
|                   |                  |                 | JWT, bcrypt, dotenv   |

---

## Folder Structure

- backend/  
  - controllers/ — Route controllers (appointment, auth, etc.)  
  - db/ — Database connection and queries  
  - middleware/ — Authentication middleware and input validation  
  - models/ — Database models (User, Doctor, Patient, etc.)  
  - routes/ — API route definitions  
  - utils/ — Utility/helper functions  
  - server.js — Main backend server file  

- css/ — Stylesheets for the frontend  
- dashboard/ — Role-based dashboards (Admin, Doctor, Patient)  
- images/ — Image assets (logos, banners, etc.)  
- script/ — JavaScript files for frontend interactivity  

- index.html — Home page  
- login.html — Login form  
- register.html — Registration form  

- .env — Environment variables (excluded from version control)  
- package.json — Project dependencies and scripts  
- package-lock.json — Exact dependency versions for reproducibility  


---

## 🧑‍💻 Usage

1. **Register** as a **Patient**, **Doctor**, or **Admin**
2. **Login** with your credentials
3. Access your **role-specific dashboard**
4. Manage your data:
   - 🗓️ Appointments
   - 📝 Medical Records
   - 🚨 Emergencies
   - 🧾 Invoices (**Admin only**)
   - 👤 Personal Profile
5. Navigate and explore homepage and dashboard features

---

## 📸 Screenshots

> Add your screenshots here:
- Home Page
  ![image](https://github.com/user-attachments/assets/d010c261-8b06-428f-be45-a008405570ae)
  ![image](https://github.com/user-attachments/assets/9c693208-8838-419a-a319-e2cdd91f7ae5)
  ![image](https://github.com/user-attachments/assets/6ad9d2c2-a36b-494b-b90d-a8accc23cf09)
  ![image](https://github.com/user-attachments/assets/d7ecb6b0-8dc8-438d-805d-cae4766cecab)
  ![image](https://github.com/user-attachments/assets/826e821b-89cc-4224-a08f-e98fef866257)
- Login Page
  ![image](https://github.com/user-attachments/assets/4fe79cca-9190-4bb8-8a55-77349ea09b0b)
- Admin Dashboard
   ![image](https://github.com/user-attachments/assets/280529ac-b62b-4a9d-a894-13b3be418ee1)
- Doctor Dashboard
  ![image](https://github.com/user-attachments/assets/09584ad5-8fdb-4105-8f34-4dae0e7f8050)
- Patient Dashboard
   ![image](https://github.com/user-attachments/assets/c30d7a88-cf6a-4112-950c-5af6698ba1b7)
- Invoice Generation
   - ![image](https://github.com/user-attachments/assets/7035552d-625b-481d-85ca-1b31831d5a7b)
- Emergency Popup
 ![image](https://github.com/user-attachments/assets/8565cb11-d1fd-4d08-aaaf-751112046e58)

---

### 📬 Contact

**Ronak Singh**  
📧 Email: [sronak2823@gmail.com](mailto:sronak2823@gmail.com)  

---


---
## 🚧 Future Improvements

The Hospital Management Portal can be further enhanced with the following features:

### 🔒 Security & Authentication
- [ ] Password reset functionality via email

### 📱 Frontend & UX Enhancements
- [ ] Fully responsive dashboards with React/Vue
- [ ] Dark mode and theme customization
- [ ] Enhanced form validation and inline error messages

### 📊 Admin Analytics Dashboard
- [ ] Graphical reports (appointments, revenue, patient stats)
- [ ] Monthly/yearly PDF report generation
- [ ] Doctor/department performance insights

### 🗂️ Medical Records & History
- [ ] Upload and manage medical files (PDFs, scans)
- [ ] File attachments for prescriptions and reports
- [ ] Advanced search/filter on records

### 🗣️ Real-time Chat System
- [ ] Integrate real-time chat using Socket.IO/WebSocket
- [ ] Allow file/image sharing in chat
- [ ] Chat history and logging for legal/medical use

### 📅 Appointment Management
- [ ] Doctor availability calendar with slot selection
- [ ] Email/SMS reminders for patients
- [ ] Cancel/reschedule appointment flow

### 🆘 Emergency Response System
- [ ] Optional geolocation integration for faster help
---


> Thank you for checking out the **Hospital Management Portal**!  
> **Stay healthy, stay secure.** 🏥








