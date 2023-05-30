//external lib import
const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');

//internal lib import
const config = require('../config/config');
const userService = require('./user.service');
const { Token, Otp } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate Key token
 * @param {ObjectId} keyId
 * @returns {string}
 */
const generateKeyToken = (keyId, type, secret = config.jwt.secret) => {
  const payload = {
    sub: keyId,
    iat: moment().unix(),
    exp: Number.MAX_SAFE_INTEGER,
    type: tokenTypes.API_KEY,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, role, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    role,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('tokenNotFound');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, user.role, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'noUsersFoundWithThisEmail');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email otp
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailOtp = async (email, otp) => {
  const validOtp = await Otp.findOne({ email, otp });

  if (!validOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid otp code');
  }

  const useOtp = await Otp.findOne({ email, otp, status: true });

  if (useOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'otp already use');
  }
  return await Otp.findByIdAndUpdate(validOtp._id, { status: true }, { new: true });
};

module.exports = {
  generateKeyToken,
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailOtp,
};
