import { onSelectedChoice } from './../actions/game';
import { Reducer } from 'redux';
import Config from '../../config.js';
import Choice from '../../models/Choice';
import Progress from '../../models/Progress';
import Question from '../../models/QuestionX';
import { GameActions } from '../actions/game';
import * as Types from '../actions/types.js';
import TestSetting from '../../models/TestSetting.js';

export interface GameEntity {
    id?: number; // topicId
    appId?: number;
    status?: number;
    gameType?: number;
    questions: Array<Question>;
    currentQuestion?: Question;
    progress: Progress;
    isFinish?: boolean;
    isLoaded?: boolean;
    isLoading?: number;
}
export class GameState implements GameEntity {
    id?: number; // topicId
    appId?: number;
    status?: number;
    gameType?: number;
    questions: Array<Question>;
    currentQuestion?: Question;
    progress: Progress;
    isFinish?: boolean;
    isLoaded?: boolean;
    isLoading?: number;

    constructor(props?: GameEntity) {
        if (props) {
            this.questions = new Array<Question>();
            this.id = props.id;
            this.appId = props.appId;
            this.status = props.status;
            this.gameType = props.gameType;

            this.progress = new Progress(props.progress) ?? Progress.init();
            this.isFinish = props.isFinish;
            this.isLoaded = props.isLoaded;
            this.isLoading = props.isLoading;
            this.currentQuestion = new Question(props.currentQuestion);
            for (let i = 0; i < props.questions.length; i++) {
                this.questions.push(new Question(props.questions[i]));
            }
        } else {
            this.questions = new Array<Question>();
            this.progress = Progress.init();
        }

    }
    static init(): GameState {
        let gameState = new GameState();
        gameState.id = -1;
        gameState.appId = -1;
        gameState.questions = new Array<Question>();
        gameState.status = Config.GAME_STATUS_TESTING;
        gameState.isFinish = false;
        gameState.isLoaded = false;
        gameState.isLoading = 1;
        return gameState;
    }
    static cloneGameState(clone: GameEntity): GameState {
        return new GameState(clone);
    }
}

