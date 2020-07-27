"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ListGamesState = void 0;

var _reduxPersist = require("redux-persist");

var _config = _interopRequireDefault(require("../../config.js"));

var Types = _interopRequireWildcard(require("../actions/types.js"));

var _game = require("./game");

class ListGamesState {
  constructor(props) {
    this.listGames = new Map();
    this.games = new Array();

    if (props) {
      for (var i = 0; i < props.games.length; i++) {
        var element = props.games[i];

        var xxx = _game.GameState.cloneGameState(element);

        this.games.push(xxx);
      }
    }
  }

  static init() {
    return new ListGamesState();
  }

  static updateListGame(beforeState, topicId, gameState) {
    var _a, _b;

    var currentListGame = (_a = beforeState.listGames.get(topicId)) !== null && _a !== void 0 ? _a : new Array();
    currentListGame = (_b = currentListGame.filter(item => item.id !== gameState.id)) !== null && _b !== void 0 ? _b : [];
    currentListGame.push(gameState);
    beforeState.listGames.set(topicId, currentListGame);
    return beforeState;
  }

  static removeGame(beforeState, topicId) {
    // let currentListGame: Array<GameState> = this.listGames.get(examId) ?? new Array<GameState>();
    // currentListGame = currentListGame.filter((item: GameState) => item.topicId !== gameState.topicId) ?? [];
    // this.listGames.set(examId, currentListGame);
    // remove for test
    beforeState.listGames.delete(topicId);
    return beforeState;
  }

}

exports.ListGamesState = ListGamesState;

var listGamesReducer = function listGamesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ListGamesState.init();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a;

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      if (action.payload) {
        var localList = action.payload['listGameState'];
        return new ListGamesState(localList);
      } else return state;

    case Types.GAME_UPDATE_LIST_GAME:
      var gameReducer = action.payload;
      var temp = new ListGamesState(state);

      if (gameReducer.gameType !== _config.default.REVIEW_GAME) {
        var topicIdx = action.topicId;
        temp = ListGamesState.updateListGame(temp, topicIdx, gameReducer);
        temp.games = temp.games.filter(item => item.id != gameReducer.id);
        temp.games.push(gameReducer);

        if (gameReducer.gameType === _config.default.STUDY_GAME) {
          if (action.questionProgressState) {
            var questionProgressState = action.questionProgressState;

            if (!questionProgressState.data) {
              questionProgressState.data = {};
            } // console.log("3434343434343434343434343433433434343", gameReducer.currentQuestion, 'questionProgressState', questionProgressState)


            if (gameReducer.currentQuestion) {
              questionProgressState.data[gameReducer.currentQuestion.id] = (_a = gameReducer.currentQuestion) === null || _a === void 0 ? void 0 : _a.progress;
            }
          }
        }
      } // state.listGames.set(examIdx,[gameReducer]);


      return temp;

    case Types.REMOVE_GAME:
      var topicId = action.topicId;
      var gameType = action.gameType;
      state.games = state.games.filter(item => item.id != topicId && item.gameType != gameType);
      return state;

    default:
      return state;
  }
};

var _default = listGamesReducer;
exports.default = _default;