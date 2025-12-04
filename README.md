# Known - Smart Car Automation Platform 🚗

**Known** is an intelligent, all-in-one automotive platform that revolutionizes the car buying experience. It seamlessly connects car buyers with dealers, mentors, and service providers to simplify every step of the car purchasing journey - from browsing to booking test drives, getting expert guidance, and making informed decisions.

## 🌟 What is Known?

Known is a **smart automation platform** designed to transform how people discover, explore, and purchase cars. Unlike traditional car marketplaces, Known provides:

- 🛒 **Smart Car Shopping**: Browse an extensive inventory of cars with intelligent filtering and search
- 🤝 **Mentor Connection**: Get personalized guidance from automotive experts and mentors
- 🚘 **Easy Test Drive Booking**: Schedule and manage test drives with automated pricing and cart management
- 🔐 **Multi-Role Ecosystem**: A platform that serves buyers, dealers, service providers, mentors, and admins
- 📱 **Seamless Authentication**: Multiple login options including email, phone, and OTP-based authentication
- 💡 **Intelligent Automation**: Automated workflows for booking, pricing, notifications, and user management

## 🎯 What Does This Project Do?

### For Car Buyers (Clients)
- **Discover Cars**: Browse a comprehensive catalog with advanced filters (brand, type, fuel, transmission, price range)
- **Get Expert Advice**: Connect with automotive mentors who guide you through the selection process
- **Book Test Drives**: Add multiple cars to your test drive cart and book them with dynamic pricing
- **Compare & Decide**: View detailed specifications, variants, pricing, EMI options, and side-by-side comparisons
- **Track Your Journey**: Manage your bookings, view history, and track test drive schedules

### For Dealers
- **Manage Inventory**: Add, update, and manage car listings with complete specifications
- **Upload Media**: Manage car images (exterior/interior) and showcase vehicles
- **Track Bookings**: Monitor test drive requests and customer interactions
- **Analytics Dashboard**: View insights on inventory performance and customer interest

### For Mentors
- **Guide Buyers**: Assist customers in choosing the right car based on their needs
- **Share Expertise**: Provide professional advice on car features, pricing, and financing
- **Build Reputation**: Earn ratings and reviews from satisfied customers

### For Service Providers
- **Manage Test Drives**: Handle test drive scheduling and logistics
- **Coordinate Vehicles**: Ensure cars are ready for customer test drives
- **Customer Service**: Provide exceptional on-ground support

### For Admins
- **System Management**: Oversee all users, listings, and platform operations
- **Monitor Activities**: Track bookings, disputes, and system health
- **Configure Platform**: Manage settings, pricing rules, and platform features

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Firebase account (for phone OTP authentication)

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

# Create environment file with your Firebase config
# Windows PowerShell:
@"
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
"@ | Out-File -FilePath .env -Encoding utf8

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

