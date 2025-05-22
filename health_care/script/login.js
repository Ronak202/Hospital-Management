document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  if (!role) {
    alert('Please select a role to login.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');  // <-- added login flag

      alert('Login successful!');

      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = 'dashboard/admin.html';
      } else if (data.user.role === 'doctor') {
        window.location.href = 'dashboard/doctor.html';
      } else {
        window.location.href = 'dashboard/patient.html';
      }
    } else {
      alert(`Login failed: ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert('Server error during login.');
  }
});
