//external lib import
const mongoose = require('mongoose');

//internal lib import
const { toJSON, paginate } = require('./plugins');
const { status } = require('../config/enums');

const leaveSchema = mongoose.Schema(
  {
    studentID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      max: 30,
      min: 1,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    adminRemark: String,
    attach: Object,
    status: {
      type: String,
      enum: status,
      default: 'PENDING',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
leaveSchema.plugin(toJSON);
leaveSchema.plugin(paginate);

/**
 * @typedef Leave
 */
const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
