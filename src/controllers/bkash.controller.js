//external lib import
const httpStatus = require('http-status');

//internal lib import
const catchAsync = require('../utils/catchAsync');
const { bkashService } = require('../services');
/**
 * @desc bkash webhook notification
 * @access private
 * @route /api/v1/bkash/notification
 * @method POST
 */

const webhookNotification = catchAsync(async (req, res) => {
  const messageType = req.header('x-amz-sns-message-type');

  const data = await bkashService.webhookNotification(messageType, req.body);
  res.json({ status: true, message: 'ok', data });
});

module.exports = {
  webhookNotification,
};
