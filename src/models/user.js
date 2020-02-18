const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const isEmail = require('isemail');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    validate: [isEmail.validate, 'Invalid email address.'],
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long.'],
  },
});

userSchema.pre('save', function encryptPaswword(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bycrypt.hash(this.password, 10, (error, hash) => {
      if (error) {
        next(error);
      } else {
        this.password = hash;
        return next();
      }
    });
  }
});

userSchema.methods.sanitise = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
