const mongoose = require('mongoose');
const { compareValue, hashValue } = require('../utils/bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

// Remove password from the user object (used when returning user data)
userSchema.methods.omitPassword = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Compare a candidate password with the stored hash
userSchema.methods.comparePassword = async function (password) {
  return compareValue(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;