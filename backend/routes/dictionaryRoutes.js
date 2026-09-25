// backend/routes/dictionaryRoutes.js
const router = require('express').Router();
const Word = require('../models/word');

// Get all words with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 20, search, difficulty,
      partOfSpeech, category, letter
    } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (difficulty) query.difficulty = difficulty;
    if (partOfSpeech) query.partOfSpeech = partOfSpeech;
    if (category) query.category = category;
    if (letter) query.word = new RegExp(`^${letter}`, 'i');

    const words = await Word.find(query)
      .sort({ word: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Word.countDocuments(query);

    res.json({
      success: true, words,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page), total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Word of the Day
router.get('/word-of-the-day', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let word = await Word.findOne({
      isWordOfTheDay: true,
      wordOfTheDayDate: { $gte: today }
    });

    if (!word) {
      // Pick a random word
      const count = await Word.countDocuments();
      const random = Math.floor(Math.random() * count);
      word = await Word.findOne().skip(random);

      if (word) {
        word.isWordOfTheDay = true;
        word.wordOfTheDayDate = today;
        await word.save();
      }
    }

    res.json({ success: true, word });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search word
router.get('/search/:term', async (req, res) => {
  try {
    const words = await Word.find({
      word: new RegExp(req.params.term, 'i')
    }).limit(10);

    res.json({ success: true, words });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single word
router.get('/:id', async (req, res) => {
  try {
    const word = await Word.findById(req.params.id)
      .populate('relatedWords', 'word partOfSpeech');
    if (!word) return res.status(404).json({ message: 'Word not found' });
    res.json({ success: true, word });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add word (admin/editor only)
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Adding words requires authentication and is not configured yet.' });
});

module.exports = router;