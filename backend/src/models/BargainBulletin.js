const mongoose = require('mongoose');
const crypto = require('crypto');

const BargainBulletinSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'BargainSession', required: true, index: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },

    // Anonymous token ID — refreshed every participation so dealer can't be tracked
    anonymousTokenId: {
      type: String,
      required: true,
      default: () => 'TKN-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      index: true,
    },

    // Pricing
    offeredPrice: { type: Number, required: true },
    priceBreakdown: {
      exShowroom: Number,
      roadTax: Number,
      insurance: Number,
      registration: Number,
      accessories: Number,
      handling: Number,
      discount: Number,
      totalOnRoad: Number,
    },

    // Offers & extras
    offers: [{ type: String }],          // e.g. "Free first service", "Extended warranty"
    discounts: [{ type: String }],        // e.g. "₹25,000 exchange bonus"
    financingOptions: {
      emiAvailable: { type: Boolean, default: false },
      interestRate: Number,
      maxTenureMonths: Number,
      downPayment: Number,
    },

    // Delivery
    estimatedDeliveryDays: { type: Number },
    freeAccessories: [{ type: String }],

    // Status
    isLocked: { type: Boolean, default: false },
    lockedAt: { type: Date },
  },
  { timestamps: true }
);

// One bulletin per dealer per session
BargainBulletinSchema.index({ sessionId: 1, dealerId: 1 }, { unique: true });

module.exports = mongoose.model('BargainBulletin', BargainBulletinSchema);
