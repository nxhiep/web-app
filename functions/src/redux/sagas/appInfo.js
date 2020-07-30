"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appInfoSaga = void 0;

var _effects = require("redux-saga/effects");

var _AppInfo = _interopRequireDefault(require("../../models/AppInfo"));

var _services = require("../../services");

var Actions = _interopRequireWildcard(require("../actions/appinfo"));

var Types = _interopRequireWildcard(require("../actions/types"));

function getAppInfo(appNameId) {
  return (0, _services.callApi)({
    url: '/data?type=get_app_info&appNameId=' + appNameId,
    params: null,
    method: 'post'
  });
}

function getAllAppInfo() {
  return (0, _services.callApi)({
    url: '/data?type=get_all_app_info',
    params: null,
    method: 'post'
  });
}

function countApps() {
  return (0, _services.callApi)({
    url: '/data?type=count_apps',
    params: null,
    method: 'post'
  });
}

function* getAppInfoSaga() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.GET_APP_INFO);
      var appNameId = action.appNameId;
      var appInfoState = yield (0, _effects.select)(appState => appState.appInfoState);
      var appInfo = void 0;

      if (appInfoState.data && appInfoState.data[appNameId]) {
        appInfo = _AppInfo.default.fromJS(appInfoState.data[appNameId]);
      }

      if (!appInfo) {
        appInfo = yield (0, _effects.call)(getAppInfo, appNameId);
      }

      if (appInfo) {
        yield (0, _effects.put)(Actions.getAppInfoSuccess([_AppInfo.default.fromJS(appInfo)]));
      } else {
        yield (0, _effects.put)(Actions.getAppInfoFailed('app info null'));
      }
    } catch (e) {
      yield (0, _effects.put)(Actions.getAppInfoFailed(e));
    }
  }
}

var MIN_APP = 19;

function* getAllAppInfoSaga() {
  while (true) {
    try {
      yield* function* () {
        yield (0, _effects.take)(Types.GET_ALL_APP_INFO);
        var appInfoState = yield (0, _effects.select)(appState => appState.appInfoState);
        var appInfos = [];

        if (appInfoState && appInfoState.list && appInfoState.list.length == MIN_APP) {
          // let numberApps = yield call(countApps);
          // if(numberApps && numberApps == appInfoState.list.length){
          appInfoState.list.forEach(app => {
            var appInfo = _AppInfo.default.fromJS(app);

            appInfos.push(appInfo);
          }); // }
        }

        if (appInfos.length == 0) {
          var apps = yield (0, _effects.call)(getAllAppInfo);
          apps && apps.forEach(app => {
            var appInfo = _AppInfo.default.fromJS(app);

            appInfos.push(appInfo);
          });
        }

        yield (0, _effects.put)(Actions.getAllAppInfoSuccess(appInfos));
      }();
    } catch (e) {
      yield (0, _effects.put)(Actions.getAllAppInfoFailed(e));
    }
  }
}

var appInfoSaga = [getAppInfoSaga(), getAllAppInfoSaga()];
exports.appInfoSaga = appInfoSaga;