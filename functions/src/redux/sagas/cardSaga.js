"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCardByParentIdForStudy = getCardByParentIdForStudy;
exports.getCardForTest = getCardForTest;
exports.getCardsByIdsAPI = getCardsByIdsAPI;
exports.cardsSaga = void 0;

var _effects = require("redux-saga/effects");

var _config = _interopRequireDefault(require("../../config"));

var _QuestionX = _interopRequireDefault(require("../../models/QuestionX"));

var _services = require("../../services");

var Actions = _interopRequireWildcard(require("../actions/card"));

var _types = require("../actions/types");

function getCardsByIdsSagaApi(ids) {
  return (0, _services.callApi)({
    url: '/data?type=get_cards_by_ids&ids=' + ids.toString(),
    params: null,
    method: 'post'
  });
}

function getCardByParentIdForStudy(topicId) {
  return (0, _services.callApi)({
    method: 'post',
    url: '/data?type=get_cards_by_parent_id&parentId=' + topicId,
    params: {}
  });
}

function getCardForTest(testsetting) {
  // 6225635760406528
  console.log("getCardForTest ", testsetting);
  return (0, _services.callApi)({
    url: _config.default.API_GET_CARDS_FOR_TEST_SETTING,
    params: Object.assign({}, testsetting.toJS()),
    method: "POST"
  });
}

function getCardsByParentIdSagaApi(parentId) {
  return (0, _services.callApi)({
    url: '/data?type=get_cards&id=' + parentId,
    params: null,
    method: 'post'
  });
}

function* getCardsByParentIdSaga() {
  try {
    var action = yield (0, _effects.take)(_types.GET_CARDS_BY_PARENT_ID);
    var data = yield (0, _effects.call)(getCardsByParentIdSagaApi, action.params);
    var cards = new Array();

    if (data) {
      data.forEach(card => cards.push(new _QuestionX.default(card)));
    }

    yield (0, _effects.put)(Actions.getCardsByParentIdSuccess(cards));
  } catch (e) {
    yield (0, _effects.put)(Actions.getCardsByParentIdFailure(e));
  }
}

function* getCardsByIdsAPI(cardIds) {
  var _a;

  var questionState = yield (0, _effects.select)(state => state.cardReducer);
  var cards = new Array();
  var cardMissIds = [];
  console.log("questionState ", questionState);

  if (questionState) {
    var mapCard = (_a = questionState.data) !== null && _a !== void 0 ? _a : {};
    cardIds.forEach(cardId => {
      if (mapCard[cardId]) {
        var card = _QuestionX.default.fromJs(mapCard[cardId]);

        cards.push(card);
      } else {
        cardMissIds.push(cardId);
      }
    });
  }

  console.log("cardMissIds ", cardMissIds);

  if (cardMissIds.length > 0) {
    var data = yield (0, _effects.call)(getCardsByIdsSagaApi, cardMissIds);

    if (data) {
      data.forEach(card => cards.push(_QuestionX.default.fromJs(card)));
    }
  }

  return cards;
}

function* getCardsByIdsSaga() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(_types.GET_CARDS_BY_IDS);
      var cards = yield (0, _effects.call)(getCardsByIdsAPI, action.params);
      yield (0, _effects.put)(Actions.getCardsByIdsSuccess(cards));
    } catch (e) {
      yield (0, _effects.put)(Actions.getCardsByIdsFailure(e));
    }
  }
}

var cardsSaga = [getCardsByIdsSaga(), getCardsByParentIdSaga()];
exports.cardsSaga = cardsSaga;