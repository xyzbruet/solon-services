// ==================== Configuration ====================
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api'; // Production URL

// ==================== State Management ====================
let currentGender = 'women';
let currentCategory = 'all';
let showPopularOnly = false;
let allServices = [];

// ==================== DOM Elements ====================
const servicesContainer = document.getElementById('servicesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const genderTabs = document.querySelectorAll('#genderTabs .nav-link');
const categoryLinks = document.querySelectorAll('.category-list .list-group-item');
const popularToggle = document.getElementById('popularOnlyToggle');
const checkCardForm = document.getElementById('checkCardForm');
const newCardForm = document.getElementById('newCardForm');
const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    initializeEventListeners();
});

// ==================== Event Listeners ====================
function initializeEventListeners() {
    // Gender tabs
    genderTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            currentGender = e.target.dataset.gender;
            filterServices();
        });
    });

    // Category filters
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterServices();
        });
    });

    // Popular toggle
    popularToggle.addEventListener('change', (e) => {
        showPopularOnly = e.target.checked;
        filterServices();
    });

    // Loyalty card forms
    checkCardForm.addEventListener('submit', handleCheckCard);
    newCardForm.addEventListener('submit', handleCreateCard);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== API Functions ====================
async function loadServices() {
    try {
        showLoading(true);
        const response = await fetch(`${API_URL}/services`);
        const data = await response.json();
        
        if (data.success) {
            allServices = data.data;
            filterServices();
            updateCategoryCounts();
        } else {
            throw new Error(data.error || 'Failed to load services');
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showError('Failed to load services. Please try again later.');
    } finally {
        showLoading(false);
    }
}

async function handleCheckCard(e) {
    e.preventDefault();
    const email = document.getElementById('checkEmail').value;
    
    try {
        const response = await fetch(`${API_URL}/loyalty-cards/${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (data.success) {
            displayLoyaltyCard(data.data);
        } else {
            showAlert('Card not found. Would you like to create a new loyalty card?', 'warning');
        }
    } catch (error) {
        console.error('Error checking card:', error);
        showAlert('Card not found', 'error');
    }
}

async function handleCreateCard(e) {
    e.preventDefault();
    
    const cardData = {
        name: document.getElementById('newName').value,
        email: document.getElementById('newEmail').value,
        phone: document.getElementById('newPhone').value
    };
    
    try {
        const response = await fetch(`${API_URL}/loyalty-cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Loyalty card created successfully!', 'success');
            newCardForm.reset();
            displayLoyaltyCard(data.data);
            // Switch to check card tab
            document.getElementById('check-card-tab').click();
        } else {
            showAlert(data.error || 'Failed to create card', 'error');
        }
    } catch (error) {
        console.error('Error creating card:', error);
        showAlert('Failed to create loyalty card', 'error');
    }
}

// ==================== Filter Functions ====================
function filterServices() {
    let filtered = allServices.filter(service => service.gender === currentGender);
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(service => service.category === currentCategory);
    }
    
    if (showPopularOnly) {
        filtered = filtered.filter(service => service.popular === true);
    }
    
    displayServices(filtered);
}

function updateCategoryCounts() {
    const categories = ['all', 'hair', 'skin', 'makeup', 'hands-feet', 'grooming'];
    
    categories.forEach(cat => {
        const count = cat === 'all' 
            ? allServices.filter(s => s.gender === currentGender).length
            : allServices.filter(s => s.gender === currentGender && s.category === cat).length;
        
        const badge = document.getElementById(`count-${cat}`);
        if (badge) {
            badge.textContent = count;
        }
    });
}

// ==================== Display Functions ====================
function displayServices(services) {
    if (services.length === 0) {
        servicesContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    servicesContainer.style.display = 'flex';
    noResults.style.display = 'none';
    
    servicesContainer.innerHTML = services.map(service => createServiceCard(service)).join('');
    
    // Add click event to cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = parseInt(card.dataset.serviceId);
            showServiceModal(serviceId);
        });
    });
}

