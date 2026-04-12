const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Business must belong to a user/admin']
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true
  },
  documents: {
    type: [String], // Array of document URLs
    required: [true, 'Please provide verification documents']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Please provide a business category'],
    enum: [
      'Restaurant', 'Retail', 'Service', 'Entertainment', 'Health', 'Other'
    ]
  }
}, {
  timestamps: true
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
