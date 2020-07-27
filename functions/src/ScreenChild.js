"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _react = _interopRequireDefault(require("react"));

var _component = _interopRequireDefault(require("@loadable/component"));

var ReviewViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/review/Review.View'))));
var StudyViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/study/Study.View'))));
var TestViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/test/Test.View'))));

function ScreenChild() {
  var {
    screen
  } = useParams();
  screen = screen !== null && screen !== void 0 ? screen : '';

  if (screen.startsWith(Routes.TEST_SCREEN)) {
    // console.log("screen", screen);
    var offset = screen.lastIndexOf('-');
    var topicId = -1;

    if (offset > -1) {
      offset += 1;
      topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    } // console.log("TestViewScreen topicId ", topicId);


    return /*#__PURE__*/_react.default.createElement(TestViewScreen, {
      topicId: topicId
    });
  }

  if (screen.startsWith(Routes.REVIEW_SCREEN)) {
    return /*#__PURE__*/_react.default.createElement(ReviewViewScreen, null);
  }

  if (screen.length > 0) {
    return /*#__PURE__*/_react.default.createElement(StudyViewScreen, null);
  }

  return /*#__PURE__*/_react.default.createElement(HomeViewScreen, null);
}