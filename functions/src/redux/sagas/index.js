"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootSaga;

var _userRate = require("./userRate");

var _stateInfo = require("./stateInfo");

var _appInfo = require("./appInfo");

var _effects = require("redux-saga/effects");

var _cardProgressSaga = require("./cardProgressSaga");

var _cardSaga = require("./cardSaga");

var _game = require("./game");

var _topicSaga = require("./topicSaga");

var _topicProgress = require("./topicProgress");

function* rootSaga() {
  yield (0, _effects.all)([..._cardProgressSaga.cardsProgressSaga, ..._topicSaga.topicsSaga, ..._cardSaga.cardsSaga, ..._game.gameSaga, ..._topicProgress.topicsProgressSaga, ..._appInfo.appInfoSaga, ..._stateInfo.stateInfoSaga, ..._userRate.userRateSaga]);
}