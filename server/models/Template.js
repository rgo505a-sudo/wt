const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  displayText: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['reply', 'url', 'call', 'copy'],
    default: 'reply'
  },
  payload: {
    type: String,
    trim: true
  },
  url: String,
  phoneNumber: String,
  copyText: String
}, { _id: false });

const listItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  rowId: {
    type: String,
    trim: true
  }
}, { _id: false });

const listSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  rows: [listItemSchema]
}, { _id: false });

const interactiveMessageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['button', 'list'],
    required: true
  },
  body: {
    type: String,
    required: true
  },
  header: String,
  footer: String,
  buttons: [buttonSchema],
  sections: [listSectionSchema],
  buttonText: String
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['greeting', 'support', 'notification', 'promotion', 'survey', 'other'],
    default: 'other'
  },
  messageType: {
    type: String,
    enum: ['text', 'interactive'],
    default: 'text'
  },
  content: {
    type: String,
    trim: true
  },
  interactive: interactiveMessageSchema,
  variables: [{
    name: String,
    description: String,
    required: Boolean,
    type: {
      type: String,
      enum: ['string', 'number', 'email', 'phone'],
      default: 'string'
    }
  }],
  language: {
    type: String,
    default: 'en'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  metadata: {
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0
    },
    expiresAt: Date,
    customData: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'templates'
});

// Indexes
templateSchema.index({ name: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ status: 1 });
templateSchema.index({ createdBy: 1 });
templateSchema.index({ language: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ createdAt: -1 });

// Virtual for message preview
templateSchema.virtual('preview').get(function() {
  return this.messageType === 'text' 
    ? this.content 
    : this.interactive?.body || '';
});

// Method to validate template structure
templateSchema.methods.validateTemplate = function() {
  const errors = [];

  if (!this.name || this.name.trim() === '') {
    errors.push('Template name is required');
  }

  if (this.messageType === 'text') {
    if (!this.content || this.content.trim() === '') {
      errors.push('Content is required for text templates');
    }
  } else if (this.messageType === 'interactive') {
    if (!this.interactive) {
      errors.push('Interactive message configuration is required');
    } else {
      if (!this.interactive.body || this.interactive.body.trim() === '') {
        errors.push('Interactive message body is required');
      }

      if (this.interactive.type === 'button' && (!this.interactive.buttons || this.interactive.buttons.length === 0)) {
        errors.push('At least one button is required for button-type interactive messages');
      }

      if (this.interactive.type === 'list' && (!this.interactive.sections || this.interactive.sections.length === 0)) {
        errors.push('At least one section is required for list-type interactive messages');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Method to replace variables in template
templateSchema.methods.render = function(variableValues = {}) {
  let content = this.messageType === 'text' ? this.content : this.interactive?.body;

  if (!content) return content;

  this.variables.forEach(variable => {
    const value = variableValues[variable.name];
    if (value !== undefined) {
      content = content.replace(`{{${variable.name}}}`, value);
    }
  });

  return content;
};

// Pre-save middleware to update updatedAt
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Template', templateSchema);
