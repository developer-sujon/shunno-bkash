//external lib import
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');

//internal lib import
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { Otp } = require('../models');

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
  const user = await userService.getUserById(refreshTokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'please authenticate');
  }
  await refreshTokenDoc.remove();
  return tokenService.generateAuthTokens(user);
};

/**
 * Reset password otp
 * @param {string} resetPassword
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (otp, email, newPassword) => {
  newPassword = await bcrypt.hash(newPassword, 8);

  const validOtp = await Otp.findOne({ email, otp, status: true });

  if (!validOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid otp code');
  }
  const user = await userService.getUserByEmail(validOtp.email);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'password reset failed');
  }
  return await userService.updateUserById(user.id, { password: newPassword });
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
  const user = await userService.getUserById(verifyEmailTokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'email verification failed');
  }
  await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
  await userService.updateUserById(user.id, { isEmailVerified: true });
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
