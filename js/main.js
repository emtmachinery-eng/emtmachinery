// main.js - Load categories on homepage
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('categories-container')) {
        fetchCategories();
    }
});

function fetchCategories() {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('categories-container');
            if (!container) return;
            
            container.innerHTML = ''; // Clear loading text
            
            data.categories.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.className = 'category-card';
                categoryCard.innerHTML = `
                    <a href="products/${category.id}/">
                        <img src="images/EMT LOGO.png" alt="${category.name}" onerror="this.src='images/placeholder.jpg'">
                        <div class="category-info">
                            <h3>${category.name}</h3>
                            <p>${category.description}</p>
                        </div>
                    </a>
                `;
                container.appendChild(categoryCard);
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            const container = document.getElementById('categories-container');
            if (container) {
                container.innerHTML = '<p>Error loading categories. Please check your products.json file.</p>';
            }
        });
}