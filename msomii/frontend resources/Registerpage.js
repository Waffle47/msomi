document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Form submitted');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const terms = document.getElementById('terms').checked;
  const messageDiv = document.getElementById('message');
  
  if (!terms) {
    messageDiv.textContent = 'You must agree to the terms of usage to register';
    messageDiv.classList.add('error');
    messageDiv.classList.remove('success');
    messageDiv.style.display = 'block';
    return;
  }

  try {
    const csrfToken = await getCsrfToken();
    console.log('CSRF Token:', csrfToken);
    console.log('Cookies before POST:', document.cookie);
    console.log('Sending POST to http://localhost:5000/api/auth/register');
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    if (response.ok) {
      messageDiv.textContent = data.message;
      messageDiv.classList.add('success');
      messageDiv.classList.remove('error');
      setTimeout(() => {
        window.location.href = 'HomePage.html';
      }, 1000);
    } else {
      messageDiv.textContent = data.error || 'Registration failed';
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
    }
    messageDiv.style.display = 'block';
  } catch (err) {
    console.error('Fetch Error:', err);
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.classList.add('error');
    messageDiv.classList.remove('success');
    messageDiv.style.display = 'block';
  }
});

async function getCsrfToken() {
  try {
    const response = await fetch('http://localhost:5000/api/csrf-token', {
      credentials: 'include',
    });
    console.log('CSRF response status:', response.status);
    console.log('CSRF response headers:', [...response.headers]);
    console.log('Cookies after CSRF fetch:', document.cookie);
    const data = await response.json();
    console.log('CSRF response data:', data);
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch CSRF token');
    }
    return data.csrfToken;
  } catch (err) {
    console.error('CSRF Fetch Error:', err);
    throw err;
  }
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.querySelector('.toggle-icon');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = '👁️‍🗨️';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = '👁️';
  }
}