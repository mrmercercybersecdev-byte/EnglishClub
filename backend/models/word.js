// backend/models/Word.js
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phonetic: { type: String },
  audioUrl: { type: String },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun',
           'preposition', 'conjunction', 'interjection', 'phrase'],
    required: true
  },
  definitions: [{
    definition: { type: String, required: true },
    example: { type: String }
  }],
  synonyms: [{ type: String }],
  antonyms: [{ type: String }],
  etymology: { type: String },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  category: {
    type: String,
    enum: ['academic', 'everyday', 'idiom', 'phrasal-verb',
           'slang', 'formal', 'literary']
  },
  isWordOfTheDay: { type: Boolean, default: false },
  wordOfTheDayDate: { type: Date },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageNotes: { type: String },
  relatedWords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],
}, { timestamps: true });

wordSchema.index({ word: 'text', 'definitions.definition': 'text' });

module.exports = mongoose.model('Word', wordSchema);