const gameReducer: Reducer<GameEntity> = (state = GameState.init(), action: GameActions): GameEntity => {
    switch (action.type) {
        case Types.SAVE_NEW_TEST_SETTING: {
            state.isLoading = 2;
            state.isFinish = false;
            state.isLoaded = false;
            return { ...state };
        }
        case Types.GAME_LOAD_GAME: {
            state.isLoading = 2;
            state.isFinish = false;
            state.isLoaded = false;
            return { ...state };
        }
        case Types.START_NEW_GAME:
            state = GameState.init();
            let cards = action.payload;
            state.id = action.topicId;
            state.appId = action.appId;
            state.gameType = action.gameType;
            for (let i = 0; i < cards.length; i++) {
                let question: Question = Question.fromJs(cards[i]);
                question.index = i;
                state.questions?.push(question);
                // if (i === 0) {
                //     state.currentQuestion = question;
                // }
            }
            onContinue(state, action.setting);
            state.isLoaded = true;
            state.isLoading = 3;
            return { ...state };
        case Types.RESUME_GAME:
            state = GameState.cloneGameState(action.lastGame);
            state.isLoaded = true;
            onContinue(state, action.setting);
            // console.log("resume game --------  onContinue ", state);
            state.isLoading = 4;
            return { ...state };
        case Types.GAME_ON_CHOICE_SELECTED:
            // console.log("GAME_ON_CHOICE_SELECTED game state", state);
            let selectedChoice: Choice = action.payload;
            let currentQuestion = state.questions.find((item: Question) => {
                return item.id == selectedChoice.questionId;
            })
            console.log("GAME_ON_CHOICE_SELECTED ------- selectedChoice", selectedChoice, 'currentQuestion', currentQuestion, 'listSelected', listSelected);
            let correctNum = currentQuestion?.getCorrectNum() ?? 1;
            let isExist = listSelected.find(choice => {
                return choice.questionId === selectedChoice.questionId && choice.id === selectedChoice.id
            });
            console.log("isExist ------- ", isExist);
            if (isExist) {
                return { ...state };
            } else {
                listSelected.push(selectedChoice);
                if (listSelected.length > correctNum) {
                    const element = listSelected[0];
                    let updateChoice: Choice = currentQuestion?.choices.find((item) => {
                        return item.id === element.id;
                    }) ?? new Choice();
                    updateChoice.selected = false;
                    listSelected.shift();
                }
            }
            for (let i = 0; i < listSelected.length; i++) {
                const element = listSelected[i];
                let updateChoice = currentQuestion?.choices.find((item) => {
                    return item.id === element.id;
                }) ?? new Choice();
                updateChoice.selected = true;

            }
            // console.log("TTTTTTTTTTTTTT listSelected ", listSelected, 'correctNum', correctNum, 'currentQuestion', currentQuestion)
            if (listSelected.length === correctNum) {
                if(state.gameType == Config.TEST_GAME){
                    currentQuestion?.updateTestProgress(listSelected);
                    // currentQuestion?.updateTestProgress(listSelected);
                } else {
                    currentQuestion?.updateQuestionProgress(listSelected);
                }
                let newQues = state.questions.find((item) => {
                    return item.id === currentQuestion?.id;
                }) ?? new Question();
                newQues.questionStatus = currentQuestion?.questionStatus ?? Config.QUESTION_ANSWERED_SKIP;
                // console.log("new CurrentQuestion: ", currentQuestion);
                state.progress = calcProgress(state.questions);
            } else {
            }
            // console.log("new state.questions: xem nhu nao nao ", Object.assign({}, state));
            state.isLoading = 5;
            return { ...state };
        case Types.GAME_ON_CONTINUE:
            onContinue(state, action.setting);
            state.isLoading = 6;
            return { ...state };
        case Types.GAME_END_GAME:
            // console.log("End game check passed! 6666666666")
            state.progress = calcProgress(state.questions);
            state.status = Config.GAME_STATUS_FAILED;
            state.isFinish = true;
            state.isLoading = 7;
            return { ...state };
        default: return state;
    }
}

var listSelected: Array<Choice> = new Array<Choice>();
const onContinue = (state: GameState, testSetting: TestSetting | undefined) => {
    // console.log("ON CONTINUE", state);
    if (state.gameType === Config.REVIEW_GAME) {
        let questions = state.questions;
        listSelected = [];
        state.progress = calcProgress(questions);
        questions.forEach(q => {
            q.reset();
        });
    } else if (state.gameType === Config.STUDY_GAME) {
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
    } else {
        console.log("ON CONTINUE ", Object.assign({}, state), 'listSelected', listSelected.toString());
        let currentQuestion: Question | undefined = state.currentQuestion;
        listSelected = [];
        if(!currentQuestion){
            // console.log("new ", Object.assign({}, currentQuestion));
            // state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        } else if(currentQuestion.questionStatus != Config.QUESTION_NOT_ANSWERED) {
            // console.log("normal ", Object.assign({}, currentQuestion));
            state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        } else {
            // console.log("skip ", Object.assign({}, currentQuestion));
            currentQuestion.questionStatus = Config.QUESTION_ANSWERED_SKIP;
            state.questions.sort((a, b) => a.questionStatus - b.questionStatus);
        }
        
        console.log("Testing xxxxxxxxxxxxx", testSetting);
        state.progress = calcProgress(state.questions);
        checkTestPassed(testSetting, state);
        state.currentQuestion = state.questions[0];
    }
}

const checkTestPassed = (setting: TestSetting | undefined, state: GameState) => {
    if(setting && state.questions.length > 0){
        console.log("checkTestPassed ", state.progress, 'setting', setting);
        if (state.progress.mistake > setting.allowMistake) {
            state.status = Config.GAME_STATUS_FAILED;
            state.isFinish = true;
        } else if (state.progress.done >= state.questions.length) {
            state.status = Config.GAME_STATUS_PASSED;
            state.isFinish = true;
        }
    }
}

const calcProgress = (questions: Array<Question>): Progress => {
    return Progress.calcProgress(questions);
}
export default gameReducer;