const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorConsultation', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['client', 'mentor'], required: true },
    message: { type: String, required: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
