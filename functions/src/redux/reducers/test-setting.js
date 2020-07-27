"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testSettingReducer = void 0;

var _reduxPersist = require("redux-persist");

var _TestSetting = _interopRequireDefault(require("../../models/TestSetting"));

var Types = _interopRequireWildcard(require("../actions/types.js"));

var initialState = {
  data: [],
  currentSetting: undefined
};

var testSettingReducer = function testSettingReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case Types.LOAD_TEST_SETTING_BY_TOPIC_ID:
      var appId = action.appId;
      var topicId = action.topicId;
      var topicIds = action.topicIds;
      var currentSetting = state.data.find(item => item.topicId == topicId); // console.log("currentSetting", currentSetting);

      if (currentSetting) {
        state.currentSetting = currentSetting;
      } else {
        state.currentSetting = _TestSetting.default.init(appId, topicId, topicIds);
      }

      return Object.assign({}, state);

    case _reduxPersist.REHYDRATE:
      var result = new Array(); // console.log("ACTIONNNNNNNNN", action)

      if (action.payload && action.payload['testSettingState']) {
        var lists = action.payload['testSettingState']['data'];

        if (lists) {
          for (var i = 0; i < lists.length; i++) {
            var element = lists[i];

            var testSetting = _TestSetting.default.fromJS(element);

            result.push(testSetting);
          }
        }

        var currentTestSettingData = action.payload['testSettingState']['currentSetting'];

        if (currentTestSettingData) {
          state.currentSetting = _TestSetting.default.fromJS(currentTestSettingData);
        }

        state.data = result;
      }

      return Object.assign({}, state);

    case Types.SAVE_NEW_TEST_SETTING:
      {
        var _topicId = action.topicId;
        state.data = state.data.filter(item => item.topicId != _topicId);
        state.data.push(action.setting);
        state.currentSetting = action.setting;
        return Object.assign({}, state);
      }

    case Types.UPDATE_TEST_SETTING:
      {
        var _topicId2 = action.topicId;
        state.data = state.data.filter(item => item.topicId != _topicId2);
        action.testSetting.contentTest = action.topicIds;
        state.data.push(action.testSetting);
        state.currentSetting = action.testSetting;
        return Object.assign({}, state);
      }

    default:
      return Object.assign({}, state);
  }
};

exports.testSettingReducer = testSettingReducer;