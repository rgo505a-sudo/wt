const mongoose = require('mongoose');

/**
 * Contact Schema for WhatsApp Contact Management
 * Manages contact information including phone numbers, names, and metadata
 */
const contactSchema = new mongoose.Schema(
  {
    // Contact identification
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)',
      },
    },

    // Contact details
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    displayName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },

    // Contact metadata
    profilePicture: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked', 'archived'],
      default: 'active',
    },

    // WhatsApp specific
    isWhatsAppUser: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    // Contact grouping
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],

    // Additional information
    notes: {
      type: String,
      default: '',
    },

    customFields: {
      type: Map,
      of: String,
      default: new Map(),
    },

    // System fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: () => new Date('2025-12-24T05:47:24Z'),
    },

    updatedAt: {
      type: Date,
      default: () => new Date('2025-12-24T05:47:24Z'),
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'contacts',
  }
);

// Indexes for performance
contactSchema.index({ phoneNumber: 1 });
contactSchema.index({ displayName: 1 });
contactSchema.index({ createdBy: 1 });
contactSchema.index({ tags: 1 });
contactSchema.index({ status: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function () {
  const firstName = this.firstName || '';
  const lastName = this.lastName || '';
  return `${firstName} ${lastName}`.trim() || this.displayName || this.phoneNumber;
});

// Pre-save middleware
contactSchema.pre('save', function (next) {
  // Set displayName if not provided
  if (!this.displayName) {
    this.displayName = this.fullName;
  }

  // Update updatedAt timestamp
  this.updatedAt = new Date();

  next();
});

// Method to soft delete
contactSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  this.status = 'archived';
  return this.save();
};

// Method to restore soft deleted contact
contactSchema.methods.restore = function () {
  this.deletedAt = null;
  this.status = 'active';
  return this.save();
};

// Static method to find active contacts
contactSchema.statics.findActive = function () {
  return this.find({ deletedAt: null, status: { $ne: 'archived' } });
};

// Static method to find by phone number
contactSchema.statics.findByPhone = function (phoneNumber) {
  return this.findOne({ phoneNumber, deletedAt: null });
};

// Exclude soft deleted documents by default
contactSchema.query.active = function () {
  return this.where({ deletedAt: null });
};

module.exports = mongoose.model('Contact', contactSchema);
