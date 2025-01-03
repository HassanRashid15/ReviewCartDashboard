const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    sparse: true,
  },
  verificationCodeExpires: {
    type: Date,
    sparse: true,
  },
  // New fields for secure password reset
  resetToken: {
    type: String,
    sparse: true,
  },
  resetTokenExpires: {
    type: Date,
    sparse: true,
  },
  passwordChangedAt: {
    type: Date,
  },
  resetAttempts: {
    type: Number,
    default: 0,
  },
  passwordHistory: [{
    password: String,
    changedAt: Date
  }],
  lastPasswordReset: {
    type: Date,
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return code;
};

// New methods for secure password reset
userSchema.methods.generateResetToken = function () {
  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and save to database
  this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.resetAttempts = 0;

  return resetToken;
};

userSchema.methods.addPasswordToHistory = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Keep only last 5 passwords
  this.passwordHistory = this.passwordHistory || [];
  if (this.passwordHistory.length >= 5) {
    this.passwordHistory.shift();
  }

  this.passwordHistory.push({
    password: hashedPassword,
    changedAt: new Date()
  });
};

userSchema.methods.isPasswordInHistory = async function (newPassword) {
  if (!this.passwordHistory) return false;

  for (let entry of this.passwordHistory) {
    if (await bcrypt.compare(newPassword, entry.password)) {
      return true;
    }
  }
  return false;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;