document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
});

function fetchProducts() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            // Category Sidebar
            if (document.getElementById('category-list')) {
                renderCategoryList(data.categories);
            }

            // All Products Page
            if (document.getElementById('all-products')) {
                renderAllProducts(data.categories);
            }

            // Category Page
            const params = new URLSearchParams(window.location.search);
            const categoryId = params.get('category');
            if (categoryId && document.getElementById('products-grid')) {
                renderProductsByCategory(data.categories, categoryId);
            }

            // Product Detail Page
            const productId = params.get('id');
            if (productId && document.getElementById('product-detail')) {
                renderProductDetail(data.categories, productId);
            }
        })
        .catch(err => console.error('Error loading products:', err));
}

// Render Category Sidebar
function renderCategoryList(categories) {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <h2><a href="products.html?category=${category.id}">${category.name}</a></h2>
            <p>${category.description || ''}</p>
        `;
        categoryList.appendChild(categoryItem);
    });
}

// Render All Products
function renderAllProducts(categories) {
    const productsGrid = document.getElementById('all-products');
    productsGrid.innerHTML = '';
    categories.forEach(category => {
        (category.products || []).forEach(product => {
            productsGrid.appendChild(createProductCard(product, category.id));
        });
        (category.subcategories || []).forEach(sub => {
            (sub.products || []).forEach(product => {
                productsGrid.appendChild(createProductCard(product, category.id, sub.id));
            });
        });
    });
}

// Render Products by Category
function renderProductsByCategory(categories, categoryId) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
        productsGrid.innerHTML = '<p>No products found.</p>';
        return;
    }

    document.title = `${category.name} | EMT Machinery`;
    const categoryTitle = document.createElement('h1');
    categoryTitle.textContent = category.name;
    document.querySelector('main').prepend(categoryTitle);

    (category.products || []).forEach(product => {
        productsGrid.appendChild(createProductCard(product, category.id));
    });
    (category.subcategories || []).forEach(sub => {
        (sub.products || []).forEach(product => {
            productsGrid.appendChild(createProductCard(product, category.id, sub.id));
        });
    });
}

// Render Product Detail
function renderProductDetail(categories, productId) {
    let foundProduct = null;
    let foundCategory = '';
    let foundSub = '';

    categories.forEach(cat => {
        (cat.products || []).forEach(prod => {
            if (prod.id === productId) {
                foundProduct = prod;
                foundCategory = cat.name;
            }
        });
        (cat.subcategories || []).forEach(sub => {
            (sub.products || []).forEach(prod => {
                if (prod.id === productId) {
                    foundProduct = prod;
                    foundCategory = cat.name;
                    foundSub = sub.name;
                }
            });
        });
    });

    const detailContainer = document.getElementById('product-detail');

    if (!foundProduct) {
        detailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }

    document.title = `${foundProduct.name} | EMT Machinery`;

    detailContainer.innerHTML = `
        <h1>${foundProduct.name}</h1>
        <img src="images/${foundCategory}/${foundProduct.image}" alt="${foundProduct.name}">
        <p>${foundProduct.description}</p>
        <p><strong>Price:</strong> ${foundProduct.currency} ${foundProduct.price}</p>
        ${foundSub ? `<p><em>Subcategory:</em> ${foundSub}</p>` : ''}
    `;
}

// Create Product Card
function createProductCard(product, categoryId, subId = '') {
    const card = document.createElement('div');
    card.className = 'product-card';
    const imgPath = `images/${categoryId}/${product.image}`;
    card.innerHTML = `
        <a href="product.html?id=${product.id}">
            <img src="${imgPath}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                <strong>${product.currency} ${product.price}</strong>
            </div>
        </a>
    `;
    return card;
}
