//external lib import
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

//internal lib import
// const { bkash } = require('../models');

/**
 * @desc bkash webhook notification
 * @returns {Promise<bkash>}
 */

const webhookNotification = (postBody) => {
  return postBody
};


module.exports = {
  webhookNotification,
};
