"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserRate = getUserRate;
exports.getUserRateSuccess = getUserRateSuccess;
exports.getUserRateFailure = getUserRateFailure;
exports.getUserRatesPerfectest = getUserRatesPerfectest;
exports.getUserRatesPerfectestSuccess = getUserRatesPerfectestSuccess;
exports.getUserRatesPerfectestFailure = getUserRatesPerfectestFailure;

var Types = _interopRequireWildcard(require("./types"));

function getUserRate(appId) {
  return {
    type: Types.GET_USER_RATES,
    appId: appId
  };
}

function getUserRateSuccess(userRates) {
  return {
    type: Types.GET_USER_RATES_SUCCESS,
    data: userRates
  };
}

function getUserRateFailure(error) {
  return {
    type: Types.GET_USER_RATES_FAILURE,
    error: error
  };
}

function getUserRatesPerfectest() {
  return {
    type: Types.GET_USER_RATES_PERFECTEST
  };
}

function getUserRatesPerfectestSuccess(userRates) {
  return {
    type: Types.GET_USER_RATES_PERFECTEST_SUCCESS,
    data: userRates
  };
}

function getUserRatesPerfectestFailure(error) {
  return {
    type: Types.GET_USER_RATES_PERFECTEST_FAILURE,
    error: error
  };
}