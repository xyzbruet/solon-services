# 💇 Salon Services Module - Production Ready

A modern, full-stack salon services management system with beautiful UI, complete admin panel, and RESTful API.

## ✨ Features

### Customer Features
- 🎨 Modern, responsive design with smooth animations
- 👫 Separate service catalogs for Men & Women
- 🔍 Real-time search and filtering
- 📱 Mobile-friendly interface
- ⭐ Loyalty rewards program with tier system
- 🎯 Service categories: Hair, Skin, Makeup, Hands & Feet, Grooming
- 💎 Popular services highlighting

### Admin Features
- 📊 Real-time statistics dashboard
- ➕ Create, edit, and delete services
- 🔍 Advanced filtering and search
- 📝 Form validation
- 🎨 Modern admin panel design
- 📱 Responsive admin interface

### Technical Features
- 🚀 RESTful API with Node.js & Express
- 💾 JSON file-based storage (easily upgradeable to MongoDB)
- 🔄 CORS enabled for cross-origin requests
- ⚡ Fast and lightweight
- 📦 No database setup required
- 🔧 Easy to deploy and maintain

## 📁 Project Structure

```
salon-services/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   └── data/
│       └── services.json      # Services database
├── frontend/
│   ├── index.html            # Main customer page
│   ├── admin.html            # Admin panel
│   ├── css/
│   │   ├── styles.css        # Main styles
│   │   └── admin.css         # Admin styles
│   └── js/
│       ├── api.js            # API service layer
│       ├── app.js            # Main app logic
│       └── admin.js          # Admin panel logic
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to backend directory**
```bash
cd salon-services/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. **Access the application**
- Customer Site: http://localhost:3000
- Admin Panel: http://localhost:3000/admin.html
- API: http://localhost:3000/api

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get All Services
```http
GET /api/services
Query Parameters:
  - gender: "men" | "women"
  - category: "hair" | "skin" | "makeup" | "hands-feet" | "grooming"
  - subcategory: string
  - popular: "true" | "false"
```

#### Get Single Service
```http
GET /api/services/:id
```

#### Create Service
```http
POST /api/services
Content-Type: application/json

{
  "name": "Classic Haircut",
  "gender": "women",
  "category": "hair",
  "subcategory": "haircut",
  "price": 45,
  "duration": "45 min",
  "description": "Professional haircut with styling",
  "image": "https://example.com/image.jpg",
  "popular": true
}
```

#### Update Service
```http
PUT /api/services/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 50,
  ...
}
```

#### Delete Service
```http
DELETE /api/services/:id
```

#### Get Loyalty Tiers
```http
GET /api/loyalty-tiers
```

#### Get Categories
```http
GET /api/categories?gender=women
```

#### Health Check
```http
GET /api/health
```

## 🎨 Service Categories

### Women's Services
- **Hair**: Haircut, Color, Highlights, Textures, Spa, Styling
- **Skin**: Facials, Anti-aging treatments, Hydrating treatments
- **Makeup**: Bridal, Party, Natural/Normal
- **Hands & Feet**: Manicure, Pedicure, Gel nails, Nail art

### Men's Services
- **Hair**: Haircut, Color
- **Grooming**: Beard trim, Royal shave, Beard packages, Head massage
- **Skin**: Facials, Anti-aging treatments

## 🎯 Loyalty Program Tiers

| Tier | Points Range | Discount | Benefits |
|------|--------------|----------|----------|
| Bronze | 0-499 | 5% | Birthday bonus |
| Silver | 500-999 | 10% | Priority booking, Free hair spa |
| Gold | 1000-1999 | 15% | VIP booking, Free treatments, Exclusive events |
| Platinum | 2000+ | 20% | Personal stylist, All benefits |

## 🔧 Configuration

### Change API Port
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Update API Base URL
Edit `frontend/js/api.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://your-domain.com/api'
};
```

## 🚢 Production Deployment

### Option 1: Deploy to Heroku

1. **Create Heroku app**
```bash
heroku create your-salon-app
```

2. **Update package.json in root**
```json
{
  "name": "salon-services",
  "version": "1.0.0",
  "scripts": {
    "start": "cd backend && npm install && node server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

3. **Deploy**
```bash
git add .
git commit -m "Initial deployment"
git push heroku main
```

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Create vercel.json in root**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

3. **Deploy**
```bash
vercel
```

### Option 3: Deploy to VPS (Ubuntu)

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
sudo npm install -g pm2
```

3. **Clone and setup**
```bash
git clone your-repo
cd salon-services/backend
npm install
```

4. **Start with PM2**
```bash
pm2 start server.js --name salon-api
pm2 save
pm2 startup
```

5. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/salon-services/frontend;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔐 Security Considerations

For production deployment:

1. **Add authentication** for admin panel
2. **Validate all inputs** server-side
3. **Use environment variables** for sensitive data
4. **Enable HTTPS** with SSL certificate
5. **Implement rate limiting**
6. **Add request logging**

Example security additions:
```javascript
// In server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api/', limiter);
```

## 📊 Database Migration (Optional)

To upgrade from JSON to MongoDB:

1. **Install MongoDB driver**
```bash
npm install mongodb
```

2. **Replace file operations** with MongoDB queries
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

// Example: Get all services
const services = await client.db('salon').collection('services').find({}).toArray();
```

## 🛠️ Customization

### Add New Service Category
1. Update `services.json` with new services
2. Add category to frontend filters
3. Add appropriate icons in sidebar

### Change Color Scheme
Edit CSS variables in `frontend/css/styles.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add Image Upload
Integrate with services like:
- Cloudinary
- AWS S3
- Firebase Storage

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Support

For issues or questions:
1. Check the API documentation
2. Review console logs for errors
3. Ensure all dependencies are installed
4. Verify server is running on correct port

## 🎉 Features Coming Soon

- [ ] User authentication
- [ ] Booking system integration
- [ ] Email notifications
- [ ] Payment integration
- [ ] Reviews and ratings
- [ ] Image upload capability
- [ ] Multi-language support

---

**Made with ❤️ for salon businesses worldwide**
