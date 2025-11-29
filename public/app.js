
const API_BASE = window.location.protocol === 'file:'
    ? 'http://localhost:3000'
    : window.location.origin;

function getUserId() {
    let userId = localStorage.getItem('ecommerce_user_id');
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('ecommerce_user_id', userId);
    }
    return userId;
}

let USER_ID = getUserId();

const PRODUCTS = [
    { id: 'prod-1', name: 'Wireless Headphones', price: 79.99, description: 'High-quality wireless headphones with noise cancellation' },
    { id: 'prod-2', name: 'Smart Watch', price: 199.99, description: 'Feature-rich smartwatch with health tracking' },
    { id: 'prod-3', name: 'Laptop Stand', price: 49.99, description: 'Ergonomic aluminum laptop stand' },
    { id: 'prod-4', name: 'USB-C Hub', price: 39.99, description: '7-in-1 USB-C hub with multiple ports' },
    { id: 'prod-5', name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical keyboard with Cherry MX switches' },
    { id: 'prod-6', name: 'Webcam HD', price: 69.99, description: '1080p HD webcam with built-in microphone' }
];

// State
let cart = [];
let orders = [];
let appliedDiscount = null;
let orderCount = 0;

const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const discountRow = document.getElementById('discount-row');
const discountAmount = document.getElementById('discount-amount');
const discountCodeInput = document.getElementById('discount-code');
const ordersList = document.getElementById('orders-list');
const statsPanel = document.getElementById('stats-panel');
const discountCodesList = document.getElementById('discount-codes-list');


async function init() {
    document.getElementById('user-id-display').textContent = USER_ID;

    renderProducts();
    await loadCart();
    await loadStats();
}

function changeUserId() {
    const newId = prompt('Enter new User ID:', USER_ID);
    if (newId && newId.trim()) {
        USER_ID = newId.trim();
        localStorage.setItem('ecommerce_user_id', USER_ID);
        document.getElementById('user-id-display').textContent = USER_ID;

        cart = [];
        orders = [];
        appliedDiscount = null;

        loadCart();
        renderOrders();
        showToast(`Switched to user: ${USER_ID}`, 'info');
    }
}


function renderProducts() {
    productsGrid.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <p class="description">${product.description}</p>
            <div class="quantity-control">
                <button onclick="changeQuantity('${product.id}', -1)">-</button>
                <input type="number" id="qty-${product.id}" value="1" min="1" max="99">
                <button onclick="changeQuantity('${product.id}', 1)">+</button>
            </div>
            <button class="btn btn-primary btn-add-cart" onclick="addToCart('${product.id}')">
                Add to Cart
            </button>
        </div>
    `).join('');
}


function changeQuantity(productId, delta) {
    const input = document.getElementById(`qty-${productId}`);
    const newValue = Math.max(1, Math.min(99, parseInt(input.value) + delta));
    input.value = newValue;
}


async function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);

    try {
        const response = await fetch(`${API_BASE}/cart/${USER_ID}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: product.name,
                price: product.price,
                quantity: quantity
            })
        });

        if (!response.ok) throw new Error('Failed to add item');

        const data = await response.json();
        cart = data.cart;
        renderCart();
        showToast(`Added ${quantity}x ${product.name} to cart`, 'success');

        document.getElementById(`qty-${productId}`).value = 1;
    } catch (error) {
        showToast('Failed to add item to cart', 'error');
        console.error(error);
    }
}


async function loadCart() {
    try {
        const response = await fetch(`${API_BASE}/cart/${USER_ID}`);
        const data = await response.json();
        cart = data.cart;
        renderCart();
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
}


function renderCart() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-actions">
                <input type="number" value="${item.quantity}" min="1" max="99"
                       onchange="updateQuantity('${item.id}', this.value)">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')" title="Remove item">
                    &times;
                </button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
    cartSummary.style.display = 'block';
}


function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    if (appliedDiscount) {
        const discount = subtotal * 0.10;
        discountAmount.textContent = `-$${discount.toFixed(2)}`;
        discountRow.style.display = 'flex';
        cartTotal.textContent = `$${(subtotal - discount).toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
}


async function updateQuantity(itemId, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) return removeFromCart(itemId);

    try {
        const response = await fetch(`${API_BASE}/cart/${USER_ID}/items/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        const data = await response.json();
        cart = data.cart;
        renderCart();
    } catch (error) {
        showToast('Failed to update quantity', 'error');
        console.error(error);
    }
}


