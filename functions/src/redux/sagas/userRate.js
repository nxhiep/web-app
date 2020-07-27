"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRateSaga = void 0;

var _effects = require("redux-saga/effects");

var _UserRate = _interopRequireDefault(require("../../models/UserRate"));

var _services = require("../../services");

var Types = _interopRequireWildcard(require("../actions/types"));

var Actions = _interopRequireWildcard(require("../actions/userRate"));

function getUserRatesPerfectestAPI() {
  return (0, _services.callApi)({
    url: '/data?type=get_user_rates_perfectest',
    params: null,
    method: 'post'
  });
}

function getUserRatesAPI(appId) {
  return (0, _services.callApi)({
    url: '/data?type=get_user_rates&appId=' + appId,
    params: null,
    method: 'post'
  });
}

function* getUserRatesPerfectestSaga() {
  while (true) {
    try {
      yield* function* () {
        yield (0, _effects.take)(Types.GET_USER_RATES_PERFECTEST);
        var userRateState = yield (0, _effects.select)(appState => appState.userRateState);
        var userRates = new Array();

        if (userRateState && userRateState.perfectest) {
          userRates = userRateState.perfectest.map(u => _UserRate.default.fromJS(u));
        }

        if (!userRates || userRates.length === 0) {
          var result = yield (0, _effects.call)(getUserRatesPerfectestAPI);
          result && result.forEach(s => {
            s = _UserRate.default.fromJS(s);
            userRates.push(s);
          });
        }

        yield (0, _effects.put)(Actions.getUserRatesPerfectestSuccess(userRates));
      }();
    } catch (e) {
      yield (0, _effects.put)(Actions.getUserRatesPerfectestFailure(e));
    }
  }
}

function* getUserRatesSaga() {
  while (true) {
    try {
      yield* function* () {
        var action = yield (0, _effects.take)(Types.GET_USER_RATES);
        var appId = action.appId;
        var userRateState = yield (0, _effects.select)(appState => appState.userRateState);
        var userRates = new Array();
        console.log("userRateState", userRateState, 'appId', appId);

        if (userRateState && userRateState.data && userRateState.data[appId]) {
          userRates = userRateState.data[appId].map(u => _UserRate.default.fromJS(u));
        }

        console.log("userRates", userRates);

        if (!userRates || userRates.length === 0) {
          var result = yield (0, _effects.call)(getUserRatesAPI, appId);
          result && result.forEach(s => {
            s = _UserRate.default.fromJS(s);
            userRates.push(s);
          });
        }

        yield (0, _effects.put)(Actions.getUserRateSuccess(userRates));
      }();
    } catch (e) {
      yield (0, _effects.put)(Actions.getUserRateFailure(e));
    }
  }
}

var userRateSaga = [getUserRatesSaga(), getUserRatesPerfectestSaga()];
exports.userRateSaga = userRateSaga;