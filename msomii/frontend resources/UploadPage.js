document.addEventListener('DOMContentLoaded', async () => {
  const uploadForm = document.getElementById('uploadForm');
  const messageDiv = document.getElementById('message');
  const categorySelect = document.getElementById('category');
  const fileInput = document.getElementById('file');
  const fileUpload = document.getElementById('file-upload');
  const fileName = document.getElementById('file-name');

  // Fetch categories
  try {
    const response = await fetch('http://localhost:5000/api/categories', {
      credentials: 'include',
    });
    const data = await response.json();
    console.log('Fetch Categories status:', response.status);
    console.log('Fetch Categories response:', data);
    if (response.ok) {
      if (data.data.length === 0) {
        messageDiv.textContent = 'No categories available';
        messageDiv.classList.add('error');
        messageDiv.style.display = 'block';
      } else {
        data.data.forEach(category => {
          const option = document.createElement('option');
          option.value = category._id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      }
    } else {
      messageDiv.textContent = data.error || 'Failed to load categories';
      messageDiv.classList.add('error');
      messageDiv.style.display = 'block';
    }
  } catch (err) {
    console.error('Fetch Categories Error:', err);
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.classList.add('error');
    messageDiv.style.display = 'block';
  }

  // File input change handler
  fileInput.addEventListener('change', () => {
    fileName.textContent = fileInput.files[0]?.name || 'No file selected';
  });

  // Click to open file input
  fileUpload.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag-and-drop handlers
  fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.classList.add('dragover');
  });

  fileUpload.addEventListener('dragleave', () => {
    fileUpload.classList.remove('dragover');
  });

  fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    fileName.textContent = fileInput.files[0]?.name || 'No file selected';
  });

  // Form submission
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('course-name').value);
    formData.append('description', document.getElementById('course-code').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      console.log('Upload response status:', response.status);
      console.log('Upload response data:', data);
      if (response.ok) {
        messageDiv.textContent = data.message; // "Resource uploaded"
        messageDiv.classList.add('success');
        messageDiv.classList.remove('error');
        messageDiv.style.display = 'block';
        uploadForm.reset();
        fileName.textContent = 'No file selected';
        setTimeout(() => {
          window.location.href = 'DocList.html';
        }, 1000);
      } else {
        messageDiv.textContent = data.error || 'Upload failed';
        messageDiv.classList.add('error');
        messageDiv.classList.remove('success');
        messageDiv.style.display = 'block';
      }
    } catch (err) {
      console.error('Upload Fetch Error:', err);
      messageDiv.textContent = 'Error: ' + err.message;
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
      messageDiv.style.display = 'block';
    }
  });
});