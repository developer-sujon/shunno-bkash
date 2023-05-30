//external lib import
const httpStatus = require('http-status');

//internal lib import
const ApiError = require('../utils/ApiError');

const createUniqueService = async (dataModel, uniqueValue, uniqueErorMessage, postBody) => {
  const uniqueData = await dataModel.findOne(uniqueValue);

  if (uniqueData && Object.entries(uniqueData).length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, uniqueErorMessage);
  }
  return await new dataModel(postBody).save();
};

const groupService = async (dataModel, matchQuery, groupBy) => {
  return await dataModel.aggregate([matchQuery, groupBy]);
};

const listService = async (dataModel, matchQuery, projection, sort) => {
  sort = sort || {
    $sort: {
      _id: -1,
    },
  };
  return await dataModel.aggregate([matchQuery, projection, sort]);
};

const findService = (dataModel, matchQuery, projection, sort) => {
  sort = sort || {
    _id: -1,
  };
  return dataModel.find(matchQuery).select(projection).sort(sort);
};

const findServicePopulateOne = (dataModel, matchQuery, projection, populateOne, sort) => {
  sort = sort || {
    _id: -1,
  };
  return dataModel.find(matchQuery).populate(populateOne).select(projection);
};

const findServicePopulateTwo = (dataModel, matchQuery, projection, populateOne, populateTow, sort) => {
  sort = sort || {
    _id: -1,
  };
  return dataModel.find(matchQuery).populate(populateOne).populate(populateTow).select(projection);
};

const findOneService = (dataModel, matchQuery, projection) => {
  return dataModel.findOne(matchQuery).select(projection);
};

const detailsJoinService = async (dataModel, matchQuery, joinStage, projection, replaceProperty) => {
  if (replaceProperty) {
    return await dataModel.aggregate([matchQuery, joinStage, replaceProperty, projection]);
  }
  return await dataModel.aggregate([matchQuery, joinStage, projection]);
};

const updateService = async (dataModel, matchQuery, postBody, notFoundErrorMessage) => {
  const data = await dataModel.findOne(matchQuery);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, notFoundErrorMessage);
  }
  Object.assign(data, postBody);
  return await data.save();
};

const deleteService = async (dataModel, matchQuery, notFoundErrorMessage) => {
  const data = await dataModel.findOne(matchQuery);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, notFoundErrorMessage);
  }
  await dataModel.deleteMany(matchQuery);
  return data;
};

const deleteManyService = async (dataModel, matchQuery, notFoundErrorMessage) => {
  const data = await dataModel.findOne(matchQuery);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, notFoundErrorMessage);
  }
  return await dataModel.deleteMany(matchQuery);
};

module.exports = {
  createUniqueService,
  groupService,
  listService,
  findService,
  findOneService,
  detailsJoinService,
  updateService,
  deleteService,
  deleteManyService,
  findServicePopulateOne,
  findServicePopulateTwo,
};
