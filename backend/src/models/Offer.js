const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an offer title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String, // URL to the poster image
    required: [true, 'Please provide an offer image/poster']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required']
    }
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Offer must belong to an admin user']
  },
  isApproved: {
    type: Boolean,
    default: false // Super Admin or moderation system approval
  },
  expiryDate: {
    type: Date,
    required: [true, 'Offer must have an expiry date']
  }
}, {
  timestamps: true
});

// Geospatial index for nearby queries
offerSchema.index({ location: '2dsphere' });
offerSchema.index({ isApproved: 1, expiryDate: 1 });

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
