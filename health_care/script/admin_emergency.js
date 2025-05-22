document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login as admin.');
    window.location.href = '../login.html';
    return;
  }

  const tableBody = document.querySelector('#emergencyTable tbody');

  async function loadEmergencies() {
    try {
      const res = await fetch('http://localhost:5000/api/emergency', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const emergencies = await res.json();
      tableBody.innerHTML = '';

      if (!emergencies.length) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No active emergencies</td></tr>`;
        return;
      }

      emergencies.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${entry.patient_name}</td>
          <td>${entry.patient_email}</td>
          <td>${entry.reason || 'No reason provided'}</td>
          <td>${new Date(entry.triggered_at).toLocaleString()}</td>
          <td>
            <button class="resolve-btn" data-id="${entry.id}">Resolve</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error loading emergencies:', err);
      alert('Failed to load emergencies.');
    }
  }

  // Resolve emergency
  tableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('resolve-btn')) {
      const id = e.target.dataset.id;

      if (confirm('Mark this emergency as resolved?')) {
        try {
          const res = await fetch(`http://localhost:5000/api/emergency/resolve/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const data = await res.json();
          if (res.ok) {
            alert(data.message);
            loadEmergencies();
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (err) {
          console.error('Resolve failed:', err);
          alert('Server error during resolution.');
        }
      }
    }
  });

  loadEmergencies();
});
