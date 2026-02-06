const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'services.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { services: [], loyaltyCards: [] };
    }
}

// Helper function to write data
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// ==================== SERVICE ROUTES ====================

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const data = await readData();
        res.json({
            success: true,
            data: data.services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch services'
        });
    }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const service = data.services.find(s => s.id === parseInt(req.params.id));
        
        if (service) {
            res.json({
                success: true,
                data: service
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service'
        });
    }
});

// Create new service
app.post('/api/services', async (req, res) => {
    try {
        const data = await readData();
        const newService = {
            id: Date.now(),
            ...req.body
        };
        
        data.services.push(newService);
        await writeData(data);
        
        res.status(201).json({
            success: true,
            data: newService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create service'
        });
    }
});

// Update service
app.put('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.services.findIndex(s => s.id === parseInt(req.params.id));
        
        if (index !== -1) {
            data.services[index] = {
                ...data.services[index],
                ...req.body,
                id: parseInt(req.params.id)
            };
            
            await writeData(data);
            
            res.json({
                success: true,
                data: data.services[index]
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update service'
        });
    }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.services.findIndex(s => s.id === parseInt(req.params.id));
        
        if (index !== -1) {
            data.services.splice(index, 1);
            await writeData(data);
            
            res.json({
                success: true,
                message: 'Service deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete service'
        });
    }
});

// ==================== LOYALTY CARD ROUTES ====================

// Get all loyalty cards
app.get('/api/loyalty-cards', async (req, res) => {
    try {
        const data = await readData();
        res.json({
            success: true,
            data: data.loyaltyCards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch loyalty cards'
        });
    }
});

// Get loyalty card by email
app.get('/api/loyalty-cards/:email', async (req, res) => {
    try {
        const data = await readData();
        const card = data.loyaltyCards.find(
            c => c.email.toLowerCase() === req.params.email.toLowerCase()
        );
        
        if (card) {
            res.json({
                success: true,
                data: card
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Loyalty card not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch loyalty card'
        });
    }
});

// Create new loyalty card
app.post('/api/loyalty-cards', async (req, res) => {
    try {
        const data = await readData();
        
        // Check if card already exists
        const existingCard = data.loyaltyCards.find(
            c => c.email.toLowerCase() === req.body.email.toLowerCase()
        );
        
        if (existingCard) {
            return res.status(400).json({
                success: false,
                error: 'A loyalty card with this email already exists'
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
        
        data.loyaltyCards.push(newCard);
        await writeData(data);
        
        res.status(201).json({
            success: true,
            data: newCard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create loyalty card'
        });
    }
});

// Update loyalty card
app.put('/api/loyalty-cards/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.loyaltyCards.findIndex(c => c.id === parseInt(req.params.id));
        
        if (index !== -1) {
            data.loyaltyCards[index] = {
                ...data.loyaltyCards[index],
                ...req.body,
                id: parseInt(req.params.id)
            };
            
            await writeData(data);
            
            res.json({
                success: true,
                data: data.loyaltyCards[index]
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Loyalty card not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update loyalty card'
        });
    }
});

// ==================== SERVE HTML FILES ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║        Luxe Salon Server Running             ║
╠═══════════════════════════════════════════════╣
║  Port: ${PORT}                                    ║
║  URL:  http://localhost:${PORT}                  ║
║  Admin: http://localhost:${PORT}/admin           ║
╚═══════════════════════════════════════════════╝
    `);
});

module.exports = app;