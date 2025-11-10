# Known - Car Marketplace Platform

A full-stack car marketplace application with dynamic car listings, test drive booking, multi-role user system, and image management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)

### 1. Clone and Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
# Windows PowerShell:
@"
MONGODB_URI=mongodb://localhost:27017/known
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=*
"@ | Out-File -FilePath .env -Encoding utf8

# Seed database with sample cars
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
# Windows PowerShell:
echo "VITE_API_URL=http://localhost:3000/api" | Out-File -FilePath .env -Encoding utf8

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Known/
├── backend/
│   ├── models/           # MongoDB models (Car, User, TestDrive, etc.)
│   ├── routes/           # API routes (cars, auth, testdrive)
│   ├── uploads/          # Uploaded images storage
│   │   └── cars/        # Car images
│   ├── index.js         # Express server entry point
│   ├── seed.js          # Database seeding script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages (CarDetail, CarListing, etc.)
│   │   ├── services/    # API service layer
│   │   │   └── api.ts   # API client for backend
│   │   └── components/  # Reusable components
│   └── package.json
│
└── INTEGRATION_GUIDE.md # Detailed integration documentation
```

## 🎯 Features

### ✅ Implemented Features

1. **Dynamic Car Listings**
   - Fetch cars from MongoDB database
   - Filter by brand, type, fuel, transmission, price
   - Real-time search and filtering
   - Random car display on each page load

2. **Car Details Page**
   - Comprehensive car information
   - Image gallery (exterior/interior)
   - Variant selection
   - EMI calculator
   - Pricing by location
   - Test drive booking

3. **Image Management**
   - Upload multiple images per car
   - Categorize as exterior/interior
   - Serve images via static file server
   - Support for JPG, PNG, GIF, WebP

4. **Multi-Role User System**
   - **Client**: Browse cars, book test drives
   - **Dealer**: Manage car inventory
   - **Service Provider**: Handle test drive requests
   - **Mentor**: Assist users
   - **Admin**: System administration

5. **Authentication**
   - JWT-based authentication
   - Register/Login with email or phone
   - Protected routes
   - User profile management

6. **Test Drive System**
   - Add cars to test drive cart
   - Dynamic pricing (₹450/car, ₹399/car for 3+)
   - Cart management
   - Checkout and booking

## 🔌 API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car
- `PATCH /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `POST /api/cars/:id/images` - Upload car images

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile

### Test Drive
- `GET /api/testdrive/cart` - Get cart
- `POST /api/testdrive/cart/items` - Add to cart
- `DELETE /api/testdrive/cart/items/:carId` - Remove from cart
- `GET /api/testdrive/pricing-summary` - Get pricing
- `POST /api/testdrive/checkout` - Checkout

## 📸 Image Upload

### Via API (Postman/cURL)

```bash
# 1. Create a car first
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "BMW",
    "model": "M3",
    "bodyType": "Sedan",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "seating": 5,
    "basePrice": 7500000
  }'

# 2. Upload images (replace CAR_ID)
curl -X POST http://localhost:3000/api/cars/CAR_ID/images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "type=exterior"
```

### Via Frontend (React)

```typescript
import { carsApi } from './services/api';

// Upload images
const files = [file1, file2]; // File objects from input
await carsApi.uploadImages(carId, files, 'exterior');
```

## 👥 User Registration

### Register a Client

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "securepassword",
    "role": "client"
  }'
```

### Register a Dealer

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Motors",
    "email": "dealer@abcmotors.com",
    "phone": "9876543211",
    "password": "dealerpassword",
    "role": "dealer"
  }'
```

## 🗄️ Database Schema

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
  images: [{ url, type, alt }],
  variants: [{ name, basePrice, features }],
  details: { engine, body, comfort, entertainment, features, safety }
}
```

### User Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  role: 'client' | 'dealer' | 'service_provider' | 'mentor' | 'admin'
}
```

## 🧪 Testing

### 1. Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Get all cars
curl http://localhost:3000/api/cars

# Get filtered cars
curl "http://localhost:3000/api/cars?brand=Toyota&fuelType=Petrol"
```

### 2. Test Frontend
1. Open `http://localhost:5173`
2. Navigate to car listing page
3. Apply filters
4. Click on a car to view details
5. Add to test drive cart

## 🔧 Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/known
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=*
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📦 Sample Data

The seed script (`npm run seed`) populates the database with:
- 5 sample cars (Toyota Supra, Honda Civic Type R, Hyundai Creta, Maruti Swift, Tata Nexon EV)
- Complete car details (specs, variants, features)
- Sample images (using Unsplash URLs)

## 🚧 Troubleshooting

### Images Not Loading
- Ensure `backend/uploads/cars/` directory exists
- Check image URLs start with `/uploads/cars/`
- Verify backend is serving static files

### API Connection Failed
- Check backend is running on port 3000
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings

### Cars Not Appearing
- Run seed script: `npm run seed`
- Check MongoDB connection
- Verify API returns data: `curl http://localhost:3000/api/cars`

## 📚 Documentation

For detailed integration guide, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Fetch API

## 🎨 Features Roadmap

- [ ] Admin panel for car management
- [ ] Image upload UI in frontend
- [ ] User dashboard with booking history
- [ ] Car comparison feature
- [ ] Reviews and ratings system
- [ ] Advanced search with autocomplete
- [ ] Pagination for large datasets
- [ ] Email notifications
- [ ] Payment integration
- [ ] Cloud image storage (AWS S3/Cloudinary)

## 📄 License

MIT

## 👨‍💻 Author

Known Team
