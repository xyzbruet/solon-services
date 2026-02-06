# 💎 Salon Services Module - Complete Installation & Usage Guide

## 📦 What You Received

A complete, production-ready salon services management system including:

### Files Included:
```
salon-services/
├── server/
│   └── server.js              # Node.js/Express backend server
├── public/
│   ├── index.html            # Main customer website
│   ├── admin.html            # Admin management panel
│   ├── css/
│   │   └── styles.css        # Modern responsive styles
│   └── js/
│       ├── app.js            # Frontend functionality
│       └── admin.js          # Admin panel logic
├── data/
│   └── services.json         # Service database (26 pre-loaded services)
├── package.json              # Dependencies configuration
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variables template
├── README.md                # Detailed documentation
├── QUICK_START.md           # Quick setup guide
└── .gitignore               # Git ignore rules
```

## 🚀 Installation (2 Minutes)

### Step 1: Prerequisites
Make sure you have Node.js installed:
```bash
node --version  # Should be v14 or higher
```

If not installed, download from: https://nodejs.org/

### Step 2: Navigate to Project
```bash
cd salon-services
```

### Step 3: Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- cors (cross-origin requests)
- body-parser (request parsing)
- dotenv (environment config)

### Step 4: Start Server
```bash
npm start
```

You'll see:
```
╔════════════════════════════════════════╗
║   Salon Services API Server Running   ║
║   Port: 3000                           ║
║   API Base: http://localhost:3000/api  ║
╚════════════════════════════════════════╝
```

### Step 5: Open in Browser
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

## ✨ Features Overview

### Customer Website Features

1. **Service Browsing**
   - Beautiful card-based layout
   - Women's and Men's services sections
   - Category filtering (Hair, Skin, Makeup, Hands & Feet, Grooming)
   - Search functionality
   - Popular services highlighting

2. **Loyalty Program**
   - Create loyalty cards
   - Check points and tier
   - 4 tier levels: Bronze, Silver, Gold, Platinum
   - Automatic tier upgrades based on points

3. **Service Details**
   - Click any service for full details
   - View pricing and duration
   - See service description
   - Book now option

### Admin Panel Features

1. **Dashboard**
   - Real-time statistics
   - Total services count
   - Gender breakdown
   - Popular services count

2. **Service Management**
   - Create new services
   - Edit existing services
   - Delete services
   - Search and filter

3. **Filters**
   - Search by name
   - Filter by gender
   - Filter by category

## 📖 How to Use

### For Salon Owners/Admins

#### Adding a New Service

1. Go to http://localhost:3000/admin.html
2. Click "Add New Service" button
3. Fill in the form:
   ```
   Name: Premium Facial
   Category: Skin
   Subcategory: facial
   Gender: Women
   Price: 85
   Duration: 60 min
   Description: Deep cleansing facial with mask
   Image URL: (optional, or leave blank)
   Popular: ✓ (check if popular)
   ```
4. Click "Save Service"

#### Editing a Service

1. Find the service in the table
2. Click the blue edit icon
3. Modify fields
4. Click "Save Service"

#### Deleting a Service

1. Click the red trash icon
2. Confirm deletion

### For Customers

#### Browse Services

1. Visit main website
2. Select "Women's Services" or "Men's Services"
3. Use category filters on left
4. Click "View Details" on any service

#### Create Loyalty Card

1. Scroll to "Loyalty Rewards Program"
2. Click "New Card" tab
3. Fill in:
   - Name
   - Email
   - Phone
4. Click "Create Loyalty Card"

#### Check Loyalty Card

1. Go to "Check Card" tab
2. Enter your email
3. View your points and tier

## 🎨 Pre-loaded Services

### Women's Services (18 services)

**Hair (7 services)**
- Classic Haircut - $45
- Hair Coloring - $120
- Balayage Highlights - $180
- Keratin Treatment - $250
- Hair Spa Treatment - $65
- Updo Styling - $80
- Blowout & Styling - $55

**Makeup (3 services)**
- Bridal Makeup - $300
- Party Makeup - $100
- Natural Makeup - $60

**Hands & Feet (6 services)**
- Classic Manicure - $35
- Gel Manicure - $50
- Classic Pedicure - $45
- Spa Pedicure - $65
- Nail Art - $25
- Acrylic Nails - $75