function createServiceCard(service) {
    return `
        <div class="col">
            <div class="service-card fade-in" data-service-id="${service.id}">
                <div class="service-card-image">
                    <img src="${service.image}" alt="${service.name}" 
                         onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=${encodeURIComponent(service.name)}'">
                    ${service.popular ? '<div class="popular-badge"><i class="fas fa-star me-1"></i>Popular</div>' : ''}
                </div>
                <div class="service-card-body">
                    <span class="service-category-badge">
                        <i class="${getCategoryIcon(service.category)} me-1"></i>
                        ${capitalizeFirst(service.subcategory)}
                    </span>
                    <h3 class="service-card-title">${service.name}</h3>
                    <p class="service-card-description">${service.description}</p>
                    <div class="service-card-footer">
                        <div>
                            <div class="service-price">$${service.price}</div>
                            <div class="service-duration">
                                <i class="fas fa-clock me-1"></i>${service.duration}
                            </div>
                        </div>
                        <button class="btn btn-sm btn-primary">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showServiceModal(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    document.getElementById('modalServiceName').textContent = service.name;
    document.getElementById('modalServiceDescription').textContent = service.description;
    document.getElementById('modalServicePrice').textContent = service.price;
    document.getElementById('modalServiceDuration').textContent = service.duration;
    document.getElementById('modalServiceCategory').textContent = 
        `${capitalizeFirst(service.category)} - ${capitalizeFirst(service.subcategory)}`;
    
    const modalImage = document.getElementById('modalServiceImage');
    modalImage.src = service.image;
    modalImage.alt = service.name;
    modalImage.onerror = function() {
        this.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(service.name)}`;
    };
    
    serviceModal.show();
}

function displayLoyaltyCard(card) {
    const cardDisplay = document.getElementById('cardDisplay');
    
    cardDisplay.innerHTML = `
        <div class="loyalty-card-display">
            <div class="text-center mb-3">
                <i class="fas fa-award fa-3x mb-2"></i>
                <h4>${card.tier} Member</h4>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Name:</span>
                <span class="card-info-value">${card.name}</span>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Email:</span>
                <span class="card-info-value">${card.email}</span>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Points:</span>
                <span class="card-info-value">${card.points} pts</span>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Total Visits:</span>
                <span class="card-info-value">${card.visits}</span>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Total Spent:</span>
                <span class="card-info-value">$${card.totalSpent.toFixed(2)}</span>
            </div>
            <div class="card-info-row">
                <span class="card-info-label">Member Since:</span>
                <span class="card-info-value">${new Date(card.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="text-center mt-3">
                <small>Card ID: ${card.id}</small>
            </div>
        </div>
    `;
    
    cardDisplay.style.display = 'block';
}

// ==================== Utility Functions ====================
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    servicesContainer.style.display = show ? 'none' : 'flex';
}

function showError(message) {
    servicesContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4>Error</h4>
            <p class="text-muted">${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                <i class="fas fa-sync me-2"></i>Retry
            </button>
        </div>
    `;
}

function showAlert(message, type = 'info') {
    const alertTypes = {
        success: { class: 'success', icon: 'check-circle' },
        error: { class: 'danger', icon: 'exclamation-circle' },
        warning: { class: 'warning', icon: 'exclamation-triangle' },
        info: { class: 'info', icon: 'info-circle' }
    };
    
    const alert = alertTypes[type] || alertTypes.info;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${alert.class} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        <i class="fas fa-${alert.icon} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function getCategoryIcon(category) {
    const icons = {
        'hair': 'fas fa-cut',
        'skin': 'fas fa-spa',
        'makeup': 'fas fa-palette',
        'hands-feet': 'fas fa-hand-sparkles',
        'grooming': 'fas fa-user-tie'
    };
    return icons[category] || 'fas fa-circle';
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace('-', ' & ');
}

// ==================== Export for use in other scripts ====================
window.SalonApp = {
    loadServices,
    filterServices,
    showServiceModal,
    API_URL
};
