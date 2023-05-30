//external lib import
const Joi = require('joi');

//internal lib import
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    photo: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  params: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    otp: Joi.string().min(6).max(6).required(),
  }),
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    otp: Joi.string().min(6).max(6).required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    email: Joi.string().required().email(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  verifyEmail,
  resetPassword,
};
