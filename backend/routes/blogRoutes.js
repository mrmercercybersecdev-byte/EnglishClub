// backend/routes/blogRoutes.js
const router = require('express').Router();
const {
  getAllPosts, getPostBySlug, createPost,
  updatePost, deletePost, likePost
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, authorize('editor', 'admin', 'superadmin'), createPost);
router.put('/:id', protect, authorize('editor', 'admin', 'superadmin'), updatePost);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deletePost);
router.post('/:id/like', protect, likePost);

module.exports = router;