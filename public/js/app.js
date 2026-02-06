// ==================== Configuration ====================
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api'; // Production URL

// ==================== Data Management ====================
let servicesData = [];
let loyaltyCards = [];

// Load data from API or fallback to JSON
async function loadData() {
    try {
        // Try API first
        const response = await fetch(`${API_URL}/services`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                servicesData = data.data || [];
                initializeApp();
                return;
            }
        }
        throw new Error('API not available');
    } catch (error) {
        console.log('API not available, loading from local JSON...');
        // Fallback to local JSON
        try {
            const response = await fetch('data/services.json');
            const data = await response.json();
            servicesData = data.services || [];
            loyaltyCards = data.loyaltyCards || [];
            initializeApp();
        } catch (jsonError) {
            console.error('Error loading data:', jsonError);
            servicesData = [];
            loyaltyCards = [];
            initializeApp();
        }
    }
}

// ==================== Initialization ====================
function initializeApp() {
    renderAllServices();
    updateServiceCounts();
    initializeEventListeners();
}

// ==================== Service Rendering ====================
function renderAllServices() {
    // Render Ladies Services
    renderServicesByGenderAndCategory('women', 'hair', 'ladiesHair');
    renderServicesByGenderAndCategory('women', 'makeup', 'ladiesMakeup');
    renderServicesByGenderAndCategory('women', 'skin', 'ladiesSkin');
    renderServicesByGenderAndCategory('women', 'hands-feet', 'ladiesHandsFeet');

    // Render Gents Services
    renderServicesByGenderAndCategory('men', 'hair', 'gentsHair');
    renderServicesByGenderAndCategory('men', 'grooming', 'gentsGrooming');
    renderServicesByGenderAndCategory('men', 'skin', 'gentsSkin');
    renderServicesByGenderAndCategory('men', 'hands-feet', 'gentsHandsFeet');
}

function renderServicesByGenderAndCategory(gender, category, containerId) {
    const container = document.querySelector(`#${containerId} .accordion-body .row`);
    if (!container) return;

    const filteredServices = servicesData.filter(service => 
        service.gender === gender && service.category === category
    );

    if (filteredServices.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p class="text-muted">No services available in this category</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredServices.map(service => createServiceCard(service)).join('');
}

function createServiceCard(service) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="service-card" onclick="showServiceModal(${service.id})">
                <div class="service-card-image">
                    <img src="${service.image || 'images/default.jpg'}" alt="${service.name}">
                    ${service.popular ? '<span class="popular-badge"><i class="fas fa-star me-1"></i>Popular</span>' : ''}
                </div>
                <div class="service-card-body">
                    <span class="service-category-badge">
                        <i class="fas fa-${getCategoryIcon(service.category)} me-1"></i>
                        ${formatCategory(service.category)}
                    </span>
                    <h5 class="service-card-title">${service.name}</h5>
                    <p class="service-card-description">${service.description}</p>
                    <div class="service-card-footer">
                        <div>
                            <div class="service-price">$${service.price}</div>
                            <div class="service-duration">
                                <i class="fas fa-clock"></i>
                                ${service.duration}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== Service Counts ====================
function updateServiceCounts() {
    // Ladies counts
    updateCategoryCount('women', 'hair', 'ladiesHair');
    updateCategoryCount('women', 'makeup', 'ladiesMakeup');
    updateCategoryCount('women', 'skin', 'ladiesSkin');
    updateCategoryCount('women', 'hands-feet', 'ladiesHandsFeet');

    // Gents counts
    updateCategoryCount('men', 'hair', 'gentsHair');
    updateCategoryCount('men', 'grooming', 'gentsGrooming');
    updateCategoryCount('men', 'skin', 'gentsSkin');
    updateCategoryCount('men', 'hands-feet', 'gentsHandsFeet');
}

function updateCategoryCount(gender, category, containerId) {
    const count = servicesData.filter(service => 
        service.gender === gender && service.category === category
    ).length;

    const badge = document.querySelector(`#${containerId} .service-count`);
    if (badge) {
        badge.textContent = count;
    }
}

// ==================== Modal Functions ====================
function showServiceModal(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;

    document.getElementById('modalServiceName').textContent = service.name;
    document.getElementById('modalServiceDescription').textContent = service.description;
    document.getElementById('modalServicePrice').textContent = service.price;
    document.getElementById('modalServiceDuration').textContent = service.duration;
    document.getElementById('modalServiceCategory').textContent = formatCategory(service.category);
    document.getElementById('modalServiceImage').src = service.image || 'images/default.jpg';
    document.getElementById('modalServiceImage').alt = service.name;

    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
}

// ==================== Loyalty Card Functions ====================
function checkLoyaltyCard(email) {
    // Try API first
    fetch(`${API_URL}/loyalty-cards/${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                displayLoyaltyCard(data.data);
            } else {
                throw new Error('Card not found');
            }
        })
        .catch(error => {
            console.log('API not available, checking local data...');
            // Fallback to local data
            const card = loyaltyCards.find(c => c.email.toLowerCase() === email.toLowerCase());
            
            if (card) {
                displayLoyaltyCard(card);
            } else {
                showAlert('No loyalty card found with this email address.', 'warning');
            }
        });
}

function createLoyaltyCard(name, email, phone) {
    const cardData = { name, email, phone };
    
    // Try API first
    fetch(`${API_URL}/loyalty-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data) {
            displayLoyaltyCard(data.data);
            showAlert('Loyalty card created successfully!', 'success');
        } else {
            throw new Error(data.error || 'Failed to create card');
        }
    })
    .catch(error => {
        console.log('API not available, using local storage...');
        // Fallback to local storage
        const existingCard = loyaltyCards.find(c => c.email.toLowerCase() === email.toLowerCase());
        
        if (existingCard) {
            showAlert('A loyalty card with this email already exists!', 'warning');
            return;
        }

        const newCard = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            points: 0,
            visits: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
            tier: 'Bronze'
        };

        loyaltyCards.push(newCard);
        saveData();
        displayLoyaltyCard(newCard);
        showAlert('Loyalty card created successfully!', 'success');
    });
}

