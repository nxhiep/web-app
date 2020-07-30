"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topicsProgressSaga = void 0;

var _effects = require("redux-saga/effects");

var _config = _interopRequireDefault(require("../../config"));

var _TopicProgress = _interopRequireDefault(require("../../models/TopicProgress"));

var _services = require("../../services");

var Actions = _interopRequireWildcard(require("../actions/topicProgress"));

var Types = _interopRequireWildcard(require("../actions/types"));

var _cardProgress = require("./../actions/cardProgress");

function getTopicsProgressByIds(ids) {
  return (0, _services.callApi)({
    url: '/gettopicprogress',
    method: 'post',
    params: ids
  });
}

function* getTopicsProgressSaga() {
  var _a;

  try {
    var action = yield (0, _effects.take)(Types.GET_QUESTION_PROGRESS_BY_IDS);
    var topicsProgressState = yield (0, _effects.select)(state => state.topicProgressReducer);
    var listProgress = new Array();

    if (topicsProgressState && topicsProgressState.data) {
      var ids = (_a = action.params) !== null && _a !== void 0 ? _a : [];
      ids.forEach(function (topicId) {
        if (topicsProgressState.data[topicId]) {
          listProgress.push(_TopicProgress.default.fromJS(topicsProgressState.data[topicId]));
        } else {
          listProgress.push(_TopicProgress.default.init(topicId, _config.default.USER_ID));
        }
      });
    } else {// let data = yield call(getTopicsProgressByIds, action.params); // TODO
      // if(data){
      //     data.forEach((element: any) => listProgress.push(TopicProgress.fromJS(element)));
      // }
    }

    yield (0, _effects.put)(Actions.getTopicsProgressByTopicIdsSuccess(listProgress));
  } catch (e) {
    yield (0, _effects.put)(Actions.getTopicsProgressByTopicIdsFailure(e));
  }
}

function updateTopicsProgressApi(listProgress) {
  return (0, _services.callApi)({
    url: '/update',
    method: 'post',
    params: listProgress
  });
}

function* updateTopicsProgress() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.UPDATE_TOPICS_PROGRESS); // console.log("updateTopicsProgress cxxxxxxxxxxx ", action);
      // console.log("1111111111111", Object.assign({}, action));
      // let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
      // console.log("2222222222222", Object.assign({}, topicState));

      if (action.data && action.data.length > 0) {
        // TODO: yield call(updateTopicsProgressApi, action.data);
        yield (0, _effects.put)(Actions.updateTopicsProgressSuccess(action.data));
      }
    } catch (e) {// yield put(Actions.updateTopicsProgressFailure(e));
    }
  }
}

function* resetTopicProgress() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.RESET_TOPIC_PROGRESS);
      var topicId = action ? action.topicProgress ? action.topicProgress.topicId : -1 : -1;

      if (topicId > -1) {
        yield (0, _effects.put)((0, _cardProgress.resetCardInTopic)(topicId));
      }
    } catch (e) {}
  }
}

var topicsProgressSaga = [getTopicsProgressSaga(), updateTopicsProgress(), resetTopicProgress()];
exports.topicsProgressSaga = topicsProgressSaga;