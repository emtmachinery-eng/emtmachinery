document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('featured-products')) {
        initProductsShowcase();
    }
});

function initProductsShowcase() {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            renderCategoryButtons(data.categories);
            renderFeaturedProducts(data.categories, 'all', 'all');
            setupEventListeners(data.categories);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const container = document.getElementById('featured-products');
            if (container) {
                container.innerHTML = '<p class="error-message">Error loading products. Please check your products.json file.</p>';
            }
        });
}

function renderCategoryButtons(categories) {
    const container = document.getElementById('category-buttons');
    if (!container) return;

    container.innerHTML = '';

    // All Products
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'All Products';
    allBtn.dataset.category = 'all';
    allBtn.dataset.subcategory = 'all';
    container.appendChild(allBtn);

    // Loop categories and subcategories
    categories.forEach(category => {
        const catBtn = document.createElement('button');
        catBtn.className = 'category-btn';
        catBtn.textContent = category.name;
        catBtn.dataset.category = category.id;
        catBtn.dataset.subcategory = 'all';
        container.appendChild(catBtn);

        if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach(subcat => {
                const subBtn = document.createElement('button');
                subBtn.className = 'subcategory-btn';
                subBtn.textContent = `- ${subcat.name}`;
                subBtn.dataset.category = category.id;
                subBtn.dataset.subcategory = subcat.id;
                container.appendChild(subBtn);
            });
        }
    });
}

function renderFeaturedProducts(categories, categoryId = 'all', subcategoryId = 'all') {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = '';
    let productsToShow = [];

    if (categoryId === 'all') {
        categories.forEach(category => {
            category.subcategories.forEach(subcat => {
                subcat.products.forEach(product => {
                    productsToShow.push({
                        ...product,
                        categoryName: category.name.toUpperCase()
                    });
                });
            });
        });
    } else {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
            if (subcategoryId === 'all') {
                category.subcategories.forEach(subcat => {
                    subcat.products.forEach(product => {
                        productsToShow.push({
                            ...product,
                            categoryName: category.name.toUpperCase()
                        });
                    });
                });
            } else {
                const subcat = category.subcategories.find(s => s.id === subcategoryId);
                if (subcat) {
                    subcat.products.forEach(product => {
                        productsToShow.push({
                            ...product,
                            categoryName: category.name.toUpperCase()
                        });
                    });
                }
            }
        }
    }

    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }

    productsToShow.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const imagePath = `images/${product.categoryName}/${product.image}`;
    card.innerHTML = `
        <img src="${imagePath}" alt="${product.name}" class="product-image"
             onerror="handleImageError(this, '${product.image}')">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.currency} ${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <a href="product.html?id=${product.id}" class="btn-view">View Details</a>
            </div>
        </div>
    `;
    return card;
}

function setupEventListeners(categories) {
    document.querySelectorAll('.category-btn, .subcategory-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn, .subcategory-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderFeaturedProducts(categories, this.dataset.category, this.dataset.subcategory);
        });
    });
}
