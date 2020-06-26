import { UserRateState } from './reducers/userRate';
import { StateInfoState } from './reducers/stateInfo';
import { AppInfoState } from './reducers/appInfo';
import TestSetting from '../models/TestSetting';
import { AppValueState } from './reducers/appValue';
import { QuestionProgressState } from './reducers/cardProgress';
import { GameEntity } from './reducers/game';
import { ListGameEntitty } from './reducers/listGames';
import { TopicState } from './reducers/topic';
import { TopicProgressState } from './reducers/topicProgress';

export interface AppState {
    topicReducer: TopicState,
    reviewReducer: any,
    cardProgressReducer: QuestionProgressState,
    cardReducer: any,
    gameState: GameEntity,
    testSettingState: TestSettingState,
    listGameState: ListGameEntitty,
    counterState: AbcState,
    demoState: DemoState,
    topicProgressReducer: TopicProgressState,
    appValueState: AppValueState,
    appInfoState: AppInfoState,
    stateInfoState: StateInfoState,
    userRateState: UserRateState
}

export interface TestSettingState {
     data: Array<TestSetting>,
     currentSetting: TestSetting | undefined
}

export interface AbcState {
    counter: Map<number, Array<number>>
}
export interface DemoState {
    number: number
}