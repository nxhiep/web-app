"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopicsProgressByTopicIdsFailure = exports.getTopicsProgressByTopicIdsSuccess = exports.getTopicsProgressByTopicIds = exports.updateTopicsProgressSuccess = exports.updateTopicsProgress = exports.calcularParentTopicsProgress = exports.calcularTopicsProgress = exports.resetTopicProgress = void 0;

var Types = _interopRequireWildcard(require("./types"));

var resetTopicProgress = topicProgress => {
  return {
    type: Types.RESET_TOPIC_PROGRESS,
    topicProgress: topicProgress
  };
};

exports.resetTopicProgress = resetTopicProgress;

var calcularTopicsProgress = (topic, progress) => {
  return {
    type: Types.CALCULAR_TOPICS_PROGRESS,
    topic: topic,
    progress: progress
  };
};

exports.calcularTopicsProgress = calcularTopicsProgress;

var calcularParentTopicsProgress = (childTopic, parentTopic) => {
  return {
    type: Types.CALCULAR_PARENT_TOPICS_PROGRESS,
    topic: childTopic,
    parentTopic: parentTopic
  };
};

exports.calcularParentTopicsProgress = calcularParentTopicsProgress;

var updateTopicsProgress = topicsProgress => {
  return {
    type: Types.UPDATE_TOPICS_PROGRESS,
    data: topicsProgress
  };
};

exports.updateTopicsProgress = updateTopicsProgress;

var updateTopicsProgressSuccess = topicsProgress => {
  return {
    type: Types.UPDATE_TOPICS_PROGRESS_SUCCESS,
    data: topicsProgress
  };
};

exports.updateTopicsProgressSuccess = updateTopicsProgressSuccess;

var getTopicsProgressByTopicIds = ids => {
  return {
    type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS,
    params: ids
  };
};

exports.getTopicsProgressByTopicIds = getTopicsProgressByTopicIds;

var getTopicsProgressByTopicIdsSuccess = topicsProgress => {
  return {
    type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_SUCCESS,
    data: topicsProgress
  };
};

exports.getTopicsProgressByTopicIdsSuccess = getTopicsProgressByTopicIdsSuccess;

var getTopicsProgressByTopicIdsFailure = error => {
  return {
    type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_FAILURE,
    error: error
  };
};

exports.getTopicsProgressByTopicIdsFailure = getTopicsProgressByTopicIdsFailure;