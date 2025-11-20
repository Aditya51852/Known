const mongoose = require('mongoose');

const DealerSessionSchema = new mongoose.Schema(
  {
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', index: true, required: true },
    tokenHash: { type: String, required: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
    revoked: { type: Boolean, default: false, index: true },
    rotatedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'DealerSession' },
    expiresAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DealerSession', DealerSessionSchema);
