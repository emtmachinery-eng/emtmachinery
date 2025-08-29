  // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
           
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                
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
