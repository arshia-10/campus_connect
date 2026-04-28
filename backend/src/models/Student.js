const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    cgpa: {
      type: Number,
      default: 0,
    },
    rollNo: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    resume: {
      name: { type: String, default: '' },
      type: { type: String, default: '' },
      data: { type: String, default: '' },
      uploadedAt: { type: Date },
    },
    role: {
      type: String,
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('Student', studentSchema);
