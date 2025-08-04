const express = require('express');
const Session = require('../models/Session');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/sessions - Public wellness sessions (published only)
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ created_at: -1 });

    res.json({
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching sessions'
    });
  }
});

// GET /api/sessions/my-sessions - User's own sessions (draft + published)
router.get('/my-sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ updated_at: -1 });

    res.json({
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching your sessions'
    });
  }
});

// GET /api/sessions/my-sessions/:id - View a single user session
router.get('/my-sessions/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid session ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error while fetching session'
    });
  }
});

// POST /api/sessions/save-draft - Save or update a draft session
router.post('/save-draft', async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;

    // Validation
    if (!title || !json_file_url) {
      return res.status(400).json({
        error: 'Title and JSON file URL are required'
      });
    }

    // Parse tags from comma-separated string
    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user._id
      });

      if (!session) {
        return res.status(404).json({
          error: 'Session not found'
        });
      }

      session.title = title;
      session.tags = parsedTags;
      session.json_file_url = json_file_url;
      session.status = 'draft';
      session.updated_at = new Date();
    } else {
      // Create new session
      session = new Session({
        user_id: req.user._id,
        title,
        tags: parsedTags,
        json_file_url,
        status: 'draft'
      });
    }

    await session.save();

    res.json({
      message: 'Draft saved successfully',
      session
    });

  } catch (error) {
    console.error('Save draft error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Internal server error while saving draft'
    });
  }
});

// POST /api/sessions/publish - Publish a session
router.post('/publish', async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;

    // Validation
    if (!title || !json_file_url) {
      return res.status(400).json({
        error: 'Title and JSON file URL are required'
      });
    }

    // Parse tags from comma-separated string
    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user._id
      });

      if (!session) {
        return res.status(404).json({
          error: 'Session not found'
        });
      }

      session.title = title;
      session.tags = parsedTags;
      session.json_file_url = json_file_url;
      session.status = 'published';
      session.updated_at = new Date();
    } else {
      // Create new published session
      session = new Session({
        user_id: req.user._id,
        title,
        tags: parsedTags,
        json_file_url,
        status: 'published'
      });
    }

    await session.save();

    res.json({
      message: 'Session published successfully',
      session
    });

  } catch (error) {
    console.error('Publish session error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Internal server error while publishing session'
    });
  }
});

module.exports = router; 