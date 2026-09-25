const router = require('express').Router();

const profiles = new Map([
  ['demo-user', {
    id: 'demo-user',
    name: 'Alex Morgan',
    role: 'member',
    bio: 'Curious learner, occasional poet, always up for a good question.',
    credits: 645,
    streak: 9,
    privacy: { publicProfile: true, messages: true }
  }]
]);

const posts = [
  {
    id: 'post-1',
    author: 'Maya Okafor',
    role: 'teacher',
    text: 'What is one English word you wish existed in every language?',
    type: 'note',
    likes: 24,
    comments: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'post-2',
    author: 'Jordan Lee',
    role: 'member',
    text: 'I used my new serendipity badge in a conversation today.',
    type: 'note',
    likes: 16,
    comments: 5,
    createdAt: new Date().toISOString()
  }
];

const events = [
  { id: 'event-1', title: 'The brave first sentence', type: 'Conversation circle', date: '2026-10-04', place: 'Room 204', attendees: 18 },
  { id: 'event-2', title: 'Poetry after school', type: 'Creative writing', date: '2026-10-11', place: 'The Atrium', attendees: 12 },
  { id: 'event-3', title: 'Words that travel', type: 'Guest talk', date: '2026-10-18', place: 'Main hall', attendees: 31 }
];

const rankings = [
  { name: 'Maya Okafor', role: 'teacher', credits: 820, streak: 22 },
  { name: 'Theo Martin', role: 'member', credits: 710, streak: 16 },
  { name: 'Alex Morgan', role: 'member', credits: 645, streak: 9 },
  { name: 'Amina Yusuf', role: 'admin', credits: 580, streak: 14 }
];

const allowedRoles = new Set(['member', 'teacher', 'admin']);
const allowedTypes = new Set(['note', 'question', 'photo', 'video']);

router.get('/feed', (req, res) => {
  res.json({ success: true, posts });
});

router.post('/posts', (req, res) => {
  const { text, type = 'note', author = 'Alex Morgan', role = 'member' } = req.body;
  if (typeof text !== 'string' || text.trim().length < 2 || text.length > 2000) {
    return res.status(400).json({ success: false, message: 'Post text must be between 2 and 2000 characters.' });
  }
  if (!allowedTypes.has(type) || !allowedRoles.has(role)) {
    return res.status(400).json({ success: false, message: 'Unsupported post type or role.' });
  }

  const post = {
    id: `post-${Date.now()}`,
    author,
    role,
    text: text.trim(),
    type,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString()
  };
  posts.unshift(post);
  res.status(201).json({ success: true, post, creditsAwarded: 10 });
});

router.post('/posts/:id/like', (req, res) => {
  const post = posts.find((item) => item.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  post.likes += 1;
  res.json({ success: true, likes: post.likes });
});

router.post('/posts/:id/comments', (req, res) => {
  const post = posts.find((item) => item.id === req.params.id);
  const { text, author = 'Alex Morgan' } = req.body;
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  if (typeof text !== 'string' || text.trim().length < 1 || text.length > 500) {
    return res.status(400).json({ success: false, message: 'Comment must be between 1 and 500 characters.' });
  }
  post.comments += 1;
  res.status(201).json({ success: true, comment: { author, text: text.trim() }, creditsAwarded: 3 });
});

router.get('/events', (req, res) => {
  res.json({ success: true, events });
});

router.post('/events/:id/rsvp', (req, res) => {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
  event.attendees += 1;
  res.json({ success: true, event, status: 'going' });
});

router.get('/rankings', (req, res) => {
  res.json({ success: true, period: req.query.period || 'month', rankings });
});

router.get('/profile/:id', (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
  res.json({ success: true, profile });
});

router.patch('/profile/:id', (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
  const { name, bio, privacy } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.length > 80)) {
    return res.status(400).json({ success: false, message: 'Name must be between 2 and 80 characters.' });
  }
  if (bio !== undefined && (typeof bio !== 'string' || bio.length > 500)) {
    return res.status(400).json({ success: false, message: 'Bio cannot exceed 500 characters.' });
  }
  if (name !== undefined) profile.name = name.trim();
  if (bio !== undefined) profile.bio = bio.trim();
  if (privacy && typeof privacy === 'object') profile.privacy = { ...profile.privacy, ...privacy };
  res.json({ success: true, profile });
});

module.exports = router;
