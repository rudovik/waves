const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    required: true,
    type: String,
    maxlength: 100
  },
  lastname: {
    required: true,
    type: String,
    maxlength: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_I);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (!isMatch) throw new Error('Invalid Credentials');
};

userSchema.methods.generateToken = async function () {
  var token = jwt.sign(this.id, process.env.SECRET);
  this.token = token;
  return await this.save();
};

userSchema.statics.findByToken = async function (token) {
  const userId = jwt.verify(token, process.env.SECRET);
  if (!userId) throw new Error('Error!!!');

  const user = await this.findOne({ _id: userId, token: token });
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
