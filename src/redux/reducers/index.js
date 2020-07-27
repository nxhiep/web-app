import { combineReducers } from "redux";
import appInfoState from "./appInfo";
import appValueState from "./appValue";
import cardReducer from './card';
// import reviewReducer from './review.js';
import cardProgressReducer from './cardProgress';
import gameReducer from './game';
import listGameReducer from './listGames';
import stateInfoState from "./stateInfo";
import { testSettingReducer } from "./test-setting";
import topicReducer from './topic';
import topicProgressReducer from "./topicProgress";
import userRateState from "./userRate";
// var kk = new Map<number, Array<number>>();
// kk.set(10000,[1,2,3,4]);
// const xx = {
//     counter: kk
// }
// interface CounterAction {
//     type:  "COUNTER"
// }
// const counterReducer = (state: AbcState = xx, action: CounterAction) => {
//     switch (action.type) {
//         default: return {...state}
//     }
// }
// const x2 = {
//     number: new Date().getTime()
// }
// const demoRed: Reducer<DemoState> = (state: DemoState = x2, action: AnyAction): DemoState => {
//     switch (action.type) {
//         case REHYDRATE:
//             // console.log("REHYDRATE", action);
//             return state;
//         default: return state;
//     }
// }
const rootReducer = combineReducers({
    topicReducer,
    // reviewReducer,
    cardProgressReducer,
    cardReducer,
    gameState: gameReducer,
    listGameState: listGameReducer,
    testSettingState: testSettingReducer,
    topicProgressReducer: topicProgressReducer,
    appValueState: appValueState,
    appInfoState: appInfoState,
    stateInfoState: stateInfoState,
    userRateState: userRateState
    // counterState: counterReducer,
    // demoState: demoRed
    //   listTestSettingReducer
});
export default rootReducer;
