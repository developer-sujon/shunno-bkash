//external lib import
const mongoose = require('mongoose');

//internal lib import
const { toJSON, paginate } = require('./plugins');

const logSchema = mongoose.Schema(
  {
    ownerID: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    vaultID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Vault',
    },
    keyID: String,
    clientApp: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    key: {
      type: String,
      default: 'generic',
    },
    size: {
      type: Number,
    },
    version: {
      type: String,
    },
    build: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
logSchema.plugin(toJSON);
logSchema.plugin(paginate);

/**
 * @typedef Log
 */
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
