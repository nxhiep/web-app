"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var _StateInfo = require("../../models/StateInfo");

var Types = _interopRequireWildcard(require("../actions"));

var _utils = require("../../utils");

var InitialStateInfo = {
  loading: false,
  data: {},
  list: [],
  error: null,
  listCurrentState: [],
  mapCurrentStateInfo: {}
};

var stateInfoState = function stateInfoState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialStateInfo;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a;

  var mapStateInfo = (_a = state.data) !== null && _a !== void 0 ? _a : {};

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        if (action.payload && action.payload['stateInfoState']) {
          var list = action.payload['stateInfoState']['list'];
          var listCurrentState = action.payload['stateInfoState']['listCurrentState'];

          if (listCurrentState) {
            listCurrentState.forEach(s => {
              var stateInfo = _StateInfo.StateInfo.fromJS(s);

              state.mapCurrentStateInfo[stateInfo.parentId] = stateInfo;
            });
            state.listCurrentState = listCurrentState;
          }

          if (list) {
            list.forEach(t => {
              var stateInfo = _StateInfo.StateInfo.fromJS(t);

              mapStateInfo[stateInfo.id] = stateInfo;
            });
            state.data = mapStateInfo;
          }
        }

        return Object.assign({}, state);
      }

    case Types.GET_STATE_INFO:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_STATE_INFO_SUCCESS:
      {
        if (action.data) {
          action.data.forEach(s => {
            s = _StateInfo.StateInfo.fromJS(s);

            if (!mapStateInfo[s.id]) {
              state.list.push(s);
            } else {
              (0, _utils.replaceItem)(state.list, 'id', s);
            }

            mapStateInfo[s.id] = s;
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapStateInfo,
          error: null
        });
      }

    case Types.SET_CURRENT_STATE_INFO:
      {
        if (action.currentStateInfo) {
          var s = _StateInfo.StateInfo.fromJS(action.currentStateInfo);

          if (state.mapCurrentStateInfo[s.parentId]) {
            (0, _utils.replaceItem)(state.listCurrentState, 'id', s);
          } else {
            state.listCurrentState.push(s);
          }

          state.mapCurrentStateInfo[s.parentId] = s;
        }

        return Object.assign({}, state);
      }

    case Types.GET_STATE_INFO_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    default:
      return Object.assign({}, state);
  }
};

var _default = stateInfoState;
exports.default = _default;