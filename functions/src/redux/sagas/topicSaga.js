"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topicsSaga = void 0;

var _effects = require("redux-saga/effects");

var _config = _interopRequireDefault(require("../../config"));

var _Topic = _interopRequireDefault(require("../../models/Topic"));

var _TopicProgress = _interopRequireDefault(require("../../models/TopicProgress"));

var _services = require("../../services");

var Actions = _interopRequireWildcard(require("../actions/topic"));

var Types = _interopRequireWildcard(require("../actions/types"));

var _topicProgress = require("./../actions/topicProgress");

function getTopicsSagaApi(parentId) {
  return (0, _services.callApi)({
    method: 'post',
    url: '/data?type=get_topics_by_parent_id&parentId=' + parentId,
    params: null
  });
}

function getTopicByIdSagaApi(id) {
  return (0, _services.callApi)({
    method: 'post',
    url: '/data?type=get_topics_by_ids&ids=' + id,
    params: null
  });
}

function* getTopicByIdAPI(id) {
  var topicState = yield (0, _effects.select)(state => state.topicReducer);
  var topic;

  if (topicState && topicState.data) {
    var _topic = topicState.data[id];

    if (_topic) {
      _topic = _Topic.default.fromJS(_topic);
    }

    if (!_topic) {
      console.log("loading topic by ids ", id);
      var topics = yield (0, _effects.call)(getTopicByIdSagaApi, id);
      console.log("load topic by ids ", topics);

      if (topics && topics.length > 0) {
        _topic = topics[0];
      }
    }
  }

  return topic;
}

function* getTopicsByParentIdAPI(parentId) {
  var topicState = yield (0, _effects.select)(state => state.topicReducer);
  var topics = new Array();

  if (topicState && topicState.list) {
    topicState.list.forEach(t => {
      if (t.parentId === parentId) {
        var topic = _Topic.default.fromJS(t);

        topics.push(topic);
      }
    });

    if (topics.length === 0) {
      topics = yield (0, _effects.call)(getTopicsSagaApi, parentId);
    }
  }

  return topics.filter(t => t.status > -1);
}

function* getTopicsSaga() {
  var _a;

  while (true) {
    var action = yield (0, _effects.take)(Types.GET_TOPICS_BY_PARENT_ID); // console.log("getTopicsSaga GET_TOPICS_BY_PARENT_ID ", action)

    try {
      yield* function* () {
        var data = yield (0, _effects.call)(getTopicsByParentIdAPI, action.params);
        var topicProgressState = yield (0, _effects.select)(state => state.topicProgressReducer);
        var topicState = yield (0, _effects.select)(state => state.topicReducer);
        var mapProgress = topicProgressState ? (_a = topicProgressState.data) !== null && _a !== void 0 ? _a : {} : {}; // console.log("topicProgressState topicProgressState topicProgressState ", topicProgressState);

        var topics = new Array(); // console.log("getTopicsSaga topics ", topics);

        var listTopicProgress = [];
        var mapParentTopic = {}; // Map<topicParentId, Array<Topic>>

        if (topicState && topicState.data) {
          // console.log("that khong the tin noi ", topicState);
          Object.values(topicState.data).forEach(t => {
            var topic = _Topic.default.fromJS(t); // console.log("wtf 1111111 topic ", topic.parentId, topic.name, ' = ', topic.getPercentComplete());


            if (!mapParentTopic[topic.parentId]) {
              mapParentTopic[topic.parentId] = new Array();
            }

            mapParentTopic[topic.parentId].push(topic);
          });
        } // console.log("mapParentTopic.ddddddddddddddd", mapParentTopic);


        data.sort((a, b) => a.orderIndex - b.orderIndex).forEach(topicData => {
          // console.log("getTopicsSaga topicData ", topicData, Topic.getArguments());
          var topic = new _Topic.default(topicData);

          if (topic.status > -1) {
            var topicProgress = mapProgress[topic.id];

            if (topicProgress) {
              topic.progress = _TopicProgress.default.fromJS(topicProgress);
            } else {
              topic.progress = _TopicProgress.default.init(topic.id, _config.default.USER_ID);
              listTopicProgress.push(topic.progress);
            }

            if (Object.keys(mapParentTopic).length > 0) {
              var count = 0;
              var arr = mapParentTopic[topic.id];

              if (arr && arr.length > 0) {
                arr.forEach(childTopic => {
                  count += childTopic.getPercentComplete();
                });
                topic.progress.progress = Math.round(count / (arr.length * 100) * 100);
              }
            }

            topics.push(topic);
          }
        }); // console.log("getTopicsSaga topics ", topics, 'listTopicProgress', listTopicProgress);

        yield (0, _effects.put)(Actions.getTopicsByParentIdSuccess(action.params, topics));

        if (listTopicProgress.length > 0) {
          yield (0, _effects.put)((0, _topicProgress.getTopicsProgressByTopicIdsSuccess)(listTopicProgress));
        }
      }();
    } catch (e) {
      // console.log("getTopicsByParentIdFailure ", e)
      yield (0, _effects.put)(Actions.getTopicsByParentIdFailure(action.params, e));
    }
  }
}

function* getTopicByIdSaga() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.GET_TOPIC_BY_ID);
      var topic = getTopicByIdAPI(action.params);

      if (topic) {
        yield (0, _effects.put)(Actions.getTopicByIdSuccess(topic));
      } else {
        yield (0, _effects.put)(Actions.getTopicByIdFailure(action.params, 'topic null'));
      }
    } catch (e) {
      yield (0, _effects.put)(Actions.getTopicByIdFailure(-1, e));
    }
  }
}

var topicsSaga = [getTopicsSaga(), getTopicByIdSaga()];
exports.topicsSaga = topicsSaga;