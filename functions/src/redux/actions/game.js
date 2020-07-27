"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endTest = exports.updateListGame = exports.onContinue = exports.onSelectedChoice = exports.resumeGame = exports.startNewGame = exports.loadGame = exports.startNewExamTest = exports.removeLastGame = void 0;

var _config = _interopRequireDefault(require("../../config.js"));

var Types = _interopRequireWildcard(require("./types.js"));

var removeLastGame = (appId, topicId, gameType) => {
  return {
    type: Types.REMOVE_GAME,
    appId: appId,
    topicId: topicId,
    gameType: gameType
  };
};

exports.removeLastGame = removeLastGame;

var startNewExamTest = props => {
  var {
    gameType,
    topicId,
    appId,
    setting
  } = props;
  return {
    type: Types.START_NEW_TEST,
    appId: appId,
    topicId: topicId,
    gameType: gameType !== null && gameType !== void 0 ? gameType : _config.default.TEST_GAME,
    setting: setting
  };
};

exports.startNewExamTest = startNewExamTest;

var loadGame = params => {
  console.log("params", params);
  return {
    type: Types.GAME_LOAD_GAME,
    payload: params.topicId,
    appId: params.appId,
    gameType: params.gameType,
    setting: params.setting,
    questionIds: params.questionIds
  };
};

exports.loadGame = loadGame;

var startNewGame = params => {
  return {
    type: Types.START_NEW_GAME,
    payload: params.cards,
    topicId: params.topicId,
    appId: params.appId,
    gameType: params.gameType,
    setting: params.setting
  };
};

exports.startNewGame = startNewGame;

var resumeGame = (lastGame, setting) => {
  return {
    type: Types.RESUME_GAME,
    lastGame: lastGame,
    setting: setting
  };
};

exports.resumeGame = resumeGame;

var onSelectedChoice = choice => {
  return {
    type: Types.GAME_ON_CHOICE_SELECTED,
    payload: choice
  };
};

exports.onSelectedChoice = onSelectedChoice;

var onContinue = setting => {
  return {
    type: Types.GAME_ON_CONTINUE,
    setting: setting
  };
};

exports.onContinue = onContinue;

var updateListGame = (appId, topicId, game, questionProgressState) => {
  return {
    type: Types.GAME_UPDATE_LIST_GAME,
    appId: appId,
    topicId: topicId,
    payload: game,
    questionProgressState: questionProgressState
  };
};

exports.updateListGame = updateListGame;

var endTest = props => {
  return {
    type: Types.GAME_END_GAME,
    topicId: props.topicId,
    appId: props.appId,
    gameType: props.gameType,
    setting: props.setting
  };
};

exports.endTest = endTest;