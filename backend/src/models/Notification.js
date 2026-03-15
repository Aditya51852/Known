const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    recipientModel: { type: String, enum: ['User', 'Dealer'], required: true },
    type: {
      type: String,
      enum: [
        'bargain_arena_open',
        'bargain_bulletin_received',
        'bargain_locked',
        'bargain_won',
        'bargain_lost',
        'bargain_expired',
        'mentor_request',
        'mentor_accepted',
        'review_received',
        'testdrive_confirmed',
        'testdrive_completed',
        'booking_update',
        'system',
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },  // e.g. { sessionId, carId, bulletinId }
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
