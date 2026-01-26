document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log('Login response status:', response.status);
    console.log('Login response data:', data);
    if (response.ok) {
      if (data.token) {
        localStorage.setItem('token', data.token); // Optional: store for other uses
      }
      messageDiv.textContent = data.message; // "Login successful"
      messageDiv.classList.add('success');
      messageDiv.classList.remove('error');
      setTimeout(() => {
        window.location.href = 'HomePage.html'; // Redirect to HomePage.html
      }, 1000);
    } else {
      messageDiv.textContent = data.error || 'Login failed';
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
    }
    messageDiv.style.display = 'block';
  } catch (err) {
    console.error('Login Fetch Error:', err);
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.classList.add('error');
    messageDiv.classList.remove('success');
    messageDiv.style.display = 'block';
  }
});