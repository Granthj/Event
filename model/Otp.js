const mongoose = require('mongoose');
const schema = mongoose.Schema;

const otpSchema = schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  ttlAt: {
    type: Date,
    required: true, // For auto-deletion after 1 hour
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Optional: Automatically delete expired OTPs using TTL index
otpSchema.index({ ttlAt: 1 }, { expireAfterSeconds: 0});

module.exports = mongoose.model('Otp', otpSchema);
