document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.getElementById('fetchBtn');
  const historyContainer = document.getElementById('history-container');
  const errorDiv = document.getElementById('error');

  async function fetchPatientHistory(patientId) {
    errorDiv.textContent = '';
    historyContainer.textContent = 'Loading...';

    const token = localStorage.getItem('token');
    if (!token) {
      errorDiv.textContent = 'You must be logged in to view patient history.';
      historyContainer.textContent = '';
      return;
    }

    try {
      // NOTE: Use full backend URL with port number
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please login.');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to view this history.');
        } else if (response.status === 404) {
          throw new Error('Patient not found.');
        } else {
          throw new Error('Failed to fetch history.');
        }
      }

      const data = await response.json();
      const cleanedHistory = data.history.replace(/GMT[^\s)]+ \([^)]+\)/g, '');
      historyContainer.textContent = data.history || 'No history available.';
    } catch (error) {
      historyContainer.textContent = '';
      errorDiv.textContent = error.message;
    }
  }

  fetchBtn.addEventListener('click', () => {
    const patientId = document.getElementById('patientIdInput').value.trim();
    if (patientId === '' || isNaN(patientId) || patientId <= 0) {
      errorDiv.textContent = 'Please enter a valid patient ID.';
      historyContainer.textContent = '';
      return;
    }

    fetchPatientHistory(patientId);
  });
});
