document.addEventListener('DOMContentLoaded', () => {
  const emergencyBtn = document.getElementById('emergencyBtn');

  emergencyBtn.addEventListener('click', async () => {
    const reason = document.getElementById('reason').value.trim();
    const token = localStorage.getItem('token');

    if (!reason) {
      alert('Please enter the reason for the emergency.');
      return;
    }

    const confirmTrigger = confirm(`You entered:\n"${reason}"\n\nDo you want to trigger the emergency alert?`);
    if (!confirmTrigger) return;

    try {
      const res = await fetch('http://localhost:5000/api/emergency/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        document.getElementById('reason').value = '';
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send emergency request.');
    }
  });
});
