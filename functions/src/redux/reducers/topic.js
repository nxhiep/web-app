"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Topic = _interopRequireDefault(require("../../models/Topic"));

var Types = _interopRequireWildcard(require("../actions/types"));

var _utils = require("../../utils");

// import { REHYDRATE } from 'redux-persist';
var InitialTopisState = {
  loading: false,
  data: {},
  list: [],
  error: null
};

var topicReducer = function topicReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialTopisState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a; // console.log("topicReducer FFFFFFFFFFFFFFFFFFF ", state, action);


  var mapTopic = (_a = state.data) !== null && _a !== void 0 ? _a : {};

  switch (action.type) {
    // case REHYDRATE: {
    //     // console.log("topicReducer REHYDRATE gggggggg", Object.assign({}, action.payload));
    //     if (action.payload && action.payload['topicReducer']) {
    //         let list = action.payload['topicReducer']['list'];
    //         // console.log("topicReducer ffffffff", Object.assign({}, list));
    //         if (list) {
    //             list.forEach((t) => {
    //                 let topic = Topic.fromJS(t);
    //                 mapTopic[topic.id] = topic;
    //             });
    //             state.loading = true;
    //             state.data = mapTopic;
    //             state.list = list;
    //         }
    //     }
    // return Object.assign({}, state);
    // }
    case Types.GET_TOPICS_BY_PARENT_ID:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_TOPICS_BY_PARENT_ID_SUCCESS:
      {
        action.data && action.data.forEach(t => {
          var topic = _Topic.default.fromJS(t);

          if (!mapTopic[topic.id]) {
            state.list.push(topic);
          } else {
            (0, _utils.replaceItem)(state.list, 'id', topic);
          }

          mapTopic[topic.id] = topic;
        });
        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapTopic,
          error: null
        });
      }

    case Types.GET_TOPICS_BY_PARENT_ID_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.GET_TOPIC_BY_ID:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_TOPIC_BY_ID_SUCCESS:
      {
        var topic = action.data;

        if (topic) {
          if (!mapTopic[topic.id]) {
            state.list.push(topic);
          } else {
            (0, _utils.replaceItem)(state.list, 'id', topic);
          }

          mapTopic[topic.id] = topic;
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapTopic,
          error: null
        });
      }

    case Types.GET_TOPIC_BY_ID_FAILURE:
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

var _default = topicReducer;
exports.default = _default;