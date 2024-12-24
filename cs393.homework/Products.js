const API_BASE = 'https://dummyjson.com/products';

let selectedCategory = ''; 
let selectedSort = ''; 
let selectedSearchTerm = ''; // Track search term globally

// Fetch Categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        console.log('Categories fetched:', categories); 
        populateCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Populate Categories Dropdown
function populateCategories(categories) {
    const categoryDropdown = document.getElementById('categories');
    categoryDropdown.innerHTML = '<option value="">All Categories</option>'; 

    categories.forEach((category) => {
        const option = document.createElement('option');

        if (typeof category === 'string') {
            option.value = category; 
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '); 
        } else if (typeof category === 'object' && category.name) {
            option.value = category.name; 
            option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' '); 
        } else {
            console.warn('Unexpected category format:', category);
        }

        categoryDropdown.appendChild(option);
    });
}

// Normalize Category Name
function normalizeCategoryName(category) {
    return category.replace(/\s+/g, '-').toLowerCase(); 
}

// Fetch Products (with Search, Category, Sort)
async function fetchProducts(category = '', sort = '', search = '') {
    try {
        let url = `${API_BASE}`;

        if (search) {
            url += `/search?q=${encodeURIComponent(search)}`;
        } else if (category) {
            const normalizedCategory = normalizeCategoryName(category);
            url += `/category/${normalizedCategory}`;
        }

        console.log('Fetching from URL:', url); 
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data); 

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

// Handle Search Button Click
document.getElementById('search-btn').addEventListener('click', async () => {
    selectedSearchTerm = document.getElementById('search-bar').value.trim();
    selectedCategory = ''; // Reset category
    console.log('Search Term:', selectedSearchTerm);

    if (!selectedSearchTerm) {
        alert('Please enter a search term.');
        return;
    }

    fetchProducts('', selectedSort, selectedSearchTerm);
});

// Display Products
function displayProducts(products) {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = ''; 

    if (!products || products.length === 0) {
        productContainer.innerHTML = '<p>No products found.</p>';
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
            <p>Rating: ${product.rating} (${product.reviews?.length || 0})</p>
            <a href="product-detail.html?id=${product.id}" class="details-btn">View Details</a>
        `;
        productContainer.appendChild(productDiv);
    });

    console.log('Products rendered successfully.'); 
}

// Handle Category Selection
document.getElementById('categories').addEventListener('change', (event) => {
    selectedCategory = event.target.value; 
    console.log('Selected Category:', selectedCategory);

    // Clear search term if a category is selected
    if (selectedCategory) {
        selectedSearchTerm = '';
        document.getElementById('search-bar').value = '';
    }

    fetchProducts(selectedCategory, selectedSort, selectedSearchTerm);
});

// Handle Sorting Selection
document.getElementById('sort').addEventListener('change', (event) => {
    const sortValue = event.target.value;
    if (sortValue === 'lowToHigh') {
        selectedSort = 'sort=price&order=asc';
    } else if (sortValue === 'highToLow') {
        selectedSort = 'sort=price&order=desc';
    } else {
        selectedSort = '';
    }

    fetchProducts(selectedCategory, selectedSort, selectedSearchTerm);
});

// Initial Fetch
fetchCategories();
fetchProducts();