**Skin (2 services)**
- Facial Treatment - $85
- Anti-Aging Facial - $150

### Men's Services (8 services)

**Hair (2 services)**
- Men's Haircut - $35
- Men's Hair Color - $75

**Grooming (3 services)**
- Beard Trim & Shaping - $25
- Hot Towel Shave - $40
- Hair & Beard Combo - $55

**Skin (2 services)**
- Men's Facial - $70
- Scalp Treatment - $50

**Hands & Feet (1 service)**
- Men's Manicure - $30

## 🔌 API Endpoints

### Get All Services
```bash
GET http://localhost:3000/api/services

# With filters
GET http://localhost:3000/api/services?gender=women&category=hair
```

### Get Single Service
```bash
GET http://localhost:3000/api/services/1
```

### Create Service
```bash
POST http://localhost:3000/api/services
Content-Type: application/json

{
  "name": "New Service",
  "category": "hair",
  "subcategory": "haircut",
  "gender": "women",
  "description": "Service description",
  "price": 50,
  "duration": "45 min",
  "popular": false
}
```

### Update Service
```bash
PUT http://localhost:3000/api/services/1
Content-Type: application/json

{
  "price": 60,
  "duration": "60 min"
}
```

### Delete Service
```bash
DELETE http://localhost:3000/api/services/1
```

### Loyalty Card Endpoints
```bash
# Create card
POST http://localhost:3000/api/loyalty-cards
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234"
}

# Check card
GET http://localhost:3000/api/loyalty-cards/john@example.com

# Update card (add points)
PUT http://localhost:3000/api/loyalty-cards/john@example.com
{
  "addPoints": 50,
  "addVisits": 1,
  "addSpent": 85
}
```

## 🌐 Deployment to Production

### Deploy to Vercel (Easiest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and get your live URL!

### Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-salon-app`
4. Deploy:
```bash
git add .
git commit -m "Deploy"
git push heroku main
```

### Deploy to Your Own Server

1. Upload files to server
2. Install Node.js on server
3. Install PM2: `npm install -g pm2`
4. Start: `pm2 start server/server.js`
5. Setup Nginx reverse proxy

## 🎨 Customization

### Change Colors

Edit `public/css/styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Add Your Logo

Replace in `public/index.html`:
```html
<a class="navbar-brand" href="#">
    <img src="your-logo.png" alt="Logo"> Your Salon Name
</a>
```

### Add Your Images

1. Place images in `public/images/`
2. Reference in services: `images/your-image.jpg`

### Modify Services

Edit `data/services.json` directly or use the admin panel.

## 🐛 Troubleshooting

### Server Won't Start

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port
# In .env file: PORT=4000
```

**Missing dependencies:**
```bash
rm -rf node_modules
npm install
```

### Services Not Loading

1. Check if server is running
2. Open browser console (F12)
3. Check for errors
4. Verify API URL in `public/js/app.js`

### CORS Errors

Update `server/server.js`:
```javascript
app.use(cors({
  origin: 'http://your-domain.com'
}));
```

## 📞 Support & Help

If you need help:

1. Check `QUICK_START.md` for quick setup
2. Check `README.md` for detailed docs
3. Look at browser console for errors
4. Check server console for errors
5. Verify Node.js version: `node --version`

## 📝 Quick Commands

```bash
# Start server
npm start

# Development mode (auto-restart)
npm run dev

# Stop server
Ctrl + C

# Backup data
cp data/services.json data/backup.json

# Restore data
cp data/backup.json data/services.json

# Check if server is running
curl http://localhost:3000/api/services
```

## ✅ Post-Installation Checklist

- [ ] Server starts successfully
- [ ] Main website loads
- [ ] Admin panel loads
- [ ] Services display correctly
- [ ] Can filter by category
- [ ] Can switch between Men/Women tabs
- [ ] Can create new service in admin
- [ ] Can edit service in admin
- [ ] Can delete service in admin
- [ ] Can create loyalty card
- [ ] Can check loyalty card
- [ ] API endpoints respond

## 🎉 You're Ready!

Your salon services module is now fully functional. Start customizing it for your business!

### Next Steps:
1. ✅ Add your salon's services
2. ✅ Customize colors and branding
3. ✅ Add your logo and images
4. ✅ Deploy to production
5. ✅ Share with customers!

---

**Questions? Check README.md or QUICK_START.md for more details!**
