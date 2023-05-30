//external lib import
const express = require('express');

//internal lib import
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.get('/refreshTokens/:refreshToken', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgotPassword', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/verifyEmail', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/resetPassword', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
