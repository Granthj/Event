const mongoose = require('mongoose');
const schema = mongoose.Schema;

const passwordResetSessionSchema = schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Optional: Index for automatic expiry cleanup (if using TTL index)
passwordResetSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordResetSession', passwordResetSessionSchema);