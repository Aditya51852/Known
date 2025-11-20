const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', index: true, required: true },
    sku: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    images: [{ url: String, caption: String }],
    price: { type: Number, required: true },
    condition: { type: String, enum: ['new', 'used', 'certified'], default: 'used' },
    status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available', index: true },
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

InventorySchema.index({ title: 'text', description: 'text', sku: 'text' });

module.exports = mongoose.model('Inventory', InventorySchema);
