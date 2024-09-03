const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 128,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiresIn: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  profileLink: {
    type: String,
    default: null,
  },
  premiumSubscription: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,  // Single string indicating the user's role
    enum: ["user", "admin"],  // Enum to ensure only allowed roles can be assigned
    default: "user",  // Default role is "user"
  },
});

userSchema.pre("save", function (next) {
  if (this.googleId) {
    this.isActive = true;
  }
  next();
});

userSchema.methods.generateJwt = function () {
  const userObject = this.toObject();

  const token = jwt.sign(
    {
      user: userObject,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return token;
};

module.exports = mongoose.model("Users", userSchema);
