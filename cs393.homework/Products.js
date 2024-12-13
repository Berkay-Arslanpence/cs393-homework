const API_BASE = 'https://dummyjson.com/products';

let selectedCategory = ''; // Track the selected category
let selectedSort = ''; // Track the selected sorting option

// Fetch and populate categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        console.log('Categories fetched:', categories); // Debugging log
        populateCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Populate the categories dropdown
function populateCategories(categories) {
    const categoryDropdown = document.getElementById('categories');
    categoryDropdown.innerHTML = '<option value="">All Categories</option>'; // Reset dropdown

    categories.forEach((category) => {
        const option = document.createElement('option');

        // Check if the category is a string or an object
        if (typeof category === 'string') {
            option.value = category; // Use the string directly
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '); // Format display name
        } else if (typeof category === 'object' && category.name) {
            option.value = category.name; // Use the `name` property
            option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' '); // Format display name
        } else {
            console.warn('Unexpected category format:', category);
        }

        categoryDropdown.appendChild(option);
    });
}

// Normalize category names (replace spaces with hyphens)
function normalizeCategoryName(category) {
    return category.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
}

// Fetch and display products
async function fetchProducts(category = '', sort = '') {
    try {
        let url = `${API_BASE}`;
        if (category) {
            const normalizedCategory = normalizeCategoryName(category);
            url += `/category/${normalizedCategory}`;
        }

        console.log('Fetching from URL:', url); // Log the URL
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data); // Log the API response

        let products = data.products || [];

        // Apply sorting if specified
        if (sort === 'sort=price&order=asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'sort=price&order=desc') {
            products = products.sort((a, b) => b.price - a.price);
        }

        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products on the page
function displayProducts(products) {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = ''; // Clear existing products

    if (!products || products.length === 0) {
        productContainer.innerHTML = '<p>No products found for this category.</p>';
        return;
    }

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} (${product.ratingCount || 0})</p>
            <a href="product-detail.html?id=${product.id}" class="details-btn">View Details</a>
        `;
        productContainer.appendChild(productDiv);
    });

    console.log('Products rendered successfully.'); // Debugging log
}

// Event listener for category selection
document.getElementById('categories').addEventListener('change', (event) => {
    selectedCategory = event.target.value; // Update selected category
    console.log('Selected Category:', selectedCategory); // Debugging log
    fetchProducts(selectedCategory, selectedSort); // Fetch with filters
});

// Event listener for sorting
document.getElementById('sort').addEventListener('change', (event) => {
    const sortValue = event.target.value;
    if (sortValue === 'lowToHigh') {
        selectedSort = 'sort=price&order=asc';
    } else if (sortValue === 'highToLow') {
        selectedSort = 'sort=price&order=desc';
    } else {
        selectedSort = ''; // No sorting
    }
    fetchProducts(selectedCategory, selectedSort); // Fetch with filters
});

// Initial data fetch on page load
fetchCategories();
fetchProducts();
