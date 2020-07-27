"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTestSetting = exports.saveNewTestSetting = exports.loadTestSettingByTopicId = void 0;

var Types = _interopRequireWildcard(require("./types.js"));

var loadTestSettingByTopicId = params => {
  return {
    type: Types.LOAD_TEST_SETTING_BY_TOPIC_ID,
    appId: params.appId,
    topicId: params.topicId,
    topicIds: params.topicIds
  };
};

exports.loadTestSettingByTopicId = loadTestSettingByTopicId;

var saveNewTestSetting = params => {
  return {
    type: Types.SAVE_NEW_TEST_SETTING,
    setting: params.setting,
    topicId: params.topicId,
    appId: params.appId
  };
};

exports.saveNewTestSetting = saveNewTestSetting;

var updateTestSetting = (appId, topicId, testSetting, topicIds) => {
  return {
    type: Types.UPDATE_TEST_SETTING,
    testSetting: testSetting,
    topicIds: topicIds,
    topicId: topicId,
    appId: appId
  };
};

exports.updateTestSetting = updateTestSetting;