"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _ArrowBack = _interopRequireDefault(require("@material-ui/icons/ArrowBack"));

var _react = _interopRequireDefault(require("react"));

var _reactChartjs = require("react-chartjs-2");

var _reactRedux = require("react-redux");

var _config = _interopRequireDefault(require("../../config"));

var _TestSetting = _interopRequireDefault(require("../../models/TestSetting"));

var _actions = require("../../redux/actions");

require("../../resources/scss/test.scss");

var EndTestView = (_ref) => {
  var {
    testSetting,
    startNewTest,
    gameState
  } = _ref;

  var _a, _b, _c;

  var examId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;
  var gameType = (_b = gameState.gameType) !== null && _b !== void 0 ? _b : _config.default.TEST_GAME;
  var gameStatus = (_c = gameState.status) !== null && _c !== void 0 ? _c : _config.default.GAME_STATUS_TESTING;
  var progress = gameState.progress; // console.log("End test gameState ", gameState, examId);

  var testFailed = gameStatus == _config.default.GAME_STATUS_FAILED;
  var data = [];

  if (testFailed) {
    data = [progress.correct, progress.mistake];
  } else {
    data = [progress.correct, progress.mistake];
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "end-test-view" + (testFailed ? " test-failed" : " test-passed")
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    justify: "space-between",
    className: "title"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: () => startNewTest({
      examId,
      gameType,
      setting: _TestSetting.default.fromJS(testSetting)
    })
  }, /*#__PURE__*/_react.default.createElement(_ArrowBack.default, {
    style: {
      color: 'white'
    }
  })), /*#__PURE__*/_react.default.createElement("div", null, testFailed ? "Your have failed!" : "You have passed!"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '50px'
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-panel"
  }, /*#__PURE__*/_react.default.createElement(PieChart, {
    data: data,
    labels: ['Correct', 'Mistake']
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "description"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "content"
  }, !testFailed ? "Congratulations! You have passed this test, you need to pass this test as least 5 times to get ready for your real test." : "You incorrectly answered the number of sentences allowed, please learn more to pass the test.")), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "primary",
    className: "try-again-test-button",
    onClick: () => startNewTest({
      examId,
      gameType,
      setting: _TestSetting.default.fromJS(testSetting)
    })
  }, "Try Again")));
};

var PieChart = (_ref2) => {
  var {
    data = [1, 2],
    labels = ['One', "Two"],
    colors = ['green', 'red']
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(_reactChartjs.Pie, {
    data: {
      datasets: [{
        backgroundColor: colors,
        data: data
      }],
      labels: labels
    },
    options: {
      legend: {
        position: "bottom"
      }
    }
  });
};

var mapStateToProps = (state, ownProps) => Object.assign({
  testSetting: state.testSettingState.currentSetting,
  gameState: state.gameState
}, ownProps);

var mapDispatchToProps = {
  startNewTest: x => (0, _actions.startNewExamTest)(x)
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EndTestView); // export default EndTestView;


exports.default = _default;