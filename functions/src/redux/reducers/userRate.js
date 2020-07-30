"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var _UserRate = _interopRequireDefault(require("../../models/UserRate"));

var Types = _interopRequireWildcard(require("../actions"));

var _utils = require("../../utils");

var initState = {
  loading: false,
  data: {},
  list: [],
  perfectest: [],
  error: null
};

var userRateState = function userRateState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a, _b;

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        if (action.payload) {
          var list = (_a = action.payload.userRateState) === null || _a === void 0 ? void 0 : _a.list;
          var perfectests = (_b = action.payload.userRateState) === null || _b === void 0 ? void 0 : _b.perfectest;

          if (perfectests) {
            var listPerfect = [];
            perfectests.forEach(info => {
              var userRate = _UserRate.default.fromJS(info);

              listPerfect.push(userRate);
            });
            state.perfectest = listPerfect;
          }

          if (list) {
            var map = {};
            list.forEach(info => {
              var userRate = _UserRate.default.fromJS(info);

              if (!map[userRate.appId]) {
                map[userRate.appId] = [];
              }

              map[userRate.appId].push(userRate);
            });
            state.list = list;
            state.data = map;
          }
        }

        return Object.assign({}, state);
      }

    case Types.GET_USER_RATES:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true,
          error: null
        });
      }

    case Types.GET_USER_RATES_SUCCESS:
      {
        var _map = {};

        if (action.data) {
          action.data.forEach(u => {
            var userRate = _UserRate.default.fromJS(u);

            (0, _utils.replaceItem)(state.list, 'id', userRate);

            if (!_map[userRate.appId]) {
              _map[userRate.appId] = [];
            }

            _map[userRate.appId].push(userRate);
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: _map,
          error: null
        });
      }

    case Types.GET_USER_RATES_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.GET_USER_RATES_PERFECTEST:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true,
          error: null
        });
      }

    case Types.GET_USER_RATES_PERFECTEST_SUCCESS:
      {
        if (action.data) {
          state.perfectest = action.data;
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: null
        });
      }

    case Types.GET_USER_RATES_PERFECTEST_FAILURE:
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

var _default = userRateState;
exports.default = _default;