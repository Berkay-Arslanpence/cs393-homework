const API_BASE = 'https://dummyjson.com/products';
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch Product Details
async function fetchProductDetails() {
    try {
        const response = await fetch(`${API_BASE}/${productId}`);
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('product-details').innerHTML = '<p>Failed to load product details.</p>';
    }
}

// Display Product Details
function displayProductDetails(product) {
    const detailsContainer = document.getElementById('product-details');
    detailsContainer.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" />
        <h2>${product.title}</h2>
        <p>Price: $${product.price}</p>
        <p>Rating: ${product.rating} (${product.reviews.length})</p>
        <p>Brand: ${product.brand}</p>
        <p>Weight: ${product.weight || 'N/A'}</p>
        <p>Dimensions: ${product.dimensions.width + " x " + product.dimensions.height + " x " + product.dimensions.depth || 'N/A'}</p>
        <p>Warranty: ${product.warrantyInformation || 'N/A'}</p>
        <p>Shipping Info: ${product.shippingInformation || 'N/A'}</p>
        <p>Availability: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <p>Return Policy: ${product.returnPolicy || 'N/A'}</p>
        <p>Minimum Order: ${product.minOrder || 1}</p>
    `;
}

// Add to Cart
document.getElementById('add-to-cart').addEventListener('click', async () => {
    const quantity = document.getElementById('quantity').value;
    const cartData = {
        products: [{ id: productId, quantity: Number(quantity) }],
    };

    try {
        const response = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartData),
        });
        const cart = await response.json();
        alert(`Success! Cart total: $${cart.total}, Discounted total: $${cart.discountedTotal}`);
    } catch (error) {
        alert('Error adding to cart.');
        console.error('Error:', error);
    }
});
const backButton = document.getElementById('back-to-products');
backButton.addEventListener('click', () => {
    window.location.href = 'Products.html'; // Redirect to the Products page
});

// Initial Fetch
fetchProductDetails();
