"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppInfo = getAppInfo;
exports.getAppInfoSuccess = getAppInfoSuccess;
exports.getAppInfoFailed = getAppInfoFailed;
exports.getAllAppInfo = getAllAppInfo;
exports.getAllAppInfoSuccess = getAllAppInfoSuccess;
exports.getAllAppInfoFailed = getAllAppInfoFailed;

var Types = _interopRequireWildcard(require("./types"));

function getAppInfo(appNameId) {
  return {
    type: Types.GET_APP_INFO,
    appNameId: appNameId
  };
}

function getAppInfoSuccess(appInfos) {
  return {
    type: Types.GET_APP_INFO_SUCCESS,
    data: appInfos
  };
}

function getAppInfoFailed(error) {
  return {
    type: Types.GET_APP_INFO_FAILURE,
    error: error
  };
}

function getAllAppInfo() {
  return {
    type: Types.GET_ALL_APP_INFO
  };
}

function getAllAppInfoSuccess(appInfos) {
  return {
    type: Types.GET_ALL_APP_INFO_SUCCESS,
    data: appInfos
  };
}

function getAllAppInfoFailed(error) {
  return {
    type: Types.GET_ALL_APP_INFO_FAILURE,
    error: error
  };
}