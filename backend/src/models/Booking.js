const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: {
      name: String,
      email: String,
      phone: String
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending', index: true },
    priceQuoted: { type: Number },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
