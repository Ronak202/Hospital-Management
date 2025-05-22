document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login first.');
    window.location.href = '../login.html';
    return;
  }

  const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');

  // Fetch appointments for this doctor
  async function fetchAppointments() {
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const appointments = await res.json();

      appointmentsTableBody.innerHTML = ''; // Clear existing rows

      if (!appointments.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align:center;">No appointments found</td>`;
        appointmentsTableBody.appendChild(tr);
        return;
      }

      appointments.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${app.patient_name || 'Unknown'}</td>
          <td>${new Date(app.appointment_time).toLocaleString()}</td>
          <td>${app.reason || ''}</td>
          <td>${app.status}</td>
          <td>
            ${app.status === 'pending' ? `
              <button class="approve-btn" data-id="${app.id}" data-status="approved">Approve</button>
              <button class="reject-btn" data-id="${app.id}" data-status="rejected">Reject</button>
            ` : ''}
          </td>
        `;
        appointmentsTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Could not load appointments.');
    }
  }

  // Update appointment status handler
  appointmentsTableBody.addEventListener('click', async (e) => {
    if (!e.target.dataset.id) return;

    const id = e.target.dataset.id;
    const status = e.target.dataset.status;

    try {
      const res = await fetch('http://localhost:5000/api/appointments/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Appointment status updated.');
        fetchAppointments(); // Refresh list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Server error.');
    }
  });

  // Initial load
  fetchAppointments();
});
