const mongoose = require('mongoose');

const BargainSessionSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    status: {
      type: String,
      enum: ['open', 'locked', 'completed', 'expired', 'cancelled'],
      default: 'open',
      index: true,
    },
    lockedBulletinId: { type: mongoose.Schema.Types.ObjectId, ref: 'BargainBulletin', default: null },
    lockedDealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', default: null },
    tokenPaymentAmount: { type: Number, default: 0 },
    tokenPaymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    notifiedDealerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dealer' }],
  },
  { timestamps: true }
);

// Auto-expire sessions
BargainSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BargainSession', BargainSessionSchema);
