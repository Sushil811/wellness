const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updated_at field before saving
sessionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Index for better query performance
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ tags: 1 });

// Method to get sessions without sensitive data
sessionSchema.methods.toJSON = function() {
  const session = this.toObject();
  return session;
};

module.exports = mongoose.model('Session', sessionSchema); 