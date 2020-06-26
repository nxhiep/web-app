import { REHYDRATE } from 'redux-persist';
import Config from '../../config.js';
import Choice from '../../models/Choice';
import TestSetting from '../../models/TestSetting';
import { QuestionProgressState } from '../reducers/cardProgress';
import { GameState } from '../reducers/game';
import * as Types from './types.js';
interface RemoveGameAction {
    type: typeof Types.REMOVE_GAME,
    appId: number,
    topicId: number,
    gameType: number
}
interface StartNewExamTestAction {
    type: typeof Types.START_NEW_TEST,
    setting: TestSetting,
    appId: number,
    topicId: number,
    gameType: number
}

interface StartNewTestAction {
    type: typeof Types.SAVE_NEW_TEST_SETTING,
}
interface LoadGameAction {
    type: typeof Types.GAME_LOAD_GAME,
    appId: number,
    payload: number, // examId
    gameType: number,
    setting?: TestSetting,
    questionIds?: Array<number>
}
interface StartNewGameAction {
    type: typeof Types.START_NEW_GAME, 
    payload: Array<any>, 
    appId: number, 
    topicId: number, 
    gameType: number,
    setting: TestSetting | undefined
}
interface OnSelectedChoiceAction {
    type: typeof Types.GAME_ON_CHOICE_SELECTED,
    payload: Choice
}
interface OnContinueAction {
    type: typeof Types.GAME_ON_CONTINUE,
    setting: TestSetting | undefined
}
interface UpdateListGameAction {
    type: typeof Types.GAME_UPDATE_LIST_GAME,
    appId: number, 
    topicId: number, 
    payload: any, 
    questionProgressState: QuestionProgressState | any,
}

interface ResumeGameAction {
    type: typeof Types.RESUME_GAME,
    lastGame: GameState,
    setting: TestSetting | undefined
}
export interface RehydrateAction {
    type: typeof REHYDRATE,
    payload: any
}
export interface EndTestAction {
    type: typeof Types.GAME_END_GAME,
    appId: number,
    topicId: number,
    gameType: number,
    setting: TestSetting
}
export type GameActions = RemoveGameAction | StartNewExamTestAction | LoadGameAction | StartNewGameAction 
                        | OnSelectedChoiceAction | OnContinueAction | UpdateListGameAction | ResumeGameAction 
                        | RehydrateAction | EndTestAction | StartNewTestAction;
export const removeLastGame = (appId: number, topicId: number, gameType: number): RemoveGameAction => {
    return {
        type: Types.REMOVE_GAME,
        appId: appId,
        topicId: topicId,
        gameType: gameType,
    }
}
export const startNewExamTest = (props: StartNewExamTestAction | {appId: number, topicId: number, gameType: number, setting: TestSetting}): StartNewExamTestAction => {
    const { gameType, topicId, appId, setting} = props;
    return {
        type: Types.START_NEW_TEST,
        appId: appId,
        topicId: topicId,
        gameType: gameType ?? Config.TEST_GAME,
        setting: setting
    }
}
export const loadGame = (params: { appId: number, topicId: number, gameType: number, setting?: TestSetting, questionIds?: Array<number> }): LoadGameAction => {
    console.log("params", params);
    return {
        type: Types.GAME_LOAD_GAME,
        payload: params.topicId,
        appId: params.appId,
        gameType: params.gameType,
        setting: params.setting,
        questionIds: params.questionIds
    }
}

export const startNewGame = (params: { appId: number, topicId: number, cards: Array<any>, gameType: number, setting?: TestSetting }): StartNewGameAction => {
    return {
        type: Types.START_NEW_GAME,
        payload: params.cards,
        topicId: params.topicId,
        appId: params.appId,
        gameType: params.gameType,
        setting: params.setting
    }
}

export const resumeGame = (lastGame: GameState, setting: TestSetting) : ResumeGameAction => {
    return {
        type: Types.RESUME_GAME,
        lastGame: lastGame,
        setting: setting
    }
}
export const onSelectedChoice = (choice: Choice): OnSelectedChoiceAction => {
    return {
        type: Types.GAME_ON_CHOICE_SELECTED,
        payload: choice
    }
}

export const onContinue = (setting?: TestSetting): OnContinueAction => {
    return {
        type: Types.GAME_ON_CONTINUE,
        setting: setting
    }
}

export const updateListGame = (appId: number, topicId: number, game: GameState, questionProgressState?: QuestionProgressState): UpdateListGameAction => {
    return {
        type: Types.GAME_UPDATE_LIST_GAME,
        appId: appId,
        topicId: topicId,
        payload: game,
        questionProgressState: questionProgressState,
    }
}

export const endTest = (props: {appId: number, topicId: number, gameType: number, setting: TestSetting}) : EndTestAction => {
    return {
        type: Types.GAME_END_GAME,
        topicId: props.topicId,
        appId: props.appId,
        gameType: props.gameType,
        setting: props.setting,
    }
}