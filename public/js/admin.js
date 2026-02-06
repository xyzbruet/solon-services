// ==================== Configuration ====================
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

// ==================== State ====================
let allServices = [];
let filteredServices = [];
let editingServiceId = null;

// ==================== DOM Elements ====================
const servicesTableBody = document.getElementById('servicesTableBody');
const serviceForm = document.getElementById('serviceForm');
const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const searchInput = document.getElementById('searchInput');
const filterGender = document.getElementById('filterGender');
const filterCategory = document.getElementById('filterCategory');

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    initializeEventListeners();
});

// ==================== Event Listeners ====================
function initializeEventListeners() {
    // Form submission
    serviceForm.addEventListener('submit', handleSubmit);
    
    // Search and filters
    searchInput.addEventListener('input', applyFilters);
    filterGender.addEventListener('change', applyFilters);
    filterCategory.addEventListener('change', applyFilters);
    
    // Modal reset on close
    document.getElementById('serviceModal').addEventListener('hidden.bs.modal', resetForm);
    
    // Delete confirmation
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
}

// ==================== API Functions ====================
async function loadServices() {
    try {
        showLoading(true);
        const response = await fetch(`${API_URL}/services`);
        const data = await response.json();
        
        if (data.success) {
            allServices = data.data;
            filteredServices = [...allServices];
            displayServices();
            updateStats();
        } else {
            showAlert('Failed to load services', 'error');
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showAlert('Failed to load services. Please check if the server is running.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const serviceData = {
        name: document.getElementById('serviceName').value,
        category: document.getElementById('serviceCategory').value,
        subcategory: document.getElementById('serviceSubcategory').value,
        gender: document.getElementById('serviceGender').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        duration: document.getElementById('serviceDuration').value,
        image: document.getElementById('serviceImage').value || 'images/default.jpg',
        popular: document.getElementById('servicePopular').checked
    };
    
    try {
        let response;
        if (editingServiceId) {
            // Update existing service
            response = await fetch(`${API_URL}/services/${editingServiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Create new service
            response = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(
                editingServiceId ? 'Service updated successfully!' : 'Service created successfully!',
                'success'
            );
            serviceModal.hide();
            loadServices();
        } else {
            showAlert(data.error || 'Failed to save service', 'error');
        }
    } catch (error) {
        console.error('Error saving service:', error);
        showAlert('Failed to save service', 'error');
    }
}

async function deleteService(id) {
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Service deleted successfully!', 'success');
            deleteModal.hide();
            loadServices();
        } else {
            showAlert(data.error || 'Failed to delete service', 'error');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        showAlert('Failed to delete service', 'error');
    }
}

// ==================== Display Functions ====================
function displayServices() {
    if (filteredServices.length === 0) {
        servicesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No services found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    servicesTableBody.innerHTML = filteredServices.map(service => `
        <tr>
            <td>
                <img src="${service.image}" class="service-image-thumb" 
                     onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=No+Image'">
            </td>
            <td>
                <strong>${service.name}</strong>
                <br>
                <small class="text-muted">${service.description.substring(0, 50)}...</small>
            </td>
            <td>
                <span class="badge badge-category bg-primary">
                    ${capitalizeFirst(service.category)}
                </span>
                <br>
                <small class="text-muted">${capitalizeFirst(service.subcategory)}</small>
            </td>
            <td>
                <span class="badge bg-${service.gender === 'women' ? 'pink' : 'info'}">
                    <i class="fas fa-${service.gender === 'women' ? 'female' : 'male'} me-1"></i>
                    ${capitalizeFirst(service.gender)}
                </span>
            </td>
            <td><strong>$${service.price}</strong></td>
            <td>${service.duration}</td>
            <td>
                ${service.popular 
                    ? '<span class="badge bg-warning"><i class="fas fa-star me-1"></i>Popular</span>'
                    : '<span class="text-muted">-</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="editService(${service.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="promptDelete(${service.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const womenCount = allServices.filter(s => s.gender === 'women').length;
    const menCount = allServices.filter(s => s.gender === 'men').length;
    const popularCount = allServices.filter(s => s.popular === true).length;
    
    document.getElementById('totalServices').textContent = allServices.length;
    document.getElementById('womenServices').textContent = womenCount;
    document.getElementById('menServices').textContent = menCount;
    document.getElementById('popularServices').textContent = popularCount;
}

// ==================== Filter Functions ====================
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const genderFilter = filterGender.value;
    const categoryFilter = filterCategory.value;
    
    filteredServices = allServices.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm) ||
                            service.description.toLowerCase().includes(searchTerm);
        const matchesGender = !genderFilter || service.gender === genderFilter;
        const matchesCategory = !categoryFilter || service.category === categoryFilter;
        
        return matchesSearch && matchesGender && matchesCategory;
    });
    
    displayServices();
}

// ==================== Form Functions ====================
function resetForm() {
    serviceForm.reset();
    editingServiceId = null;
    document.getElementById('modalTitle').textContent = 'Add New Service';
    document.getElementById('serviceId').value = '';
}

window.editService = function(id) {
    const service = allServices.find(s => s.id === id);
    if (!service) return;
    
    editingServiceId = id;
    document.getElementById('modalTitle').textContent = 'Edit Service';
    
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceCategory').value = service.category;
    document.getElementById('serviceSubcategory').value = service.subcategory;
    document.getElementById('serviceGender').value = service.gender;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDuration').value = service.duration;
    document.getElementById('serviceImage').value = service.image === 'images/default.jpg' ? '' : service.image;
    document.getElementById('servicePopular').checked = service.popular;
    
    serviceModal.show();
};

window.promptDelete = function(id) {
    const service = allServices.find(s => s.id === id);
    if (!service) return;
    
    editingServiceId = id;
    document.getElementById('deleteServiceName').textContent = service.name;
    deleteModal.show();
};

function confirmDelete() {
    if (editingServiceId) {
        deleteService(editingServiceId);
    }
}

// ==================== Utility Functions ====================
function showLoading(show) {
    if (show) {
        servicesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading services...</p>
                </td>
            </tr>
        `;
    }
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
    alertDiv.style.minWidth = '300px';
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

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace('-', ' & ');
}
