document.addEventListener('DOMContentLoaded', function() {
    console.log('homepageScript.js loaded');
    // Get all necessary elements
    const homeButton = document.querySelector('.title-bar-home');
    const searchButton = document.querySelector('.search-btn');
    const menuButton = document.querySelector('.menu-btn');
    const categoriesButton = document.querySelector('.categories-btn');
    const titleBar = document.querySelector('.title-bar');
    
    if (!categoriesButton) {
        console.error('Categories button not found');
        return;
    }

    // Create search bar element
    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.style.display = 'none';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = "I'm looking for...";
    
    const closeSearch = document.createElement('button');
    closeSearch.className = 'close-search';
    closeSearch.innerHTML = '×';
    
    // Create search results dropdown
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';
    searchResults.style.position = 'absolute';
    searchResults.style.backgroundColor = '#fff';
    searchResults.style.border = '1px solid #ddd';
    searchResults.style.borderRadius = '4px';
    searchResults.style.maxHeight = '200px';
    searchResults.style.overflowY = 'auto';
    searchResults.style.width = '100%';
    searchResults.style.zIndex = '1000';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(closeSearch);
    searchContainer.appendChild(searchResults);
    searchBar.appendChild(searchContainer);
    titleBar.parentNode.insertBefore(searchBar, titleBar.nextSibling);
    
    // Create menu panel
    const menuPanel = document.createElement('div');
    menuPanel.className = 'menu-panel';
    
    const menuContent = document.createElement('div');
    menuContent.className = 'menu-content';
    
    const closeMenu = document.createElement('button');
    closeMenu.className = 'close-menu';
    closeMenu.innerHTML = '×';
    
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    
    // Add menu items with click handlers
    const menuItems = [
        { text: 'Upload', url: 'UploadPage.html' },
        { text: 'Log out', action: logout },
        { text: 'Account', url: 'Account.html' },
    ];
    
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = item.text;
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            if (item.url) {
                window.location.href = item.url;
            } else if (item.action) {
                item.action();
            }
        });
        
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    menuContent.appendChild(closeMenu);
    menuContent.appendChild(nav);
    menuPanel.appendChild(menuContent);
    document.body.appendChild(menuPanel);
    
    // Create categories panel
    const categoriesPanel = document.createElement('div');
    categoriesPanel.className = 'categories-panel';
    
    const closeCategories = document.createElement('button');
    closeCategories.className = 'close-categories';
    closeCategories.innerHTML = '×';
    
    const iframe = document.createElement('iframe');
    iframe.className = 'categories-iframe';
    iframe.src = 'categories.html';
    iframe.frameBorder = '0';
    iframe.onload = () => console.log('Categories iframe loaded');
    iframe.onerror = () => console.error('Categories iframe failed to load');
    
    categoriesPanel.appendChild(closeCategories);
    categoriesPanel.appendChild(iframe);
    document.body.appendChild(categoriesPanel);
    
    // Function to reset to default state
    function resetToDefault() {
        console.log('Resetting to default state');
        searchBar.style.display = 'none';
        searchResults.style.display = 'none';
        menuPanel.classList.remove('active');
        categoriesPanel.classList.remove('active');
        document.body.classList.remove('menu-open', 'categories-open');
    }
    
    // Event listeners
    homeButton.addEventListener('click', resetToDefault);
    
    searchButton.addEventListener('click', function() {
        console.log('Search button clicked');
        resetToDefault();
        searchBar.style.display = 'block';
        searchInput.focus();
    });
    
    closeSearch.addEventListener('click', function() {
        console.log('Close search clicked');
        searchBar.style.display = 'none';
        searchResults.style.display = 'none';
    });
    
    menuButton.addEventListener('click', function() {
        console.log('Menu button clicked');
        resetToDefault();
        menuPanel.classList.add('active');
        document.body.classList.add('menu-open');
    });
    
    closeMenu.addEventListener('click', function() {
        console.log('Close menu clicked');
        menuPanel.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    categoriesButton.addEventListener('click', function() {
        console.log('Categories button clicked');
        resetToDefault();
        categoriesPanel.classList.add('active');
        document.body.classList.add('categories-open');
    });
    
    closeCategories.addEventListener('click', function() {
        console.log('Close categories clicked');
        categoriesPanel.classList.remove('active');
        document.body.classList.remove('categories-open');
    });
    
    // Close panels when clicking on overlay
    document.body.addEventListener('click', function(e) {
        if (e.target === document.body && 
            (document.body.classList.contains('menu-open') || 
             document.body.classList.contains('categories-open'))) {
            console.log('Overlay clicked, resetting');
            resetToDefault();
        }
    });
    
    // Logout function
    async function logout() {
        console.log('Logout button clicked');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        document.body.appendChild(messageDiv);

        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            console.log('Logout response status:', response.status);
            const data = await response.json();
            console.log('Logout response data:', data);
            if (response.ok) {
                localStorage.removeItem('token'); // Clean up localStorage
                messageDiv.textContent = data.message; // "Logged out successfully"
                messageDiv.classList.add('success');
                messageDiv.style.display = 'block';
                setTimeout(() => {
                    messageDiv.remove();
                    window.location.href = 'LoginPage.html';
                }, 1000);
            } else {
                messageDiv.textContent = data.error || 'Logout failed';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
                setTimeout(() => messageDiv.remove(), 3000);
            }
        } catch (err) {
            console.error('Logout Fetch Error:', err);
            messageDiv.textContent = 'Error: ' + err.message;
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
            setTimeout(() => messageDiv.remove(), 3000);
        }
    }
    
    // Search input functionality with debounce
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    searchInput.addEventListener('input', debounce(async function() {
        const query = searchInput.value.trim();
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        
        if (query.length === 0) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/resources/search?q=${encodeURIComponent(query)}`, {
                credentials: 'include',
            });
            const results = await response.json();
            if (!response.ok) {
                throw new Error(results.error || 'Search failed');
            }
            
            if (results.data.length === 0) {
                searchResults.innerHTML = '<div style="padding: 10px; color: #666;">No results found</div>';
            } else {
                searchResults.innerHTML = results.data.map(result => `
                    <div style="padding: 10px; border-bottom: 1px solid #ddd; cursor: pointer;"
                         onclick="window.location.href='DocList.html?resourceId=${result._id}'">
                        ${result.title} - ${result.description}
                    </div>
                `).join('');
            }
            searchResults.style.display = 'block';
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div style="padding: 10px; color: #c62828;">Error: ' + error.message + '</div>';
            searchResults.style.display = 'block';
        }
    }, 300));
});