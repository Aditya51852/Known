const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    passwordHash: { type: String },
    name: { type: String, trim: true },
    phone: { type: String, unique: true, sparse: true },
    company: { type: String, trim: true },
    bio: { type: String },
    avatarUrl: { type: String },
    address: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    },
    socialAuth: {
      googleId: { type: String, unique: true, sparse: true },
      phoneVerified: { type: Boolean, default: false }
    },
    roles: {
      type: [String],
      default: ['dealer'],
      index: true
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

DealerSchema.index({ name: 'text', company: 'text', bio: 'text' });

module.exports = mongoose.model('Dealer', DealerSchema);
