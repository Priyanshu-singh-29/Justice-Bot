const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  caseType: {
    type: String,
    enum: ['criminal', 'civil', 'corporate', 'family', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysis: {
    summary: String,
    legalPoints: [String],
    recommendations: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    updatedAt: Date
  },
  documents: [{
    name: String,
    url: String,
    fileType: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Case', caseSchema);
