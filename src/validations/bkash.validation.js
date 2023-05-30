//external lib import
const Joi = require('joi');

//internal lib import
const { objectId } = require('./custom.validation');

const webhookNotification = {
  body: Joi.object().keys({
   
  }),
};

module.exports = {
  webhookNotification,
};
