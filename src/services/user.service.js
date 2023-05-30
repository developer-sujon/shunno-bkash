//external lib import
const httpStatus = require('http-status');

//internal lib import
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'email already taken');
  }
  return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = (email) => {
  return User.findOne({ email });
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = (id) => {
  return User.findById(id);
};

/**
 * update user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const updateUserById = (id, updateBody) => {
  return User.findByIdAndUpdate(id, updateBody, { new: true });
};

/**
 * get Users
 * @returns {Promise<[User]>}
 */
const getUsers = (matchQuery) => {
  return User.find(matchQuery);
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUserById,
  getUserById,
  getUsers,
};
