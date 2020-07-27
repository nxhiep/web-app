import Config from '../../config.js';
import Choice from '../../models/Choice';
import Progress from '../../models/Progress';
import Question from '../../models/QuestionX';
import * as Types from '../actions/types.js';
export class GameState {
    constructor(props) {
        var _a;
        if (props) {
            this.questions = new Array();
            this.id = props.id;
            this.appId = props.appId;
            this.status = props.status;
            this.gameType = props.gameType;
            this.progress = (_a = new Progress(props.progress)) !== null && _a !== void 0 ? _a : Progress.init();
            this.isFinish = props.isFinish;
            this.isLoaded = props.isLoaded;
            this.isLoading = props.isLoading;
            this.currentQuestion = new Question(props.currentQuestion);
            for (let i = 0; i < props.questions.length; i++) {
                this.questions.push(new Question(props.questions[i]));
            }
        }
        else {
            this.questions = new Array();
            this.progress = Progress.init();
        }
    }
    static init() {
        let gameState = new GameState();
        gameState.id = -1;
        gameState.appId = -1;
        gameState.questions = new Array();
        gameState.status = Config.GAME_STATUS_TESTING;
        gameState.isFinish = false;
        gameState.isLoaded = false;
        gameState.isLoading = 1;
        return gameState;
    }
    static cloneGameState(clone) {
        return new GameState(clone);
    }
}
const gameReducer = (state = GameState.init(), action) => {
    var _a, _b, _c, _d, _e, _f;
    switch (action.type) {
        case Types.SAVE_NEW_TEST_SETTING: {
            state.isLoading = 2;
            state.isFinish = false;
            state.isLoaded = false;
            return Object.assign({}, state);
        }
        case Types.GAME_LOAD_GAME: {
            state.isLoading = 2;
            state.isFinish = false;
            state.isLoaded = false;
            return Object.assign({}, state);
        }
        case Types.START_NEW_GAME:
            state = GameState.init();
            let cards = action.payload;
            state.id = action.topicId;
            state.appId = action.appId;
            state.gameType = action.gameType;
            for (let i = 0; i < cards.length; i++) {
                let question = Question.fromJs(cards[i]);
                question.index = i;
                (_a = state.questions) === null || _a === void 0 ? void 0 : _a.push(question);
                // if (i === 0) {
                //     state.currentQuestion = question;
                // }
            }
            onContinue(state, action.setting);
            state.isLoaded = true;
            state.isLoading = 3;
            return Object.assign({}, state);
        case Types.RESUME_GAME:
            state = GameState.cloneGameState(action.lastGame);
            state.isLoaded = true;
            onContinue(state, action.setting);
            // console.log("resume game --------  onContinue ", state);
            state.isLoading = 4;
            return Object.assign({}, state);
        case Types.GAME_ON_CHOICE_SELECTED:
            // console.log("GAME_ON_CHOICE_SELECTED game state", state);
            let selectedChoice = action.payload;
            let currentQuestion = state.questions.find((item) => {
                return item.id == selectedChoice.questionId;
            });
            console.log("GAME_ON_CHOICE_SELECTED ------- selectedChoice", selectedChoice, 'currentQuestion', currentQuestion, 'listSelected', listSelected);
            let correctNum = (_b = currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.getCorrectNum()) !== null && _b !== void 0 ? _b : 1;
            let isExist = listSelected.find(choice => {
                return choice.questionId === selectedChoice.questionId && choice.id === selectedChoice.id;
            });
            console.log("isExist ------- ", isExist);
            if (isExist) {
                return Object.assign({}, state);
            }
            else {
                listSelected.push(selectedChoice);
                if (listSelected.length > correctNum) {
                    const element = listSelected[0];
                    let updateChoice = (_c = currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.choices.find((item) => {
                        return item.id === element.id;
                    })) !== null && _c !== void 0 ? _c : new Choice();
                    updateChoice.selected = false;
                    listSelected.shift();
                }
            }
            for (let i = 0; i < listSelected.length; i++) {
                const element = listSelected[i];
                let updateChoice = (_d = currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.choices.find((item) => {
                    return item.id === element.id;
                })) !== null && _d !== void 0 ? _d : new Choice();
                updateChoice.selected = true;
            }
            // console.log("TTTTTTTTTTTTTT listSelected ", listSelected, 'correctNum', correctNum, 'currentQuestion', currentQuestion)
            if (listSelected.length === correctNum) {
                if (state.gameType == Config.TEST_GAME) {
                    currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.updateTestProgress(listSelected);
                    // currentQuestion?.updateTestProgress(listSelected);
                }
                else {
                    currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.updateQuestionProgress(listSelected);
                }
                let newQues = (_e = state.questions.find((item) => {
                    return item.id === (currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.id);
                })) !== null && _e !== void 0 ? _e : new Question();
                newQues.questionStatus = (_f = currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.questionStatus) !== null && _f !== void 0 ? _f : Config.QUESTION_ANSWERED_SKIP;
                // console.log("new CurrentQuestion: ", currentQuestion);
                state.progress = calcProgress(state.questions);
            }
            else {
            }
            // console.log("new state.questions: xem nhu nao nao ", Object.assign({}, state));
            state.isLoading = 5;
            return Object.assign({}, state);
        case Types.GAME_ON_CONTINUE:
            onContinue(state, action.setting);
            state.isLoading = 6;
            return Object.assign({}, state);
        case Types.GAME_END_GAME:
            // console.log("End game check passed! 6666666666")
            state.progress = calcProgress(state.questions);
            state.status = Config.GAME_STATUS_FAILED;
            state.isFinish = true;
            state.isLoading = 7;
            return Object.assign({}, state);
        default: return state;
    }
};
var listSelected = new Array();
const onContinue = (state, testSetting) => {
    // console.log("ON CONTINUE", state);
    if (state.gameType === Config.REVIEW_GAME) {
        let questions = state.questions;
        listSelected = [];
        state.progress = calcProgress(questions);
        questions.forEach(q => {
            q.reset();
        });
    }
    else if (state.gameType === Config.STUDY_GAME) {
        let questions = state.questions;
        listSelected = [];
        questions.sort((a, b) => {
            if (a.progress.boxNum === b.progress.boxNum) {
                return a.lastUpdate - b.lastUpdate;
            }
            return a.progress.boxNum - b.progress.boxNum;
        });
        state.progress = calcProgress(questions);
        // state.currentQuestion?.reset();
        let newQuestion = questions[0];
        newQuestion.reset();
        state.currentQuestion = newQuestion;
        if (state.currentQuestion.progress.boxNum > 1) {
            state.isFinish = true;
        }
    }
    else {
        console.log("ON CONTINUE ", Object.assign({}, state), 'listSelected', listSelected.toString());
        let currentQuestion = state.currentQuestion;
        listSelected = [];
        if (!currentQuestion) {
            // console.log("new ", Object.assign({}, currentQuestion));
            // state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        }
        else if (currentQuestion.questionStatus != Config.QUESTION_NOT_ANSWERED) {
            // console.log("normal ", Object.assign({}, currentQuestion));
            state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        }
        else {
            // console.log("skip ", Object.assign({}, currentQuestion));
            currentQuestion.questionStatus = Config.QUESTION_ANSWERED_SKIP;
            state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        }
        console.log("Testing xxxxxxxxxxxxx", testSetting);
        state.progress = calcProgress(state.questions);
        checkTestPassed(testSetting, state);
        state.currentQuestion = state.questions[0];
    }
};
const checkTestPassed = (setting, state) => {
    if (setting && state.questions.length > 0) {
        console.log("checkTestPassed ", state.progress, 'setting', setting);
        if (state.progress.mistake > setting.allowMistake) {
            state.status = Config.GAME_STATUS_FAILED;
            state.isFinish = true;
        }
        else if (state.progress.done >= state.questions.length) {
            state.status = Config.GAME_STATUS_PASSED;
            state.isFinish = true;
        }
    }
};
const calcProgress = (questions) => {
    return Progress.calcProgress(questions);
};
export default gameReducer;
