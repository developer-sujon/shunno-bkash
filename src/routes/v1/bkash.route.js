//internal lib import
const express = require('express');

//external lib import
const { bkashController } = require('../../controllers');

const router = express.Router();

router.post('/notification', bkashController.webhookNotification);

module.exports = router;
