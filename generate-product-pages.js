const fs = require('fs');
const path = require('path');

// Read the template
const template = fs.readFileSync('./product/template.html', 'utf8');
const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

// Create product directory if it doesn't exist
if (!fs.existsSync('./product')) {
    fs.mkdirSync('./product');
}

// Generate individual product pages
productsData.categories.forEach(category => {
    category.products.forEach(product => {
        const filename = `${product.id}.html`;
        const filepath = path.join('./product', filename);
        
        // Write the product page
        fs.writeFileSync(filepath, template, 'utf8');
        console.log(`Generated: ${filename}`);
    });
});

console.log('All product pages generated successfully!');