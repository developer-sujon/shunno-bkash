//internal lib import
const express = require('express');

//external lib import
const validate = require('../../middlewares/validate');
const { bkashValidation } = require('../../validations');
const { bkashController } = require('../../controllers');

const router = express.Router();

router.post('/notification', bkashController.webhookNotification);

module.exports = router;
