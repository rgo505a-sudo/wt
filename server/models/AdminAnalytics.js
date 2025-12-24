const mongoose = require('mongoose');

const AdminAnalyticsSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    adminEmail: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    // Session Tracking
    sessionStarted: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sessionEnded: {
      type: Date,
      default: null,
    },
    sessionDuration: {
      type: Number, // Duration in milliseconds
      default: null,
    },
    // Activity Metrics
    accountsCreated: {
      type: Number,
      default: 0,
    },
    contactsAdded: {
      type: Number,
      default: 0,
    },
    messagesSent: {
      type: Number,
      default: 0,
    },
    campaignsCreated: {
      type: Number,
      default: 0,
    },
    templatesCreated: {
      type: Number,
      default: 0,
    },
    // Subscription Information
    currentPlan: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise', 'custom'],
      default: 'free',
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    // Feature Usage
    featureUsage: {
      bulkMessaging: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
      },
      scheduling: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
      },
      templates: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
      },
      interactiveButtons: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
      },
      mediaUpload: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
        totalSize: {
          type: Number, // Size in bytes
          default: 0,
        },
      },
      aiChat: {
        enabled: {
          type: Boolean,
          default: false,
        },
        used: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: {
          type: Date,
          default: null,
        },
        tokensUsed: {
          type: Number,
          default: 0,
        },
      },
    },
    // Device Information
    deviceInfo: {
      userAgent: {
        type: String,
        default: null,
      },
      ipAddress: {
        type: String,
        default: null,
        index: true,
      },
      browser: {
        name: {
          type: String,
          default: null,
        },
        version: {
          type: String,
          default: null,
        },
      },
      os: {
        name: {
          type: String,
          default: null,
        },
        version: {
          type: String,
          default: null,
        },
      },
      deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default: 'unknown',
      },
    },
    // Status and Location
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active',
      index: true,
    },
    location: {
      country: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      timezone: {
        type: String,
        default: null,
      },
      coordinates: {
        latitude: {
          type: Number,
          default: null,
        },
        longitude: {
          type: Number,
          default: null,
        },
      },
    },
    // Performance Metrics
    metrics: {
      loginCount: {
        type: Number,
        default: 0,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
      lastActivity: {
        type: Date,
        default: null,
        index: true,
      },
      averageSessionDuration: {
        type: Number, // Duration in milliseconds
        default: 0,
      },
      totalSessionTime: {
        type: Number, // Duration in milliseconds
        default: 0,
      },
      failedLoginAttempts: {
        type: Number,
        default: 0,
      },
      passwordChanges: {
        type: Number,
        default: 0,
      },
      lastPasswordChange: {
        type: Date,
        default: null,
      },
      apiKeysCreated: {
        type: Number,
        default: 0,
      },
      webhooksConfigured: {
        type: Number,
        default: 0,
      },
      integrationConnections: {
        type: Number,
        default: 0,
      },
    },
    // Admin Notes
    adminNotes: {
      type: String,
      default: null,
      maxlength: 5000,
    },
    // Audit Trail
    auditLog: [
      {
        action: {
          type: String,
          enum: [
            'login',
            'logout',
            'account_created',
            'contact_added',
            'message_sent',
            'campaign_created',
            'template_created',
            'feature_enabled',
            'feature_disabled',
            'plan_upgraded',
            'plan_downgraded',
            'settings_changed',
            'password_changed',
            'admin_note_added',
            'status_changed',
          ],
          required: true,
        },
        details: {
          type: String,
          default: null,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: {
          type: String,
          default: null,
        },
      },
    ],
    // Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'adminAnalytics',
  }
);

// Indexes for optimized queries
AdminAnalyticsSchema.index({ adminId: 1, createdAt: -1 });
AdminAnalyticsSchema.index({ status: 1, lastActivity: -1 });
AdminAnalyticsSchema.index({ 'metrics.lastLogin': -1 });
AdminAnalyticsSchema.index({ currentPlan: 1 });
AdminAnalyticsSchema.index({ 'deviceInfo.ipAddress': 1 });

// Virtual for determining if admin is online
AdminAnalyticsSchema.virtual('isOnline').get(function () {
  if (!this.sessionEnded) {
    return this.status === 'active';
  }
  return false;
});

// Method to calculate session duration
AdminAnalyticsSchema.methods.calculateSessionDuration = function () {
  if (this.sessionStarted && this.sessionEnded) {
    this.sessionDuration = this.sessionEnded.getTime() - this.sessionStarted.getTime();
  }
  return this.sessionDuration;
};

// Method to update last activity
AdminAnalyticsSchema.methods.updateLastActivity = function () {
  this.metrics.lastActivity = new Date();
  return this.save();
};

// Method to add audit log entry
AdminAnalyticsSchema.methods.addAuditLog = function (action, details, ipAddress) {
  this.auditLog.push({
    action,
    details,
    ipAddress,
    timestamp: new Date(),
  });
  return this.save();
};

// Method to end session
AdminAnalyticsSchema.methods.endSession = function () {
  this.sessionEnded = new Date();
  this.calculateSessionDuration();
  return this.save();
};

// Method to track feature usage
AdminAnalyticsSchema.methods.trackFeatureUsage = function (featureName) {
  if (this.featureUsage[featureName]) {
    this.featureUsage[featureName].used = true;
    this.featureUsage[featureName].count += 1;
    this.featureUsage[featureName].lastUsed = new Date();
    this.metrics.lastActivity = new Date();
    return this.save();
  }
  return Promise.reject(new Error(`Feature ${featureName} not found`));
};

// Pre-save middleware to update updatedAt
AdminAnalyticsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AdminAnalytics', AdminAnalyticsSchema);
