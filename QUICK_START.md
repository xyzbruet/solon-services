# 🚀 Quick Start Guide - Salon Services Module

## Step-by-Step Installation

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install:
- express (Web server framework)
- cors (Cross-origin resource sharing)
- body-parser (Parse incoming request bodies)
- dotenv (Environment variable management)

### 2️⃣ Start the Server

**Development Mode** (with auto-restart on file changes):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

### 3️⃣ Access the Application

Once the server starts, you'll see:
```
╔════════════════════════════════════════╗
║   Salon Services API Server Running   ║
╠════════════════════════════════════════╣
║   Port: 3000                           ║
║   Environment: development             ║
║   API Base: http://localhost:3000/api  ║
╚════════════════════════════════════════╝
```

**Open in browser:**
- Main Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin.html

## 🎯 First Steps

### Using the Main Website

1. **Browse Services**
   - Click on "Women's Services" or "Men's Services" tab
   - Use category filters on the left sidebar
   - Click on any service card to see details

2. **Create Loyalty Card**
   - Scroll to the Loyalty section
   - Click "New Card" tab
   - Fill in your details
   - Submit to create your card

3. **Check Loyalty Card**
   - Go to "Check Card" tab
   - Enter your email
   - View your points and tier

### Using the Admin Panel

1. **View Dashboard**
   - See total services count
   - View services by gender
   - Check popular services

2. **Add New Service**
   - Click "Add New Service" button
   - Fill in all required fields:
     - Name (e.g., "Premium Haircut")
     - Category (Hair, Skin, Makeup, etc.)
     - Subcategory (haircut, facial, etc.)
     - Gender (Women or Men)
     - Price (number)
     - Duration (e.g., "45 min")
     - Description
     - Image URL (optional)
     - Popular checkbox
   - Click "Save Service"

3. **Edit Service**
   - Click the blue edit icon on any service row
   - Modify the fields
   - Click "Save Service"

4. **Delete Service**
   - Click the red trash icon
   - Confirm deletion

5. **Filter Services**
   - Use search box to find services by name
   - Filter by gender dropdown
   - Filter by category dropdown

## 📱 Testing the API

### Using curl:

**Get all services:**
```bash
curl http://localhost:3000/api/services
```

**Get women's hair services:**
```bash
curl "http://localhost:3000/api/services?gender=women&category=hair"
```

**Create new service:**
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service",
    "category": "hair",
    "subcategory": "haircut",
    "gender": "women",
    "description": "Test description",
    "price": 50,
    "duration": "30 min",
    "popular": false
  }'
```

### Using Postman:

1. Import the API endpoints
2. Set base URL: `http://localhost:3000/api`
3. Test all CRUD operations

## 🔧 Troubleshooting

### Server won't start

**Problem:** Port 3000 already in use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env file
PORT=4000
```

**Problem:** Dependencies not installed
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Services not appearing

**Check if server is running:**
```bash
curl http://localhost:3000/api/services
```

**Check browser console:**
- Open Developer Tools (F12)
- Look for error messages
- Verify API URL is correct

### CORS Errors

Update CORS settings in `server/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📝 Sample Service Data

Here's a template for adding services:

### Women's Hair Service
```json
{
  "name": "Balayage Highlights",
  "category": "hair",
  "subcategory": "color",
  "gender": "women",
  "description": "Hand-painted highlights for a natural sun-kissed look",
  "price": 180,
  "duration": "3-4 hrs",
  "image": "images/balayage.jpg",
  "popular": true
}
```

### Men's Grooming Service
```json
{
  "name": "Royal Shave",
  "category": "grooming",
  "subcategory": "shave",
  "gender": "men",
  "description": "Traditional hot towel shave with premium products",
  "price": 40,
  "duration": "30 min",
  "image": "images/royal-shave.jpg",
  "popular": true
}
```

## 🌐 Production Deployment Checklist

Before deploying to production:

- [ ] Update API URLs in frontend JavaScript files
- [ ] Set NODE_ENV=production in .env
- [ ] Enable HTTPS
- [ ] Add authentication to admin panel
- [ ] Set up database backup
- [ ] Configure error logging
- [ ] Set up monitoring
- [ ] Enable rate limiting
- [ ] Add request validation
- [ ] Test all features

## 💡 Tips & Tricks

1. **Bulk Import Services**
   - Edit `data/services.json` directly
   - Restart server to reload

2. **Custom Categories**
   - Add new categories in service form
   - They'll appear automatically in filters

3. **Image Management**
   - Use free image hosting: Imgur, Cloudinary
   - Or place images in `public/images/`
   - Reference as: `images/your-image.jpg`

4. **Backup Data**
   ```bash
   cp data/services.json data/services-backup.json
   ```

5. **Reset Data**
   ```bash
   # Restore from backup
   cp data/services-backup.json data/services.json
   ```

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [REST API Tutorial](https://restfulapi.net/)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

## 🆘 Getting Help

If you encounter issues:

1. Check server console for errors
2. Check browser console (F12)
3. Verify all files are in correct locations
4. Ensure Node.js version is 14+
5. Try deleting node_modules and reinstalling

## ✅ Verification Checklist

After installation, verify:

- [ ] Server starts without errors
- [ ] Main website loads at http://localhost:3000
- [ ] Admin panel loads at http://localhost:3000/admin.html
- [ ] Services display on main page
- [ ] Category filters work
- [ ] Gender tabs switch correctly
- [ ] Service cards are clickable
- [ ] Admin dashboard shows statistics
- [ ] Can create new service
- [ ] Can edit existing service
- [ ] Can delete service
- [ ] Loyalty card creation works
- [ ] API endpoints respond correctly

## 🎉 You're All Set!

Your salon services module is now running. Start customizing it for your business!

---

**Need more help? Check README.md for detailed documentation.**