> **Note**: For detailed Firebase Phone Authentication setup, see [FIREBASE_PHONE_AUTH_SETUP.md](./FIREBASE_PHONE_AUTH_SETUP.md)

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
│   │   ├── pages/       # React pages (CarDetail, CarListing, Homepage, Login, etc.)
│   │   ├── components/  # Reusable components (PhoneOtpLogin, etc.)
│   │   ├── services/    # API service layer
│   │   │   └── api.ts   # API client for backend
│   │   └── firebase.ts  # Firebase configuration
│   └── package.json
│
├── INTEGRATION_GUIDE.md          # Detailed integration documentation
├── FIREBASE_PHONE_AUTH_SETUP.md  # Firebase phone authentication guide
└── README.md                      # This file
```

## ✨ Core Features & How They Work

### 1. **Smart Car Discovery & Search** 🔍
The platform provides intelligent car browsing with:
- **Dynamic Filtering**: Real-time filters by brand, body type, fuel type, transmission, price range
- **Smart Search**: Find cars instantly by name, brand, or specifications
- **Random Display**: See different cars each time to discover new options
- **Comprehensive Info**: Each car includes detailed specs, variants, pricing, and images

**How it works**: 
- Cars are fetched from MongoDB with real-time filtering
- Frontend applies filters without page reload for smooth UX
- Images are served via optimized static file server

### 2. **Mentor Connection System** 👨‍🏫
Connect with automotive experts who help you make the right choice:
- **Expert Guidance**: Get personalized advice on which car fits your needs
- **Professional Insights**: Learn about car features, performance, and value
- **Decision Support**: Mentors help compare options and explain technical details
- **Trusted Advice**: Build confidence in your purchase decision

**How it works**:
- Users can browse available mentors on the platform
- Book consultation sessions with mentors
- Mentors access user preferences and provide tailored recommendations
- Rate and review mentors based on service quality

### 3. **Test Drive Booking & Cart Management** 🚙
Simplified test drive scheduling with smart automation:
- **Add to Cart**: Select multiple cars you want to test drive
- **Dynamic Pricing**: Automatic pricing (₹450/car, ₹399/car for 3+ cars)
- **Schedule Management**: Choose convenient time slots
- **Easy Checkout**: Complete booking in a few clicks
- **Booking History**: Track all your test drive appointments

**How it works**:
- Add cars to test drive cart via car detail pages
- System calculates pricing based on quantity
- Select preferred date/time and location
- Receive confirmation with booking details
- Service providers prepare vehicles for your test drive

### 4. **Multi-Role User Ecosystem** 👥
The platform supports five distinct user roles, each with tailored experiences:

- **Client**: Browse cars, connect with mentors, book test drives, manage profile
- **Dealer**: Add/edit car inventory, upload images, track customer interest
- **Service Provider**: Manage test drive logistics, coordinate schedules, handle bookings
- **Mentor**: Assist buyers, provide consultations, build professional reputation
- **Admin**: Platform oversight, user management, system configuration

**How it works**:
- Role-based authentication and authorization
- Each role has specific dashboard and permissions
- Role-specific features and data access
- Seamless interaction between different roles

### 5. **Advanced Authentication System** 🔐
Multiple secure login options for user convenience:
- **Email/Password**: Traditional registration and login
- **Phone Number**: Register using mobile number
- **OTP Verification**: Firebase-powered SMS OTP authentication
- **JWT Tokens**: Secure session management
- **Protected Routes**: Role-based access control

**How it works**:
- Firebase handles phone OTP sending and verification
- Backend generates JWT tokens on successful authentication
- Tokens stored securely and validated on each request
- Automatic token refresh for seamless sessions

### 6. **Comprehensive Car Details** 📊
Each car listing provides complete information:
- **Specifications**: Engine, dimensions, features, safety
- **Variant Comparison**: Different trim levels with pricing
- **Image Gallery**: Exterior and interior photos
- **EMI Calculator**: Monthly payment estimation
- **Location-based Pricing**: Prices vary by city/region
- **Availability Status**: Real-time stock information

### 7. **Image Management System** 📸
Professional media handling for car listings:
- **Multi-Upload**: Upload multiple images per car
- **Categorization**: Separate exterior/interior images
- **Format Support**: JPG, PNG, GIF, WebP
- **Optimized Delivery**: Fast loading with static file serving
- **Future-Ready**: Designed for cloud storage integration (AWS S3/Cloudinary)

### 8. **Responsive Design** 📱
Optimized experience across all devices:
- **Mobile-First**: Beautiful UI on smartphones
- **Tablet-Friendly**: Adapted layouts for tablets
- **Desktop-Optimized**: Full-featured desktop experience
- **Modern UI**: Built with Tailwind CSS for premium aesthetics



## � How to Use the Platform

### For New Users (Clients)

#### 1. **Registration & Login**
```
Navigate to homepage → Click "Sign Up"
Choose registration method:
  - Email/Password
  - Phone Number with OTP
Enter your details → Complete registration
```

#### 2. **Browse Cars**
```
Homepage → Browse featured cars
Use search bar → Filter by:
  - Brand (Toyota, Honda, Hyundai, etc.)
  - Body Type (Sedan, SUV, Hatchback)
  - Fuel Type (Petrol, Diesel, Electric, Hybrid)
  - Transmission (Manual, Automatic)
  - Price Range (Custom slider)
```

#### 3. **View Car Details**
```
Click on any car → View comprehensive details:
  - Specifications & features
  - Available variants
  - Pricing by location
  - Image gallery
  - EMI calculator
```

#### 4. **Connect with a Mentor**
```
Car Details Page → "Connect with Mentor" button
Browse available mentors → Select a mentor
Schedule consultation → Get expert advice
```

#### 5. **Book Test Drive**
```
Car Details Page → "Book Test Drive" button
Car added to test drive cart
View cart → Add more cars (get bulk discounts!)
Select date/time → Complete checkout
Receive booking confirmation
```

#### 6. **Manage Your Account**
```
Profile Dashboard → View:
  - Your details
  - Booking history
  - Favorite cars
  - Mentor consultations
```

### For Dealers

#### 1. **Add New Car Listing**
```bash
# Via API
POST http://localhost:3000/api/cars
Body: {
  "brand": "Toyota",
  "model": "Camry",
  "bodyType": "Sedan",
  "fuelType": "Hybrid",
  "transmission": "Automatic",
  "seating": 5,
  "basePrice": 4500000,
  "description": "Premium hybrid sedan..."
}
```

#### 2. **Upload Car Images**
```bash
# Via API
POST http://localhost:3000/api/cars/{car_id}/images
Form Data:
  - images: [file1.jpg, file2.jpg, ...]
  - type: "exterior" or "interior"
