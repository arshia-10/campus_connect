const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema(
  {
    company_name: {
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
    description: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: 'company',
    },
  },
  {
    timestamps: true,
  }
);

companySchema.pre('save', async function hashPassword(next) {
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

module.exports = mongoose.model('Company', companySchema);
