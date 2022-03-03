const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    lowercase: true,
    unique: true,
    required: "Email address is required",
  },
  user_pass: {
    type: String,
    min: 6,
    required: "Password is required",
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", userSchema);
