const mongoose = require('mongoose');

const RequestItemSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    priceApplied: { type: Number, required: true }
  },
  { _id: false }
);

const TestDriveRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [RequestItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending','accepted','completed','cancelled'], default: 'pending', index: true },
    preferredTime: { type: Date },
    location: { type: String },
    assignedProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestDriveRequest', TestDriveRequestSchema);
