"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var _AppInfo = _interopRequireDefault(require("../../models/AppInfo"));

var _utils = require("../../utils");

var Types = _interopRequireWildcard(require("../actions"));

var initState = {
  loading: false,
  data: {},
  list: [],
  error: null
};

var appValueState = function appValueState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a, _b, _c;

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        if (action.payload) {
          var list = (_a = action.payload.appInfoState) === null || _a === void 0 ? void 0 : _a.list;

          if (list) {
            var map = {};
            list.forEach(info => {
              var appInfo = _AppInfo.default.fromJS(info);

              map[appInfo.appNameId] = appInfo;
            });
            state.list = list;
            state.data = map;
          }
        }

        return Object.assign({}, state);
      }

    case Types.GET_APP_INFO:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_APP_INFO_SUCCESS:
      {
        var _map = (_b = state.data) !== null && _b !== void 0 ? _b : {};

        if (action.data) {
          action.data.forEach(info => {
            var appInfo = _AppInfo.default.fromJS(info);

            if (!_map[appInfo.appNameId]) {
              state.list.push(appInfo);
            } else {
              (0, _utils.replaceItem)(state.list, 'appNameId', appInfo);
            }

            _map[appInfo.appNameId] = appInfo;
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: _map,
          error: null
        });
      }

    case Types.GET_APP_INFO_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.GET_ALL_APP_INFO:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_ALL_APP_INFO_SUCCESS:
      {
        var _map2 = (_c = state.data) !== null && _c !== void 0 ? _c : {};

        if (action.data) {
          action.data.forEach(info => {
            var appInfo = _AppInfo.default.fromJS(info);

            _map2[appInfo.appNameId] = appInfo;
            (0, _utils.replaceItem)(state.list, 'appNameId', appInfo);
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: _map2,
          error: null
        });
      }

    case Types.GET_ALL_APP_INFO_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    default:
      return state;
  }
};

var _default = appValueState;
exports.default = _default;