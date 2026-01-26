document.addEventListener('DOMContentLoaded', async () => {
  console.log('categories.js loaded');
  const categoryContainer = document.getElementById('categoryContainer');
  if (!categoryContainer) {
    console.error('categoryContainer not found');
    return;
  }

  try {
    console.log('Fetching categories from http://localhost:5000/api/categories');
    const response = await fetch('http://localhost:5000/api/categories', {
      credentials: 'include',
    });
    const data = await response.json();
    console.log('Fetch Categories status:', response.status);
    console.log('Fetch Categories response:', data);
    
    if (response.ok) {
      if (data.data.length === 0) {
        categoryContainer.innerHTML = '<p>No categories found</p>';
        console.log('No categories to display');
        return;
      }

      let currentRow = document.createElement('div');
      currentRow.className = 'button-row';
      let count = 0;

      data.data.forEach(category => {
        // Convert category name to lowercase and replace spaces/ampersands for CSS class
        const categoryClass = `category-${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;
        console.log(`Processing category: ${category.name}, class: ${categoryClass}`);
        const button = document.createElement('a');
        button.href = `DocList.html?categoryId=${category._id}`;
        button.className = `big-button ${categoryClass}`;
        button.innerHTML = `
          <div class="button-bg"></div>
          <div class="button-overlay">
            <h2 class="button-title">${category.name}</h2>
          </div>
        `;
        currentRow.appendChild(button);
        count++;
        console.log(`Added button ${count}: ${category.name}`);

        // Create new row after every 3 buttons or at the end
        if (count % 3 === 0 || count === data.data.length) {
          categoryContainer.appendChild(currentRow);
          console.log(`Appended row with ${currentRow.childElementCount} buttons`);
          currentRow = document.createElement('div');
          currentRow.className = 'button-row';
        }
      });

      // Append any remaining row
      if (currentRow.childElementCount > 0) {
        categoryContainer.appendChild(currentRow);
        console.log(`Appended final row with ${currentRow.childElementCount} buttons`);
      }

      console.log(`Total buttons added: ${count}`);
    } else {
      categoryContainer.innerHTML = `<p>Error: ${data.error || 'Failed to load categories'}</p>`;
      console.log('Fetch failed:', data.error);
    }
  } catch (err) {
    console.error('Fetch Categories Error:', err);
    categoryContainer.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});