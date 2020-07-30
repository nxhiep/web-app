"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var _TopicProgress = _interopRequireDefault(require("../../models/TopicProgress"));

var _utils = require("../../utils");

var Types = _interopRequireWildcard(require("../actions/types"));

var InitialTopisState = {
  loading: false,
  data: {},
  list: [],
  error: null
};

var topicProgressReducer = function topicProgressReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialTopisState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a, _b;

  var mapProgress = (_a = state.data) !== null && _a !== void 0 ? _a : {}; // let listProgress: Array<TopicProgress> = state.data ?? [];

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        // console.log("topicProgressReducer REHYDRATE", state, " ---- action", action);
        if (action.payload && action.payload['topicProgressReducer']) {
          var list = action.payload['topicProgressReducer']['list']; // console.log("ftopicProgressReducer fffffff", data);

          if (list) {
            list.forEach(p => {
              var progress = _TopicProgress.default.fromJS(p);

              mapProgress[progress.topicId] = progress;
              state.list.push(progress);
            });
            state.list = list;
            state.data = mapProgress;
          }
        }

        return Object.assign({}, state);
      }

    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_SUCCESS:
      {
        if (action.data) {
          action.data.forEach(p => {
            var progress = _TopicProgress.default.fromJS(p);

            if (!mapProgress[progress.topicId]) {
              state.list.push(progress);
            } else {
              (0, _utils.replaceItem)(state.list, 'id', progress);
            }

            mapProgress[progress.topicId] = progress;
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapProgress,
          error: null
        });
      }

    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.UPDATE_TOPICS_PROGRESS:
      {
        // console.log("UPDATE_TOPICS_PROGRESS action", action, 'state', state);
        return Object.assign(Object.assign({}, state), {
          data: mapProgress,
          error: null
        });
      }

    case Types.UPDATE_TOPICS_PROGRESS_SUCCESS:
      {
        // console.log("updating progress", Object.assign({}, mapProgress));
        if (action.data) {
          action.data.forEach(p => {
            var progress = _TopicProgress.default.fromJS(p);

            if (!mapProgress[progress.topicId]) {
              state.list.push(progress);
            } else {
              // console.log("GGGGGGGGG ITEM ", progress);
              (0, _utils.replaceItem)(state.list, 'id', progress); // state.list = state.list.filter((item) => item.id != progress.id);
              // state.list.push(progress);
            }

            mapProgress[progress.topicId] = progress; // console.log("updated progress", Object.assign({}, mapProgress), 111, progress.topicId, progress);
          });
        }

        return Object.assign(Object.assign({}, state), {
          data: mapProgress,
          error: null
        });
      }

    case Types.CALCULAR_TOPICS_PROGRESS:
      {
        var topic = action.topic;
        var progress = action.progress;

        if (topic && progress) {
          var topicId = (_b = topic.id) !== null && _b !== void 0 ? _b : -1;
          var topicProgress = mapProgress[topicId];
          console.log("calc topic progress from game progress", topicProgress);

          if (topicProgress) {
            topicProgress.notSeen = progress.getNotSeenNumber();
            topicProgress.familiar = progress.getFamiliarNumber();
            topicProgress.mastered = progress.getMasteredNumber();
            mapProgress[topicId] = topicProgress;
            topic.progress = topicProgress;
            (0, _utils.replaceItem)(state.list, 'id', topic.progress);
          }

          console.log("XXXXXXXX ", state);
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapProgress,
          error: null
        });
      }

    case Types.CALCULAR_PARENT_TOPICS_PROGRESS:
      {
        // let childTopic: Topic = action.topic;
        // let parentTopic: Topic = action.parentTopic;
        //TODO:
        return state;
      }

    case Types.RESET_TOPIC_PROGRESS:
      {
        var _topicProgress = action.topicProgress;

        if (_topicProgress) {
          _topicProgress = _TopicProgress.default.fromJS(_topicProgress);

          _topicProgress.reset();

          mapProgress[_topicProgress.topicId] = _topicProgress;
          (0, _utils.replaceItem)(state.list, 'id', _topicProgress);
        }

        return Object.assign(Object.assign({}, state), {
          data: mapProgress
        });
      }

    default:
      return state;
  }
};

var _default = topicProgressReducer;
exports.default = _default;