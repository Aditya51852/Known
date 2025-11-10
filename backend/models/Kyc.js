const mongoose = require('mongoose');

const KycSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    aadhar: { type: String },
    pan: { type: String },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kyc', KycSchema);
