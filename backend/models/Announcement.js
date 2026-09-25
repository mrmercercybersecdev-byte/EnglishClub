// backend/models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['general', 'event', 'urgent', 'achievement', 'competition'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  targetAudience: {
    type: String,
    enum: ['all', 'members', 'officers', 'specific-grade'],
    default: 'all'
  },
  targetGrades: [String],
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);