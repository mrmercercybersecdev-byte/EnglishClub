// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['meeting', 'competition', 'workshop', 'seminar',
           'social', 'fundraiser', 'other'],
    default: 'meeting'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String },
  isOnline: { type: Boolean, default: false },
  meetingLink: String,
  coverImage: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    registeredAt: { type: Date, default: Date.now }
  }],
  maxAttendees: Number,
  isActive: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);