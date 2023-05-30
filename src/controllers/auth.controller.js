//external lib import
const httpStatus = require('http-status');

//internal lib import
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, profileService } = require('../services');
const genRand = require('../helpers/genRand');
const { Otp } = require('../models');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send({ status: true, message: 'user create successful', data: user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ status: true, message: 'user login successful', data: tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.params.refreshToken);
  res.send({ status: true, message: null, data: tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!(await userService.getUserByEmail(email))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }

  const randomOtp = genRand(6);
  new Otp({
    email,
    otp: randomOtp,
  }).save();
  const subject = 'Task Hellwet Soft PIN Verification';
  const text = `Dear user,
To reset your password, your Otp Code is ${randomOtp}
If you did not request any password resets, then ignore this email.`;
  const data = await emailService.sendEmail(email, subject, text);
  res.send({ status: true, message: 'a 6 digit verification code has been sent to your email address.', data });
});

const verifyEmail = catchAsync(async (req, res) => {
  const verifyEmailOtp = await tokenService.generateVerifyEmailOtp(req.body.email, req.query.otp);
  res.send({ status: true, message: 'otp verify successful', data: verifyEmailOtp });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.otp, req.body.email, req.body.password);
  res.send({ status: true, message: 'password reset successful', data: null });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
