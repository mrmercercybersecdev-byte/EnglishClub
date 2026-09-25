// backend/controllers/blogController.js
const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, category, tag,
      search, status = 'published', sort = '-publishedAt'
    } = req.query;

    const query = { status };

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'username firstName lastName avatar bio')
      .populate('category', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await BlogPost.create({
      ...req.body,
      author: req.user._id,
      publishedAt: req.body.status === 'published' ? new Date() : null
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString()
        && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.status === 'published' && !post.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index > -1) {
      post.likes.splice(index, 1); // Unlike
    } else {
      post.likes.push(req.user._id); // Like
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};