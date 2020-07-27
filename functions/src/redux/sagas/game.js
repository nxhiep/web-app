"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gameSaga = void 0;

var _effects = require("redux-saga/effects");

var _config = _interopRequireDefault(require("../../config.js"));

var _TestSetting = _interopRequireDefault(require("../../models/TestSetting"));

var _actions = require("../actions");

var _game = require("../actions/game");

var Types = _interopRequireWildcard(require("../actions/types.js"));

var _topicProgress = require("./../actions/topicProgress");

var CARD_PROGRESS_API = _interopRequireWildcard(require("./cardProgressSaga"));

var CARD_API = _interopRequireWildcard(require("./cardSaga"));

// 5067401930473472
function* forceStartNewGame() {
  // console.log("start new test with setting");
  while (true) {
    var action = yield (0, _effects.take)(Types.START_NEW_TEST);
    var appId = action.appId;
    var topicId = action.topicId;
    var gameType = action.gameType;
    var setting = action.setting;
    var questionIds = action.questionIds;
    console.log("forceStartNewGame setting ", setting); // REMOVE LAST GAME  

    if (setting) {
      yield (0, _effects.put)((0, _actions.saveNewTestSetting)({
        appId: appId,
        setting: setting,
        topicId: topicId
      }));
    }

    console.log("removeLastGame appId", appId, 'topicId', topicId, 'gameType', gameType);
    yield (0, _effects.put)((0, _game.removeLastGame)(appId, topicId, gameType)); // RERUN ACTION GAME_LOAD_GAME

    console.log("loadGame appId", appId, 'topicId', topicId, 'gameType', gameType);
    yield (0, _effects.put)((0, _game.loadGame)({
      appId: appId,
      topicId: topicId,
      gameType: gameType,
      setting: setting,
      questionIds: questionIds
    }));
  }
}

function* startGameReload() {
  while (true) {
    yield startGame();
  }
}

function* startGame() {
  // le  t action2 = yield take(REHYDRATE);
  // console.log("REHYDRATE", action2);
  var action = yield (0, _effects.take)(Types.GAME_LOAD_GAME);
  console.log("GAME_LOAD_GAME ------------ ", action);
  var topicId = action.payload;
  var appId = action.appId;
  var gameType = action.gameType;
  var testSetting;

  if (action.setting) {
    // console.log("vllll", setting);
    testSetting = _TestSetting.default.fromJS(action.setting);
  } else {
    testSetting = new _TestSetting.default(yield (0, _effects.select)(state => {
      return state.testSettingState.currentSetting;
    }));
  }

  var questionIds = action.questionIds;
  var currentGame;

  if (gameType === _config.default.STUDY_GAME || gameType === _config.default.REVIEW_GAME) {
    // Game for study
    console.log('game for study', {
      appId,
      topicId,
      gameType
    });
    currentGame = yield (0, _effects.select)(state => {
      var games = state.listGameState.games;
      return games.find(item => item.id == topicId && item.gameType == gameType);
    });
  } else {
    // Game for test
    currentGame = yield (0, _effects.select)(state => {
      var games = state.listGameState.games;
      return games.find(item => item.id == topicId && item.gameType == _config.default.TEST_GAME);
    });
  }

  console.log("CCCCCCCCCCCCCCCCCCCCCCCC current Game ", currentGame, 'action', action, 'questionIds', questionIds);

  if (currentGame == null || currentGame == undefined) {
    // todo : start new game
    if (gameType === _config.default.STUDY_GAME || gameType === _config.default.REVIEW_GAME) {
      // Start new game for study
      var cards;

      if (questionIds && questionIds.length > 0) {
        cards = yield (0, _effects.call)(CARD_API.getCardsByIdsAPI, questionIds);
      } else {
        cards = yield (0, _effects.call)(CARD_API.getCardByParentIdForStudy, topicId);
      }

      yield (0, _effects.put)((0, _actions.getCardsByIdsSuccess)(cards));
      yield CARD_PROGRESS_API.getQuestionsProgress(cards); // console.log("loaded question", cards);

      yield (0, _effects.put)((0, _game.startNewGame)({
        appId: appId,
        topicId: topicId,
        cards: cards,
        gameType: gameType
      }));
    } else {
      // start new game for test
      // console.log("SETTINGGGGG", testSetting);
      var _cards = yield (0, _effects.call)(CARD_API.getCardForTest, testSetting);

      yield (0, _effects.put)((0, _actions.getCardsByIdsSuccess)(_cards));
      yield CARD_PROGRESS_API.getQuestionsProgress(_cards); // console.log("Cards: ", cards);
      // const cards = fakeCards;

      yield (0, _effects.put)((0, _game.startNewGame)({
        appId: appId,
        topicId: topicId,
        cards: _cards,
        gameType: gameType,
        setting: testSetting
      }));
    } // const responseCards = yield call(getCardByIdExamApi, examId);
    // if (responseCards.status === 1 && responseCards.data) {
    //     yield put(startNewGame({ examId, cards: responseCards.data }));
    // } 

  } else {
    // todo : resume game
    // console.log("RESUMEEEEEEEEEEEEE")
    yield (0, _effects.put)((0, _game.resumeGame)(currentGame, testSetting));
  }
}

