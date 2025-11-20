const mongoose = require('mongoose');

const PointsLedgerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    delta: { type: Number, required: true },
    reason: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PointsLedger', PointsLedgerSchema);
