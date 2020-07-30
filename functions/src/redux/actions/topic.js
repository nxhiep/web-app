"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopicsByParentIdFailure = exports.getTopicsByParentIdSuccess = exports.getTopicsByParentId = exports.getTopicByIdFailure = exports.getTopicByIdSuccess = exports.getTopicById = void 0;

var Types = _interopRequireWildcard(require("./types"));

var getTopicById = id => {
  return {
    type: Types.GET_TOPIC_BY_ID,
    params: id
  };
};

exports.getTopicById = getTopicById;

var getTopicByIdSuccess = topic => {
  return {
    type: Types.GET_TOPIC_BY_ID_SUCCESS,
    params: topic ? topic.id : -1,
    topic: topic
  };
};

exports.getTopicByIdSuccess = getTopicByIdSuccess;

var getTopicByIdFailure = (id, error) => {
  return {
    type: Types.GET_TOPIC_BY_ID_FAILURE,
    params: id,
    error: error
  };
};

exports.getTopicByIdFailure = getTopicByIdFailure;

var getTopicsByParentId = parentId => {
  return {
    type: Types.GET_TOPICS_BY_PARENT_ID,
    params: parentId
  };
};

exports.getTopicsByParentId = getTopicsByParentId;

var getTopicsByParentIdSuccess = (parentId, topics) => {
  return {
    type: Types.GET_TOPICS_BY_PARENT_ID_SUCCESS,
    params: parentId,
    data: topics
  };
};

exports.getTopicsByParentIdSuccess = getTopicsByParentIdSuccess;

var getTopicsByParentIdFailure = (parentId, error) => {
  return {
    type: Types.GET_TOPICS_BY_PARENT_ID_FAILURE,
    params: parentId,
    error: error
  };
};

exports.getTopicsByParentIdFailure = getTopicsByParentIdFailure;