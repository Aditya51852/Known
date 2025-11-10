const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, index: true, unique: true, sparse: true },
    phone: { type: String, index: true, unique: true, sparse: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['client','dealer','mentor','service_provider','admin'], default: 'client', index: true },
    
    // Social auth
    googleId: { type: String, index: true, unique: true, sparse: true },
    
    // Profile completion status
    profileComplete: { type: Boolean, default: false },
    
    // Profile fields
    avatar: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    
    // Address information
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    
    // User preferences
    preferences: {
      favoriteCarIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
      interestedBrands: [String],
      budgetRange: {
        min: Number,
        max: Number
      }
    },
    
    // Role-specific fields
    dealerInfo: {
      dealershipName: String,
      licenseNumber: String,
      brandsDealing: [String],
      showroomAddress: String
    },
    
    mentorInfo: {
      specialization: [String],
      experience: Number,
      rating: { type: Number, default: 0 },
      bio: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

