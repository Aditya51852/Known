# Known Car Marketplace - Frontend-Backend Integration Guide

## Overview
This guide explains how the frontend and backend are connected, how images are handled, and how to use the system.

## Architecture

### Backend (Node.js + Express + MongoDB)
- **Port**: 3000 (default)
- **Database**: MongoDB
- **Image Storage**: Local filesystem (`backend/uploads/cars/`)
- **API Base URL**: `http://localhost:3000/api`

### Frontend (React + TypeScript + Vite)
- **Port**: 5173 (default)
- **API Communication**: REST API calls via `services/api.ts`
- **State Management**: React hooks (useState, useEffect)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo MONGODB_URI=mongodb://localhost:27017/known > .env
echo PORT=3000 >> .env
echo JWT_SECRET=your-secret-key-change-in-production >> .env

# Seed the database with sample cars
npm run dev
# In another terminal:
node seed.js

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:3000/api > .env

# Start development server
npm run dev
```

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with optional filters)
- `GET /api/cars/:id` - Get single car by ID
- `POST /api/cars` - Create new car
- `PATCH /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `POST /api/cars/:id/images` - Upload images for a car

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update user profile

### Test Drive
- `GET /api/testdrive/cart` - Get test drive cart
- `POST /api/testdrive/cart/items` - Add car to cart
- `DELETE /api/testdrive/cart/items/:carId` - Remove car from cart
- `GET /api/testdrive/pricing-summary` - Get pricing summary
- `POST /api/testdrive/checkout` - Checkout test drive

## Image Upload System

### How It Works

1. **Storage**: Images are stored in `backend/uploads/cars/` directory
2. **Access**: Images are served statically at `http://localhost:3000/uploads/cars/filename.jpg`
3. **Database**: Image URLs are stored in the Car model's `images` array

### Upload Images via API

```javascript
// Frontend example
const uploadImages = async (carId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('type', 'exterior'); // or 'interior'
  
  const response = await fetch(`http://localhost:3000/api/cars/${carId}/images`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

### Upload Images via Postman

1. Create a car first (POST /api/cars)
2. Note the car ID from response
3. Upload images:
   - Method: POST
   - URL: `http://localhost:3000/api/cars/{CAR_ID}/images`
   - Body: form-data
   - Key: `images` (type: File) - Select multiple files
   - Key: `type` (type: Text) - Value: `exterior` or `interior`

## User Roles

The system supports multiple user roles:

1. **client** - Regular customers browsing and booking test drives
2. **dealer** - Car dealers managing inventory
3. **service_provider** - Service providers for test drives
4. **mentor** - Mentors helping users
5. **admin** - System administrators

### Register a User

```javascript
// Example: Register a client
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: 'securepassword',
    role: 'client' // or 'dealer', 'service_provider', etc.
  })
});

const data = await response.json();
// Save token: localStorage.setItem('authToken', data.token);
```

## Dynamic Car Loading

### How Cars Are Displayed

1. **CarListing Page**: Fetches all cars from `/api/cars`
2. **Filters**: Apply filters via query parameters
3. **Random Order**: MongoDB returns documents in insertion order by default
4. **Shuffle**: To randomize, you can add sorting logic

### Example: Get Random Cars

```javascript
// In backend/routes/cars.js
router.get('/', async (req, res, next) => {
  try {
    const q = {};
    // ... apply filters ...
    
    // Get random cars
    const cars = await Car.aggregate([
      { $match: q },
      { $sample: { size: 50 } } // Random 50 cars
    ]);
    
    res.json(cars);
  } catch (e) { next(e); }
});
```

## Frontend Pages

### Key Pages
- `/` - Home page
- `/cars` - Car listing page (CarListing.tsx)
- `/car/:id` - Car detail page (CarDetail.tsx)
- `/profile` - User profile with test drive management
- `/login` - Login page
- `/register` - Registration page

### Using the API Service

```typescript
import { carsApi, authApi, testDriveApi } from '../services/api';

// Get all cars
const cars = await carsApi.getAll();

// Get cars with filters
const filteredCars = await carsApi.getAll({
  brand: 'Toyota',
  fuelType: 'Petrol',
  priceMin: 1000000,
  priceMax: 5000000
});

// Get single car
const car = await carsApi.getById('car-id-here');

// Add to test drive cart
await testDriveApi.addToCart('car-id-here');

// Login
const result = await authApi.login({
  email: 'user@example.com',
  password: 'password'
});
```

## Database Schema

### Car Model
```javascript
{
  brand: String,
  model: String,
  bodyType: String,
  fuelType: String,
  transmission: String,
  seating: Number,
  basePrice: Number,
  description: String,
  images: [{
    url: String,
    type: String, // 'exterior' or 'interior'
    alt: String
  }],
  variants: [{
    name: String,
    basePrice: Number,
    features: [String]
  }],
  details: {
    engine: Object,
    body: Object,
    comfort: Object,
    entertainment: Object,
    features: Object,
    safety: Object
  }
}
```

### User Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  role: String // 'client', 'dealer', 'service_provider', 'mentor', 'admin'
}
```

## Testing the Integration

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Seed Database
```bash
cd backend
node seed.js
```

### 3. Test in Browser
1. Open `http://localhost:5173`
2. Navigate to car listing page
3. Click on a car to view details
4. Try adding to test drive cart

### 4. Test API Directly
```bash
# Get all cars
curl http://localhost:3000/api/cars

# Get single car (replace ID)
curl http://localhost:3000/api/cars/YOUR_CAR_ID

# Health check
curl http://localhost:3000/health
```

## Troubleshooting

### Images Not Loading
- Check if `backend/uploads/cars/` directory exists
- Verify image URLs in database start with `/uploads/cars/`
- Ensure backend is serving static files correctly
- Check CORS settings if accessing from different domain

### API Connection Failed
- Verify backend is running on port 3000
- Check `.env` file in frontend has correct `VITE_API_URL`
- Check browser console for CORS errors
- Verify MongoDB is running and connected

### Cars Not Appearing
- Run seed script: `node backend/seed.js`
- Check MongoDB connection in backend logs
- Verify API endpoint returns data: `curl http://localhost:3000/api/cars`

## Production Deployment

### Backend
1. Set environment variables:
   - `MONGODB_URI` - Production MongoDB connection string
   - `JWT_SECRET` - Strong secret key
   - `PORT` - Server port
   - `CORS_ORIGIN` - Frontend domain

2. Upload images to cloud storage (AWS S3, Cloudinary, etc.)
3. Update image URLs in database

### Frontend
1. Build: `npm run build`
2. Set `VITE_API_URL` to production backend URL
3. Deploy `dist/` folder to hosting service

## Next Steps

1. **Add Image Upload UI**: Create admin panel for uploading car images
2. **Implement Authentication UI**: Add login/register pages
3. **Add More Filters**: Implement advanced search and filtering
4. **Add Pagination**: Handle large number of cars efficiently
5. **Add Reviews System**: Allow users to review cars
6. **Add Comparison Feature**: Compare multiple cars side-by-side
7. **Add Favorites**: Let users save favorite cars
8. **Add Notifications**: Notify users about test drive confirmations

## Support

For issues or questions:
1. Check backend logs: `npm run dev` in backend folder
2. Check browser console for frontend errors
3. Verify API responses using browser DevTools Network tab
4. Check MongoDB connection and data
