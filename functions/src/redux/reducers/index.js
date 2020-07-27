"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _appInfo = _interopRequireDefault(require("./appInfo"));

var _appValue = _interopRequireDefault(require("./appValue"));

var _card = _interopRequireDefault(require("./card"));

var _cardProgress = _interopRequireDefault(require("./cardProgress"));

var _game = _interopRequireDefault(require("./game"));

var _listGames = _interopRequireDefault(require("./listGames"));

var _stateInfo = _interopRequireDefault(require("./stateInfo"));

var _testSetting = require("./test-setting");

var _topic = _interopRequireDefault(require("./topic"));

var _topicProgress = _interopRequireDefault(require("./topicProgress"));

var _userRate = _interopRequireDefault(require("./userRate"));

// import reviewReducer from './review.js';
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
var rootReducer = (0, _redux.combineReducers)({
  topicReducer: _topic.default,
  // reviewReducer,
  cardProgressReducer: _cardProgress.default,
  cardReducer: _card.default,
  gameState: _game.default,
  listGameState: _listGames.default,
  testSettingState: _testSetting.testSettingReducer,
  topicProgressReducer: _topicProgress.default,
  appValueState: _appValue.default,
  appInfoState: _appInfo.default,
  stateInfoState: _stateInfo.default,
  userRateState: _userRate.default // counterState: counterReducer,
  // demoState: demoRed
  //   listTestSettingReducer

});
var _default = rootReducer;
exports.default = _default;