function* onSaveGame() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.START_NEW_GAME);
      var gameState = yield (0, _effects.select)(state => state.gameState);
      yield (0, _effects.put)((0, _game.updateListGame)(action.appId, action.topicId, gameState));
    } catch (error) {}
  }
}

function* onContinue() {
  while (true) {
    try {
      yield (0, _effects.take)(Types.GAME_ON_CONTINUE);
      var gameState = yield (0, _effects.select)(state => state.gameState);
      console.log("Types.GAME_ON_CONTINUE: -------------------------------");
      yield (0, _effects.put)((0, _game.updateListGame)(gameState.appId, gameState.id, gameState));
    } catch (error) {
      console.log("ERRRRR");
    }
  }
}

function* onChoiceSelected() {
  while (true) {
    try {
      var action = yield (0, _effects.take)(Types.GAME_ON_CHOICE_SELECTED);
      var gameReducer = yield (0, _effects.select)(state => state.gameState);
      var cardProgressReducer = yield (0, _effects.select)(state => state.cardProgressReducer);
      var topicState = yield (0, _effects.select)(state => state.topicReducer); // console.log("check check topicState", topicState, 'gameReducer', gameReducer);

      yield (0, _effects.put)((0, _game.updateListGame)(gameReducer.appId, gameReducer.id, gameReducer, cardProgressReducer));

      if (gameReducer.gameType != _config.default.TEST_GAME) {
        yield* function* () {
          var currentTopic = topicState.data[gameReducer.topicId];
          var selectedChoice = action.payload;
          var currentQuestion = gameReducer.questions.find(item => {
            return item.id == selectedChoice.questionId;
          });

          if (!currentTopic) {
            if (currentQuestion) {
              currentTopic = topicState.data[currentQuestion.parentId];
            }
          } // console.log("update topic currentTopic ", currentTopic, 'currentQuestion', currentQuestion);


          if (currentQuestion) {
            // console.log("updateCardProgress ", currentQuestion.progress)
            yield (0, _effects.put)((0, _actions.updateCardProgress)([currentQuestion.progress]));
          }

          if (currentTopic && gameReducer.gameType == _config.default.STUDY_GAME) {
            yield (0, _effects.put)((0, _topicProgress.calcularTopicsProgress)(currentTopic, gameReducer.progress));
            var currentParentTopic = topicState.data[currentTopic.parentId];

            if (currentParentTopic) {
              // console.log("calcularParentTopicsProgress currentTopic ", currentTopic, 'currentParentTopic', currentParentTopic);
              yield (0, _effects.put)((0, _topicProgress.calcularParentTopicsProgress)(currentTopic, currentParentTopic));
            }
          }
        }();
      }
    } catch (error) {
      console.log("onChoiceSelected ERRRRR", error);
    }
  }
}

var gameSaga = [(0, _effects.fork)(startGameReload), onContinue(), onSaveGame(), onChoiceSelected(), forceStartNewGame()];
exports.gameSaga = gameSaga;