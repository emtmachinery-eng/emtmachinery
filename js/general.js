  // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger animation
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });



           // Handle search form submission
        document.getElementById('nav-search-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('nav-search-input');
            const query = searchInput.value.trim();
            
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });

        function handleSearch(query) {
    const lowerQuery = query.toLowerCase();
    productsGrid.innerHTML = '';
    let found = false;

    productsData.categories.forEach(cat => {
        (cat.subcategories || []).forEach(sub => {
            (sub.products || []).forEach(prod => {
                if (
                    prod.name.toLowerCase().includes(lowerQuery) ||
                    prod.description.toLowerCase().includes(lowerQuery)
                ) {
                    productsGrid.appendChild(createProductCard(prod, cat.name));
                    found = true;
                }
            });
        });

        (cat.products || []).forEach(prod => {
            if (
                prod.name.toLowerCase().includes(lowerQuery) ||
                prod.description.toLowerCase().includes(lowerQuery)
            ) {
                productsGrid.appendChild(createProductCard(prod, cat.name));
                found = true;
            }
        });
    });

    pageTitle.textContent = `Search: ${query}`;
    currentCategory.textContent = `Search: ${query}`;
    history.pushState({}, '', `?search=${encodeURIComponent(query)}`);

    if (!found) {
        productsGrid.innerHTML = `<p>No products match your search.</p>`;
    }
}
