const mongoose = require('mongoose');

const MentorConsultationSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },  // optional: consultation about specific car
    status: {
      type: String,
      enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
      index: true,
    },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
    clientMessage: { type: String },  // initial message from client
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorConsultation', MentorConsultationSchema);
