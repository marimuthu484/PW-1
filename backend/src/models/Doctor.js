const mongoose = require('mongoose');
const { DOCTOR_STATUS } = require('../config/constants');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization']
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification']
  },
  experience: {
    type: Number,
    required: [true, 'Please provide experience in years']
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide medical license number'],
    unique: true
  },
  clinicAddress: {
    type: String,
    required: [true, 'Please provide clinic address']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please provide consultation fee'],
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(DOCTOR_STATUS),
    default: DOCTOR_STATUS.PENDING
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'degree', 'certificate', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  rejectedAt: Date,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

// Populate user data when querying
doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
