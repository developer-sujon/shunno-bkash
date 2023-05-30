//external lib import
const mongoose = require('mongoose');

//internal lib import
const { toJSON, paginate } = require('./plugins');

const keySchema = mongoose.Schema(
  {
    ownerID: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    keyID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
keySchema.plugin(toJSON);
keySchema.plugin(paginate);

/**
 * @typedef Key
 */
const Key = mongoose.model('Key', keySchema);

module.exports = Key;
