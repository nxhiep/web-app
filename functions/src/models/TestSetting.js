"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config"));

class TestSetting {
  constructor() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      appId,
      topicId,
      instanceFeedback,
      totalQuestion,
      allowMistake,
      contentTest
    } = props;
    this.appId = appId !== null && appId !== void 0 ? appId : -1;
    this.topicId = topicId !== null && topicId !== void 0 ? topicId : -1;
    this.instanceFeedback = instanceFeedback !== null && instanceFeedback !== void 0 ? instanceFeedback : false;
    this.totalQuestion = totalQuestion !== null && totalQuestion !== void 0 ? totalQuestion : _config.default.TEST_TOTAL_QUESTION;
    this.allowMistake = allowMistake !== null && allowMistake !== void 0 ? allowMistake : _config.default.TEST_ALLOW_MISTAKE;
    this.contentTest = contentTest !== null && contentTest !== void 0 ? contentTest : [];
  }

  static init(appId, topicId, contentTest) {
    return TestSetting.fromJS({
      appId: appId,
      topicId: topicId,
      contentTest: contentTest
    });
  }

  toJS() {
    return {
      appId: this.appId,
      topicId: this.topicId,
      instanceFeedback: this.instanceFeedback,
      questionsNumber: this.totalQuestion,
      mistakesNumber: this.allowMistake,
      contentTest: this.contentTest
    };
  }

  static fromJS(testSettingEntity) {
    if (typeof testSettingEntity === 'string') {
      return new TestSetting(JSON.parse(testSettingEntity));
    } else {
      var obj = Object.create(TestSetting.prototype);
      return new TestSetting(Object.assign(obj, testSettingEntity));
    }
  }

}

var _default = TestSetting;
exports.default = _default;