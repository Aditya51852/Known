const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    priceApplied: { type: Number, required: true }
  },
  { _id: false }
);

const TestDriveCartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [CartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestDriveCart', TestDriveCartSchema);
