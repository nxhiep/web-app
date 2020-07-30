"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCardsByParentId = getCardsByParentId;
exports.getCardsByParentIdSuccess = getCardsByParentIdSuccess;
exports.getCardsByParentIdFailure = getCardsByParentIdFailure;
exports.getCardsByIds = getCardsByIds;
exports.getCardsByIdsSuccess = getCardsByIdsSuccess;
exports.getCardsByIdsFailure = getCardsByIdsFailure;

var Types = _interopRequireWildcard(require("./types"));

function getCardsByParentId(parentId) {
  return {
    type: Types.GET_CARDS_BY_PARENT_ID,
    parentId: parentId
  };
}

function getCardsByParentIdSuccess(cards) {
  return {
    type: Types.GET_CARDS_BY_PARENT_ID_SUCCESS,
    data: cards
  };
}

function getCardsByParentIdFailure(error) {
  return {
    type: Types.GET_CARDS_BY_PARENT_ID_FAILURE,
    error: error
  };
}

function getCardsByIds(ids) {
  return {
    type: Types.GET_CARDS_BY_IDS,
    cardIds: ids
  };
}

function getCardsByIdsSuccess(cards) {
  return {
    type: Types.GET_CARDS_BY_IDS_SUCCESS,
    data: cards
  };
}

function getCardsByIdsFailure(error) {
  return {
    type: Types.GET_CARDS_BY_IDS_FAILURE,
    error: error
  };
}