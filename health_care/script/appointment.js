document.addEventListener('DOMContentLoaded', loadDoctors);

async function loadDoctors() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/appointments/doctors', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch doctors');

    const doctors = await res.json();
    console.log('Doctors data:', doctors); // Debug: check what API returns

    const doctorSelect = document.getElementById('doctorId');
    const doctorsTableBody = document.querySelector('#doctorsTable tbody');

    // Clear existing options and table rows
    doctorSelect.innerHTML = '<option value="" disabled selected>-- Choose a Doctor --</option>';
    doctorsTableBody.innerHTML = '';

    doctors.forEach(doctor => {
      // Adjust property names here based on your API response
      const id = doctor.doctor_id ?? doctor.id ?? 'N/A';
      const name = doctor.doctor_name ?? doctor.name ?? 'Unknown';
      const specialization = doctor.specialization ?? 'N/A';
      const availability = doctor.availability ?? doctor.availability ?? 'N/A';

      // Dropdown option
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${name} (${specialization}) - ${availability}`;
      doctorSelect.appendChild(option);

      // Table row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${specialization}</td>
        <td>${availability}</td>
      `;
      doctorsTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load doctors:', err);
    alert('Unable to fetch doctor list.');
    // Show fallback option
    const doctorSelect = document.getElementById('doctorId');
    doctorSelect.innerHTML = '<option value="" disabled>No doctors available</option>';
  }
}

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const doctorSelect = document.getElementById('doctorId');
  const doctor_id = parseInt(doctorSelect.value, 10);
  const appointment_time = document.getElementById('appointmentTime').value.replace('T', ' ') + ':00';
  const reason = document.getElementById('reason').value.trim();

  // Client-side validation: Check if doctor_id exists in dropdown options
  const validDoctorIds = Array.from(doctorSelect.options).map(opt => parseInt(opt.value, 10));
  if (!validDoctorIds.includes(doctor_id)) {
    alert('Please select a valid doctor from the list.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/appointments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        doctor_id,
        appointment_time,
        reason
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Appointment booked successfully!');
      this.reset();
    } else {
      // Show backend error, e.g., unknown doctor_id or validation errors
      alert(`Error: ${data.message || 'Unknown error occurred'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Server error while booking appointment.');
  }
});