```

#### 3. **Manage Inventory**
```
Dealer Dashboard → "My Listings"
View all your cars → Edit/Update/Delete
Track views and test drive requests
```

### For Mentors

#### 1. **Accept Consultation Requests**
```
Mentor Dashboard → "New Requests"
View client details and requirements
Accept consultation → Schedule session
```

#### 2. **Provide Guidance**
```
Access client's shortlisted cars
Review requirements and budget
Provide recommendations
Share expertise on features, pricing, financing
```

#### 3. **Build Reputation**
```
Complete consultations → Earn ratings
Respond to reviews → Build profile
Track success metrics
```

### For Service Providers

#### 1. **Manage Test Drive Bookings**
```
Service Dashboard → "Upcoming Test Drives"
View booking details (date, time, location)
Prepare vehicles → Coordinate logistics
Mark as completed after test drive
```

#### 2. **Customer Service**
```
Handle customer queries
Ensure smooth test drive experience
Collect feedback
```

## �🔌 API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with filters)
  - Query params: `brand`, `bodyType`, `fuelType`, `transmission`, `minPrice`, `maxPrice`
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car
- `PATCH /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `POST /api/cars/:id/images` - Upload car images

### Authentication
- `POST /api/auth/register` - Register user
  - Body: `{ name, email, phone, password, role }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }` or `{ phone, password }`
- `GET /api/auth/me` - Get current user (requires JWT)
- `PATCH /api/auth/me` - Update profile (requires JWT)

### Test Drive
- `GET /api/testdrive/cart` - Get cart (requires JWT)
- `POST /api/testdrive/cart/items` - Add to cart
  - Body: `{ carId }`
- `DELETE /api/testdrive/cart/items/:carId` - Remove from cart
- `GET /api/testdrive/pricing-summary` - Get pricing details
- `POST /api/testdrive/checkout` - Complete booking
  - Body: `{ date, time, location }`

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

## 👥 User Registration Examples

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

### Register a Mentor

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Williams",
    "email": "sarah@carmaven.com",
    "phone": "9876543212",
    "password": "mentorpassword",
    "role": "mentor"
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
  role: 'client' | 'dealer' | 'service_provider' | 'mentor' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Test Drive Model
```javascript
{
  userId: ObjectId,
  carIds: [ObjectId],
  date: Date,
  time: String,
  location: String,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  totalPrice: Number,
  createdAt: Date
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
6. Test login with phone OTP

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

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📦 Sample Data

The seed script (`npm run seed`) populates the database with:
- 5 sample cars (Toyota Supra, Honda Civic Type R, Hyundai Creta, Maruti Swift, Tata Nexon EV)
- Complete car details (specs, variants, features)
- Sample images (using Unsplash URLs)
- Sample users (all roles)

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

### Phone OTP Not Working
- Verify Firebase configuration in frontend `.env`
- Check Firebase Console phone auth is enabled
- Ensure test phone numbers are added (for development)
- See [FIREBASE_PHONE_AUTH_SETUP.md](./FIREBASE_PHONE_AUTH_SETUP.md) for detailed setup

## 📚 Documentation

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Detailed integration guide
- [FIREBASE_PHONE_AUTH_SETUP.md](./FIREBASE_PHONE_AUTH_SETUP.md) - Firebase phone authentication setup
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Initial setup documentation
- [LOGIN_INTEGRATION_COMPLETE.md](./LOGIN_INTEGRATION_COMPLETE.md) - Login system documentation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **File Upload**: Multer
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Dev Tools**: Nodemon

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Firebase (Phone OTP)
- **Animations**: Motion (Framer Motion)
- **HTTP Client**: Fetch  API

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Type Checking**: TypeScript
- **Hot Reload**: Vite HMR, Nodemon

## 🎨 Features Roadmap

### Upcoming Features
- [ ] **Admin Panel**: Complete dashboard for platform management
- [ ] **Mentor Marketplace**: Browse, filter, and book mentors
- [ ] **Live Chat**: Real-time communication between users and mentors
- [ ] **Video Consultations**: Virtual meetings with mentors
- [ ] **Car Comparison Tool**: Side-by-side comparison of multiple cars
- [ ] **Reviews & Ratings**: User reviews for cars, dealers, and mentors
- [ ] **Wishlist/Favorites**: Save cars for later viewing
- [ ] **Advanced Search**: Autocomplete, voice search, AI-powered recommendations
- [ ] **Notifications System**: Email, SMS, and push notifications
- [ ] **Payment Integration**: Razorpay/Stripe for booking payments
- [ ] **Analytics Dashboard**: Insights for dealers and admins
- [ ] **Mobile App**: React Native mobile application
- [ ] **Cloud Storage**: AWS S3/Cloudinary for image hosting
- [ ] **AI Recommendations**: ML-based car suggestions
- [ ] **Virtual Showroom**: 360° car views and AR features

### Planned Improvements
- [ ] Pagination for large datasets
- [ ] Advanced filtering with saved searches
- [ ] Social media sharing
- [ ] PDF reports for car comparisons
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)
- [ ] Performance optimization
- [ ] Comprehensive testing suite

## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤝 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation files

## 👥 Team

**Known Development Team**
- Building the future of car buying automation

---

**Made with ❤️ by the Known Team**
