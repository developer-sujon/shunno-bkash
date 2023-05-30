//external lib import
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

//internal lib import
const { toJSON, paginate } = require('./plugins');

const vaultSchema = mongoose.Schema(
  {
    ownerID: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    keyID: String,
    clientApp: {
      type: String,
      enum: ['NETFEE', 'HISABNIKASH', 'BAYANNOPAY', 'SHUNNOIT'],
      default: 'SHUNNOIT',
    },
    publicID: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    extension: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
        required: false,
      },
    ],
    auth: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: false,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    garbage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
vaultSchema.plugin(toJSON);
vaultSchema.plugin(paginate);

vaultSchema.pre('save', async function (next) {
  const vault = this;
  vault.publicID = new Date().getTime().toString(36) + uuidv4();
  next();
});

/**
 * @typedef Vault
 */
const Vault = mongoose.model('Vault', vaultSchema);

module.exports = Vault;
