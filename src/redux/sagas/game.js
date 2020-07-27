import { call, fork, put, select, take } from 'redux-saga/effects';
import Config from '../../config.js';
import TestSetting from '../../models/TestSetting';
import { getCardsByIdsSuccess, saveNewTestSetting, updateCardProgress } from '../actions';
import { loadGame, removeLastGame, resumeGame, startNewGame, updateListGame } from '../actions/game';
import * as Types from '../actions/types.js';
import { calcularParentTopicsProgress, calcularTopicsProgress } from './../actions/topicProgress';
import * as CARD_PROGRESS_API from './cardProgressSaga';
import * as CARD_API from './cardSaga';
// 5067401930473472
function* forceStartNewGame() {
    // console.log("start new test with setting");
    while (true) {
        let action = yield take(Types.START_NEW_TEST);
        let appId = action.appId;
        let topicId = action.topicId;
        let gameType = action.gameType;
        let setting = action.setting;
        let questionIds = action.questionIds;
        console.log("forceStartNewGame setting ", setting);
        // REMOVE LAST GAME  
        if (setting) {
            yield put(saveNewTestSetting({ appId: appId, setting: setting, topicId: topicId }));
        }
        console.log("removeLastGame appId", appId, 'topicId', topicId, 'gameType', gameType);
        yield put(removeLastGame(appId, topicId, gameType));
        // RERUN ACTION GAME_LOAD_GAME
        console.log("loadGame appId", appId, 'topicId', topicId, 'gameType', gameType);
        yield put(loadGame({ appId: appId, topicId: topicId, gameType: gameType, setting: setting, questionIds: questionIds }));
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
    let action = yield take(Types.GAME_LOAD_GAME);
    console.log("GAME_LOAD_GAME ------------ ", action);
    let topicId = action.payload;
    let appId = action.appId;
    let gameType = action.gameType;
    let testSetting;
    if (action.setting) {
        // console.log("vllll", setting);
        testSetting = TestSetting.fromJS(action.setting);
    }
    else {
        testSetting = new TestSetting(yield select((state) => {
            return state.testSettingState.currentSetting;
        }));
    }
    let questionIds = action.questionIds;
    let currentGame;
    if (gameType === Config.STUDY_GAME || gameType === Config.REVIEW_GAME) {
        // Game for study
        console.log('game for study', {
            appId, topicId, gameType
        });
        currentGame = yield select((state) => {
            let games = state.listGameState.games;
            return games.find((item) => (item.id == topicId && item.gameType == gameType));
        });
    }
    else {
        // Game for test
        currentGame = yield select((state) => {
            let games = state.listGameState.games;
            return games.find((item) => (item.id == topicId && item.gameType == Config.TEST_GAME));
        });
    }
    console.log("CCCCCCCCCCCCCCCCCCCCCCCC current Game ", currentGame, 'action', action, 'questionIds', questionIds);
    if (currentGame == null || currentGame == undefined) {
        // todo : start new game
        if (gameType === Config.STUDY_GAME || gameType === Config.REVIEW_GAME) {
            // Start new game for study
            let cards;
            if (questionIds && questionIds.length > 0) {
                cards = yield call(CARD_API.getCardsByIdsAPI, questionIds);
            }
            else {
                cards = yield call(CARD_API.getCardByParentIdForStudy, topicId);
            }
            yield put(getCardsByIdsSuccess(cards));
            yield CARD_PROGRESS_API.getQuestionsProgress(cards);
            // console.log("loaded question", cards);
            yield put(startNewGame({
                appId: appId,
                topicId: topicId,
                cards: cards,
                gameType: gameType
            }));
        }
        else {
            // start new game for test
            // console.log("SETTINGGGGG", testSetting);
            const cards = yield call(CARD_API.getCardForTest, testSetting);
            yield put(getCardsByIdsSuccess(cards));
            yield CARD_PROGRESS_API.getQuestionsProgress(cards);
            // console.log("Cards: ", cards);
            // const cards = fakeCards;
            yield put(startNewGame({
                appId: appId,
                topicId: topicId,
                cards: cards,
                gameType: gameType,
                setting: testSetting
            }));
        }
        // const responseCards = yield call(getCardByIdExamApi, examId);
        // if (responseCards.status === 1 && responseCards.data) {
        //     yield put(startNewGame({ examId, cards: responseCards.data }));
        // } 
    }
    else {
        // todo : resume game
        // console.log("RESUMEEEEEEEEEEEEE")
        yield put(resumeGame(currentGame, testSetting));
    }
}
function* onSaveGame() {
    while (true) {
        try {
            let action = yield take(Types.START_NEW_GAME);
            let gameState = yield select((state) => state.gameState);
            yield put(updateListGame(action.appId, action.topicId, gameState));
        }
        catch (error) {
        }
    }
}
function* onContinue() {
    while (true) {
        try {
            yield take(Types.GAME_ON_CONTINUE);
            let gameState = yield select((state) => state.gameState);
            console.log("Types.GAME_ON_CONTINUE: -------------------------------");
            yield put(updateListGame(gameState.appId, gameState.id, gameState));
        }
        catch (error) {
            console.log("ERRRRR");
        }
    }
}
function* onChoiceSelected() {
    while (true) {
        try {
            let action = yield take(Types.GAME_ON_CHOICE_SELECTED);
            let gameReducer = yield select((state) => state.gameState);
            let cardProgressReducer = yield select((state) => state.cardProgressReducer);
            let topicState = yield select((state) => state.topicReducer);
            // console.log("check check topicState", topicState, 'gameReducer', gameReducer);
            yield put(updateListGame(gameReducer.appId, gameReducer.id, gameReducer, cardProgressReducer));
            if (gameReducer.gameType != Config.TEST_GAME) {
                let currentTopic = topicState.data[gameReducer.topicId];
                let selectedChoice = action.payload;
                let currentQuestion = gameReducer.questions.find((item) => {
                    return item.id == selectedChoice.questionId;
                });
                if (!currentTopic) {
                    if (currentQuestion) {
                        currentTopic = topicState.data[currentQuestion.parentId];
                    }
                }
                // console.log("update topic currentTopic ", currentTopic, 'currentQuestion', currentQuestion);
                if (currentQuestion) {
                    // console.log("updateCardProgress ", currentQuestion.progress)
                    yield put(updateCardProgress([currentQuestion.progress]));
                }
                if (currentTopic && gameReducer.gameType == Config.STUDY_GAME) {
                    yield put(calcularTopicsProgress(currentTopic, gameReducer.progress));
                    let currentParentTopic = topicState.data[currentTopic.parentId];
                    if (currentParentTopic) {
                        // console.log("calcularParentTopicsProgress currentTopic ", currentTopic, 'currentParentTopic', currentParentTopic);
                        yield put(calcularParentTopicsProgress(currentTopic, currentParentTopic));
                    }
                }
            }
        }
        catch (error) {
            console.log("onChoiceSelected ERRRRR", error);
        }
    }
}
export const gameSaga = [
    fork(startGameReload),
    onContinue(),
    onSaveGame(),
    onChoiceSelected(),
    forceStartNewGame(),
];
