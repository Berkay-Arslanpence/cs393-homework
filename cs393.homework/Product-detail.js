const API_BASE = 'https://dummyjson.com/products';
const CART_API_BASE = 'https://dummyjson.com/carts'; // Correct cart endpoint
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch Product Details
async function fetchProductDetails() {
    try {
        const response = await fetch(`${API_BASE}/${productId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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
        <p>Rating: ${product.rating} (${product.reviews?.length || 0})</p>
        <p>Brand: ${product.brand || 'N/A'}</p>
        <p>Weight: ${product.weight || 'N/A'}</p>
        <p>Dimensions: ${product.dimensions?.width || 'N/A'} x ${product.dimensions?.height || 'N/A'} x ${product.dimensions?.depth || 'N/A'}</p>
        <p>Warranty: ${product.warrantyInformation || 'N/A'}</p>
        <p>Shipping Info: ${product.shippingInformation || 'N/A'}</p>
        <p>Availability: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <p>Return Policy: ${product.returnPolicy || 'N/A'}</p>
        <p>Minimum Order: ${product.minOrder || 1}</p>
    `;
}

// Add to Cart
document.getElementById('add-to-cart').addEventListener('click', async () => {
    console.log('Add to Cart button clicked');

    const quantity = document.getElementById('quantity').value;

    if (!productId || !quantity || quantity <= 0) {
        alert('Please select a valid quantity.');
        console.warn('Invalid productId or quantity');
        return;
    }

    const cartData = {
        userId: 1, // Simulated userId
        products: [{ id: Number(productId), quantity: Number(quantity) }]
    };

    console.log('Cart Data:', cartData);

    try {
        const response = await fetch(`${CART_API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartData),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const cart = await response.json();
        console.log('Cart Response:', cart);

        // Display Success Message
        const total = cart.total || 0;
        const discountedTotal = cart.discountedTotal || 0;

        alert(`✅ Success! Cart total: $${total}, Discounted total: $${discountedTotal}`);
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Failed to add to cart. Please try again.');
    }
});

// Back to Products Button
document.getElementById('back-to-products').addEventListener('click', () => {
    console.log('Back to Products button clicked');
    window.location.href = 'Products.html'; // Redirect to the Products page
});

// Initial Fetch
fetchProductDetails();
