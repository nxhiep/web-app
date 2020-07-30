"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateInfoSaga = void 0;

var _effects = require("redux-saga/effects");

var _services = require("../../services");

var Actions = _interopRequireWildcard(require("../actions/stateInfo"));

var Types = _interopRequireWildcard(require("../actions/types"));

var _StateInfo = require("./../../models/StateInfo");

function getStateInfoAPI(appId) {
  return (0, _services.callApi)({
    url: '/data?type=get_states&appId=' + appId,
    params: null,
    method: 'post'
  });
}

function* getStateInfoSaga() {
  while (true) {
    try {
      yield* function* () {
        var action = yield (0, _effects.take)(Types.GET_STATE_INFO);
        console.log("getStateInfoSaga ", action);
        var appId = action.parentId;
        var stateInfoState = yield (0, _effects.select)(appState => appState.stateInfoState);
        var stateInfos = new Array();

        if (stateInfoState && stateInfoState.list) {
          stateInfoState.list.forEach(s => {
            s = _StateInfo.StateInfo.fromJS(s);
            stateInfos.push(s);
          });
        }

        if (stateInfos.length === 0) {
          var result = yield (0, _effects.call)(getStateInfoAPI, appId);
          result && result.forEach(s => {
            s = _StateInfo.StateInfo.fromJS(s);
            stateInfos.push(s);
          });
        } else {
          yield (0, _effects.delay)(0);
        }

        yield (0, _effects.put)(Actions.getStateInfoSuccess(stateInfos));
      }();
    } catch (e) {
      yield (0, _effects.put)(Actions.getStateInfoFailure(e));
    }
  }
}

var stateInfoSaga = [getStateInfoSaga()];
exports.stateInfoSaga = stateInfoSaga;