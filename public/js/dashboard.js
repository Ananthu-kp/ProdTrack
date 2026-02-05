const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '/';

let currentEditId = null;
let deleteProductId = null;
let allProducts = [];

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const productsGrid = document.getElementById('productsGrid');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');
const deleteModal = document.getElementById('deleteModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const cancelBtn = document.getElementById('cancelBtn');
const toast = document.getElementById('toast');

document.addEventListener('DOMContentLoaded', () => {
    userInfo.textContent = `Welcome, ${user.username}`;
    loadProducts();
    setupEvents();
});

function setupEvents() {
    navLinks.forEach(link => link.addEventListener('click', handleNav));
    logoutBtn.addEventListener('click', handleLogout);
    productForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);
    confirmDelete.addEventListener('click', handleDelete);
    cancelDelete.addEventListener('click', closeModal);
}

function handleNav(e) {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    e.currentTarget.classList.add('active');

    sections.forEach(s => s.classList.remove('active'));
    const section = e.currentTarget.dataset.section;
    document.getElementById(`${section}-section`).classList.add('active');

    if (section === 'products') loadProducts();
    if (section === 'reports') loadReports();
    if (section === 'add') resetForm();
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}

async function loadProducts() {
    try {
        productsGrid.innerHTML = '<p class="loading">Loading products...</p>';
        const res = await fetch('/api/products');
        const data = await res.json();

        if (data.success) {
            allProducts = data.data;
            displayProducts(allProducts);
        } else {
            productsGrid.innerHTML = '<p class="loading">Failed to load products</p>';
        }
    } catch (error) {
        console.error('Load products error:', error);
        productsGrid.innerHTML = '<p class="loading">Error loading products</p>';
    }
}

function displayProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="loading">No products found</p>';
        return;
    }

    productsGrid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="/uploads/${p.image}" alt="${p.name}" class="product-image"
                 onerror="this.src='/uploads/default-product.jpg'">
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <span class="product-category">${p.category || 'Other'}</span>
                <p class="product-description">${p.description || 'No description'}</p>
                <div class="product-details">
                    <div class="product-price">₹${parseFloat(p.price).toFixed(2)}</div>
                    <div class="product-quantity">Qty: ${p.quantity}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn-delete" onclick="openModal(${p.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase().trim();
    if (term === '') {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
    displayProducts(filtered);
}

async function editProduct(id) {
    try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success) {
            const p = data.data;
            document.querySelector('[data-section="add"]').click();

            currentEditId = p.id;
            document.getElementById('productId').value = p.id;
            document.getElementById('productName').value = p.name;
            document.getElementById('productCategory').value = p.category || 'Other';
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productQuantity').value = p.quantity;
            document.getElementById('productDescription').value = p.description || '';

            document.getElementById('formTitle').textContent = 'Edit Product';
            document.getElementById('submitBtn').textContent = 'Update Product';
        } else {
            showToast('Failed to load product', 'error');
        }
    } catch (error) {
        console.error('Edit product error:', error);
        showToast('Error loading product', 'error');
    }
}

function resetForm() {
    currentEditId = null;
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('submitBtn').textContent = 'Add Product';
}

// Submit Form - WITH VALIDATION
async function handleSubmit(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const quantity = document.getElementById('productQuantity').value;

    // Frontend validation
    const errors = [];
    if (!name) {
        errors.push('Product name is required');
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        errors.push('Valid price is required');
    }
    if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
        errors.push('Valid quantity is required');
    }

    // Show validation errors
    if (errors.length > 0) {
        showToast(errors.join(', '), 'error');
        return;
    }

    // Proceed with form submission
    const formData = new FormData(productForm);
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.disabled = true;
    submitBtn.textContent = currentEditId ? 'Updating...' : 'Adding...';

    try {
        const url = currentEditId ? `/api/products/${currentEditId}` : '/api/products';
        const method = currentEditId ? 'PUT' : 'POST';

        const res = await fetch(url, { method, body: formData });
        const data = await res.json();

        if (data.success) {
            showToast(data.message, 'success');
            resetForm();
            document.querySelector('[data-section="products"]').click();
            loadProducts();
        } else {
            // Handle backend errors
            if (data.errors && data.errors.length > 0) {
                showToast(data.errors.join(', '), 'error');
            } else {
                showToast(data.message || 'Failed to save product', 'error');
            }
        }
    } catch (error) {
        console.error('Submit error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? 'Update Product' : 'Add Product';
    }
}

// Delete Modal
function openModal(id) {
    deleteProductId = id;
    deleteModal.classList.add('active');
}

function closeModal() {
    deleteProductId = null;
    deleteModal.classList.remove('active');
}

// Delete Product
async function handleDelete() {
    if (!deleteProductId) return;

    const btn = confirmDelete;
    btn.disabled = true;
    btn.textContent = 'Deleting...';

    try {
        const res = await fetch(`/api/products/${deleteProductId}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            showToast('Product deleted successfully', 'success');
            loadProducts();
            closeModal();
        } else {
            showToast('Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Error deleting product', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Delete';
    }
}

// Load Reports
async function loadReports() {
    try {
        const res = await fetch('/api/products/report');
        const data = await res.json();

        if (data.success) {
            const r = data.data;
            document.getElementById('totalProducts').textContent = r.totalProducts;
            document.getElementById('totalValue').textContent = `₹${parseFloat(r.totalValue).toFixed(2)}`;
            document.getElementById('totalQuantity').textContent = r.totalQuantity;

            const categoryList = document.getElementById('categoryList');
            if (r.categoryBreakdown.length > 0) {
                categoryList.innerHTML = r.categoryBreakdown.map(c => `
                    <div class="category-item">
                        <span>${c.category || 'Other'}</span>
                        <span class="category-count">${c.count}</span>
                    </div>
                `).join('');
            } else {
                categoryList.innerHTML = '<p>No categories found</p>';
            }
        }
    } catch (error) {
        console.error('Load reports error:', error);
        showToast('Error loading reports', 'error');
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.editProduct = editProduct;
window.openModal = openModal;