async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_BASE}/cart/${USER_ID}/items/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to remove item');

        const data = await response.json();
        cart = data.cart;
        renderCart();
        showToast('Item removed from cart', 'info');
    } catch (error) {
        showToast('Failed to remove item', 'error');
        console.error(error);
    }
}


function applyDiscount() {
    const code = discountCodeInput.value.trim();
    if (!code) {
        showToast('Please enter a discount code', 'error');
        return;
    }

    appliedDiscount = code;
    updateCartSummary();
    showToast('Discount code applied! Will be validated at checkout.', 'success');
}


async function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    try {
        const body = {};
        if (appliedDiscount) {
            body.discountCode = appliedDiscount;
        }

        const response = await fetch(`${API_BASE}/checkout/${USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error === 'invalid_discount') {
                showToast('Invalid or expired discount code', 'error');
                appliedDiscount = null;
                discountCodeInput.value = '';
                updateCartSummary();
                return;
            }
            throw new Error(data.error || 'Checkout failed');
        }

        // Success!
        orders.unshift(data.order);
        cart = [];
        appliedDiscount = null;
        discountCodeInput.value = '';

        renderCart();
        renderOrders();
        await loadStats();

        showToast(`Order placed successfully! Total: $${data.order.total.toFixed(2)}`, 'success');
    } catch (error) {
        showToast('Checkout failed: ' + error.message, 'error');
        console.error(error);
    }
}


function renderOrders() {
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No orders yet</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id.slice(0, 8)}</span>
                <span class="order-date">${new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            ${order.discount > 0 ? `
                <div class="order-discount">
                    Discount applied: -$${order.discount.toFixed(2)} (Code: ${order.codeUsed})
                </div>
            ` : ''}
            <div class="order-total">
                <span>Total</span>
                <span>$${order.total.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}


async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`);
        const stats = await response.json();

        document.getElementById('stat-items').textContent = stats.itemsPurchasedCount;
        document.getElementById('stat-revenue').textContent = `$${stats.totalPurchaseAmount.toFixed(2)}`;
        document.getElementById('stat-discounts').textContent = `$${stats.totalDiscountAmount.toFixed(2)}`;

        orderCount = Math.floor(stats.itemsPurchasedCount > 0 ?
            (stats.discountCodes.length * 3) + (stats.discountCodes.some(d => !d.used) ? 0 :
                (stats.itemsPurchasedCount % 3 === 0 ? 3 : stats.itemsPurchasedCount % 3)) : 0);

        const ordersFromDiscounts = stats.discountCodes.length * 3;
        document.getElementById('stat-orders').textContent = ordersFromDiscounts ||
            (stats.itemsPurchasedCount > 0 ? '~' + Math.ceil(stats.itemsPurchasedCount / 2) : '0');

        if (stats.discountCodes.length === 0) {
            discountCodesList.innerHTML = '<li>No discount codes generated yet</li>';
        } else {
            discountCodesList.innerHTML = stats.discountCodes.map(dc => `
                <li>
                    <span class="code-value">${dc.code}</span>
                    <span class="code-status ${dc.used ? 'used' : 'available'}">
                        ${dc.used ? 'Used' : 'Available'}
                    </span>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}


async function generateDiscount() {
    try {
        const response = await fetch(`${API_BASE}/admin/discounts/generate`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error === 'not_available') {
                showToast('Discount not available yet. Need more orders (every 3rd order).', 'error');
                return;
            }
            throw new Error(data.error);
        }

        showToast(`Discount code generated: ${data.discount.code}`, 'success');
        await loadStats();
    } catch (error) {
        showToast('Failed to generate discount: ' + error.message, 'error');
        console.error(error);
    }
}


async function resetStore() {
    if (!confirm('Are you sure you want to reset all store data? This will clear all carts, orders, and discount codes.')) {
        return;
    }

    try {
        await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });

        cart = [];
        orders = [];
        appliedDiscount = null;
        discountCodeInput.value = '';

        renderCart();
        renderOrders();
        await loadStats();

        showToast('Store has been reset', 'info');
    } catch (error) {
        showToast('Failed to reset store', 'error');
        console.error(error);
    }
}


function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
