//external lib import
const mongoose = require('mongoose');
const validator = require('validator');

//internal lib import
const { toJSON, paginate } = require('./plugins');

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('invalid email');
        }
      },
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);
otpSchema.plugin(paginate);

/**
 * @typedef Otp
 */
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
