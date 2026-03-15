const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  },
  { timestamps: true }
);

WishlistSchema.index({ userId: 1, carId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