function displayLoyaltyCard(card) {
    const tier = getTier(card.points);
    const discount = getDiscount(tier);
    const nextTier = getNextTier(tier);
    const pointsToNext = getPointsToNextTier(card.points);

    const displayHtml = `
        <div class="loyalty-card-display">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4><i class="fas fa-id-card me-2"></i>Loyalty Card</h4>
                <span class="badge bg-light text-dark fs-6">${tier}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Name</span>
                <span class="card-info-value">${card.name}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Email</span>
                <span class="card-info-value">${card.email}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Phone</span>
                <span class="card-info-value">${card.phone}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Points</span>
                <span class="card-info-value">${card.points} pts</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Total Visits</span>
                <span class="card-info-value">${card.visits}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Total Spent</span>
                <span class="card-info-value">$${card.totalSpent.toFixed(2)}</span>
            </div>
            
            <div class="card-info-row">
                <span class="card-info-label">Your Discount</span>
                <span class="card-info-value">${discount}%</span>
            </div>
            
            ${nextTier ? `
                <div class="mt-3 p-3 bg-light bg-opacity-25 rounded">
                    <small>
                        <i class="fas fa-arrow-up me-2"></i>
                        ${pointsToNext} more points to reach ${nextTier}
                    </small>
                </div>
            ` : `
                <div class="mt-3 p-3 bg-light bg-opacity-25 rounded">
                    <small>
                        <i class="fas fa-trophy me-2"></i>
                        You've reached the highest tier!
                    </small>
                </div>
            `}
        </div>
    `;

    document.getElementById('cardDisplay').innerHTML = displayHtml;
    document.getElementById('cardDisplay').style.display = 'block';
}

// ==================== Tier Functions ====================
function getTier(points) {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
}

function getDiscount(tier) {
    const discounts = {
        'Bronze': 5,
        'Silver': 10,
        'Gold': 15,
        'Platinum': 20
    };
    return discounts[tier] || 0;
}

function getNextTier(currentTier) {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

function getPointsToNextTier(currentPoints) {
    if (currentPoints < 200) return 200 - currentPoints;
    if (currentPoints < 500) return 500 - currentPoints;
    if (currentPoints < 1000) return 1000 - currentPoints;
    return 0;
}

// ==================== Event Listeners ====================
function initializeEventListeners() {
    // Check Loyalty Card Form
    const checkCardForm = document.getElementById('checkCardForm');
    if (checkCardForm) {
        checkCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('checkEmail').value;
            checkLoyaltyCard(email);
        });
    }

    // New Loyalty Card Form
    const newCardForm = document.getElementById('newCardForm');
    if (newCardForm) {
        newCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newName').value;
            const email = document.getElementById('newEmail').value;
            const phone = document.getElementById('newPhone').value;
            createLoyaltyCard(name, email, phone);
            newCardForm.reset();
        });
    }

    // Smooth scroll for navigation links
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

    // Tab change animation
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function () {
            const pane = document.querySelector(this.getAttribute('data-bs-target'));
            if (pane) {
                pane.classList.add('fade-in');
                setTimeout(() => pane.classList.remove('fade-in'), 500);
            }
        });
    });
}

// ==================== Utility Functions ====================
function getCategoryIcon(category) {
    const icons = {
        'hair': 'cut',
        'skin': 'spa',
        'makeup': 'palette',
        'hands-feet': 'hand-sparkles',
        'grooming': 'user-tie'
    };
    return icons[category] || 'star';
}

function formatCategory(category) {
    const formats = {
        'hair': 'Hair Services',
        'skin': 'Skin Care',
        'makeup': 'Makeup',
        'hands-feet': 'Hands & Feet',
        'grooming': 'Grooming'
    };
    return formats[category] || category;
}

function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('#check-card') || document.querySelector('#new-card');
    if (container) {
        const existingAlert = container.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        container.insertAdjacentHTML('afterbegin', alertHtml);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }, 5000);
    }
}

function saveData() {
    // In a real application, this would save to a backend
    console.log('Saving data:', { services: servicesData, loyaltyCards: loyaltyCards });
    
    // For now, we'll save to localStorage
    try {
        localStorage.setItem('salonData', JSON.stringify({
            services: servicesData,
            loyaltyCards: loyaltyCards
        }));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// ==================== Initialize on Page Load ====================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Make functions globally available
window.showServiceModal = showServiceModal;