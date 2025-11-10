const mongoose = require('mongoose');

const ServiceProviderProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    points: { type: Number, default: 0 },
    totalServices: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceProviderProfile', ServiceProviderProfileSchema);
