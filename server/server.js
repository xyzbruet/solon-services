const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '../data/services.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { services: [], loyaltyCards: [] };
    }
}

// Helper function to write data
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// ==================== SERVICE ENDPOINTS ====================

// GET all services
app.get('/api/services', async (req, res) => {
    try {
        const data = await readData();
        const { gender, category, subcategory, popular } = req.query;
        
        let filteredServices = data.services;
        
        if (gender) {
            filteredServices = filteredServices.filter(s => s.gender === gender);
        }
        if (category) {
            filteredServices = filteredServices.filter(s => s.category === category);
        }
        if (subcategory) {
            filteredServices = filteredServices.filter(s => s.subcategory === subcategory);
        }
        if (popular === 'true') {
            filteredServices = filteredServices.filter(s => s.popular === true);
        }
        
        res.json({
            success: true,
            count: filteredServices.length,
            data: filteredServices
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single service by ID
app.get('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const service = data.services.find(s => s.id === parseInt(req.params.id));
        
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new service
app.post('/api/services', async (req, res) => {
    try {
        const data = await readData();
        
        // Generate new ID
        const newId = data.services.length > 0 
            ? Math.max(...data.services.map(s => s.id)) + 1 
            : 1;
        
        const newService = {
            id: newId,
            name: req.body.name,
            category: req.body.category,
            subcategory: req.body.subcategory,
            gender: req.body.gender,
            description: req.body.description,
            price: parseFloat(req.body.price),
            duration: req.body.duration,
            image: req.body.image || 'images/default.jpg',
            popular: req.body.popular || false
        };
        
        data.services.push(newService);
        await writeData(data);
        
        res.status(201).json({ 
            success: true, 
            message: 'Service created successfully',
            data: newService 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update service
app.put('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.services.findIndex(s => s.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        
        data.services[index] = {
            ...data.services[index],
            ...req.body,
            id: parseInt(req.params.id) // Ensure ID doesn't change
        };
        
        await writeData(data);
        
        res.json({ 
            success: true, 
            message: 'Service updated successfully',
            data: data.services[index]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE service
app.delete('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const initialLength = data.services.length;
        data.services = data.services.filter(s => s.id !== parseInt(req.params.id));
        
        if (data.services.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        
        await writeData(data);
        
        res.json({ 
            success: true, 
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== LOYALTY CARD ENDPOINTS ====================

// GET all loyalty cards
app.get('/api/loyalty-cards', async (req, res) => {
    try {
        const data = await readData();
        res.json({ success: true, data: data.loyaltyCards || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET loyalty card by email
app.get('/api/loyalty-cards/:email', async (req, res) => {
    try {
        const data = await readData();
        const card = data.loyaltyCards.find(c => c.email === req.params.email);
        
        if (!card) {
            return res.status(404).json({ success: false, error: 'Loyalty card not found' });
        }
        
        res.json({ success: true, data: card });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create loyalty card
app.post('/api/loyalty-cards', async (req, res) => {
    try {
        const data = await readData();
        
        // Check if email already exists
        if (data.loyaltyCards.find(c => c.email === req.body.email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Loyalty card already exists for this email' 
            });
        }
        
        const newCard = {
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            points: 0,
            visits: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
            tier: 'Bronze'
        };
        
        if (!data.loyaltyCards) {
            data.loyaltyCards = [];
        }
        
        data.loyaltyCards.push(newCard);
        await writeData(data);
        
        res.status(201).json({ 
            success: true, 
            message: 'Loyalty card created successfully',
            data: newCard 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update loyalty card (add points/visits)
app.put('/api/loyalty-cards/:email', async (req, res) => {
    try {
        const data = await readData();
        const index = data.loyaltyCards.findIndex(c => c.email === req.params.email);
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Loyalty card not found' });
        }
        
        const card = data.loyaltyCards[index];
        
        if (req.body.addPoints) {
            card.points += parseInt(req.body.addPoints);
        }
        if (req.body.addVisits) {
            card.visits += parseInt(req.body.addVisits);
        }
        if (req.body.addSpent) {
            card.totalSpent += parseFloat(req.body.addSpent);
        }
        
        // Update tier based on points
        if (card.points >= 1000) {
            card.tier = 'Platinum';
        } else if (card.points >= 500) {
            card.tier = 'Gold';
        } else if (card.points >= 200) {
            card.tier = 'Silver';
        } else {
            card.tier = 'Bronze';
        }
        
        card.lastUpdated = new Date().toISOString();
        
        await writeData(data);
        
        res.json({ 
            success: true, 
            message: 'Loyalty card updated successfully',
            data: card
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== CATEGORY ENDPOINTS ====================

// GET all categories
app.get('/api/categories', async (req, res) => {
    try {
        const data = await readData();
        const { gender } = req.query;
        
        let services = data.services;
        if (gender) {
            services = services.filter(s => s.gender === gender);
        }
        
        const categories = [...new Set(services.map(s => s.category))];
        
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET subcategories by category
app.get('/api/categories/:category/subcategories', async (req, res) => {
    try {
        const data = await readData();
        const { gender } = req.query;
        
        let services = data.services.filter(s => s.category === req.params.category);
        
        if (gender) {
            services = services.filter(s => s.gender === gender);
        }
        
        const subcategories = [...new Set(services.map(s => s.subcategory))];
        
        res.json({ success: true, data: subcategories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   Salon Services API Server Running   ║
    ╠════════════════════════════════════════╣
    ║   Port: ${PORT}                         ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
    ║   API Base: http://localhost:${PORT}/api ║
    ╚════════════════════════════════════════╝
    `);
});

module.exports = app;
