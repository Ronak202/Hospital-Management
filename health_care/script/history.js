document.addEventListener('DOMContentLoaded', async () => {
  const historyContainer = document.getElementById('history-container');
  const token = localStorage.getItem('token');

  if (!token) {
    historyContainer.textContent = 'Please log in first.';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/patients1/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    if (!data.history || data.history.length === 0) {
      historyContainer.textContent = 'No history available.';
      return;
    }

    // Create table header
    let html = `<table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Appointment ID</th>
          <th>Appointment Time</th>
          <th>Doctor Name</th>
          <th>History</th>
        </tr>
      </thead><tbody>`;

    // Fill table rows
    data.history.forEach(appt => {
      html += `<tr>
        <td>${appt.id}</td>
        <td>${new Date(appt.appointment_time).toLocaleString()}</td>
        <td>${appt.doctor_name}</td>
        <td>${appt.reason}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    historyContainer.innerHTML = html;
  } catch (err) {
    historyContainer.textContent = 'Failed to fetch history.';
    console.error(err);
  }
});