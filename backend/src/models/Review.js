const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    targetModel: { type: String, enum: ['User', 'Dealer', 'Car'], required: true },
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorConsultation' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String },
  },
  { timestamps: true }
);

// One review per reviewer per target
ReviewSchema.index({ reviewerId: 1, targetId: 1, targetModel: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
