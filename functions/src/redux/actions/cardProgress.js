"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCardProgress = updateCardProgress;
exports.onBookmark = onBookmark;
exports.getAllCardProgress = getAllCardProgress;
exports.getAllCardProgressSuccess = getAllCardProgressSuccess;
exports.getAllCardProgressFailure = getAllCardProgressFailure;
exports.getQuestionProgressByIds = getQuestionProgressByIds;
exports.getQuestionProgressByIdsSuccess = getQuestionProgressByIdsSuccess;
exports.getQuestionProgressByIdsFailure = getQuestionProgressByIdsFailure;
exports.resetCardInTopic = void 0;

var Types = _interopRequireWildcard(require("./types"));

var resetCardInTopic = topicId => {
  return {
    type: Types.RESET_CARD_IN_TOPIC,
    topicId: topicId
  };
};

exports.resetCardInTopic = resetCardInTopic;

function updateCardProgress(questionsProgress) {
  return {
    type: Types.UPDATE_QUESTION_PROGRESS,
    data: questionsProgress
  };
}

function onBookmark(question) {
  var listProgress = new Array();
  var questionProgress = question.progress;

  if (questionProgress) {
    questionProgress.bookmark = !questionProgress.bookmark;
    listProgress.push(questionProgress);
    question.progress = questionProgress;
  }

  return updateCardProgress(listProgress);
}

function getAllCardProgress() {
  return {
    type: Types.GET_CARDS_PROGRESS
  };
}

function getAllCardProgressSuccess(questionsProgress) {
  return {
    type: Types.GET_CARDS_PROGRESS_SUCCESS,
    data: questionsProgress
  };
}

function getAllCardProgressFailure(error) {
  return {
    type: Types.GET_CARDS_PROGRESS_FAILURE,
    error: error
  };
}

function getQuestionProgressByIds(ids) {
  return {
    type: Types.GET_QUESTION_PROGRESS_BY_IDS,
    ids: ids
  };
}

function getQuestionProgressByIdsSuccess(ids, questionsProgress) {
  return {
    type: Types.GET_QUESTION_PROGRESS_BY_IDS_SUCCESS,
    data: questionsProgress,
    ids: ids
  };
}

function getQuestionProgressByIdsFailure(error) {
  return {
    type: Types.GET_QUESTION_PROGRESS_BY_IDS_FAILURE,
    error: error
  };
}