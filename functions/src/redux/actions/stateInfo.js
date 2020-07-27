"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCurrentStateInfo = exports.getStateInfoFailure = exports.getStateInfoSuccess = exports.getStateInfo = void 0;

var Types = _interopRequireWildcard(require("./types"));

var getStateInfo = parentId => {
  return {
    type: Types.GET_STATE_INFO,
    parentId: parentId
  };
};

exports.getStateInfo = getStateInfo;

var getStateInfoSuccess = states => {
  return {
    type: Types.GET_STATE_INFO_SUCCESS,
    data: states
  };
};

exports.getStateInfoSuccess = getStateInfoSuccess;

var getStateInfoFailure = error => {
  return {
    type: Types.GET_STATE_INFO_FAILURE,
    error: error
  };
};

exports.getStateInfoFailure = getStateInfoFailure;

var setCurrentStateInfo = stateInfo => {
  return {
    type: Types.SET_CURRENT_STATE_INFO,
    currentStateInfo: stateInfo
  };
};

exports.setCurrentStateInfo = setCurrentStateInfo;