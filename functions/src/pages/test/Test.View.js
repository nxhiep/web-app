"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _Dialog = require("../../components/Dialog");

var _Footer = _interopRequireDefault(require("../../components/Footer"));

var _Header = _interopRequireDefault(require("../../components/Header"));

var _SelectStatePopup = _interopRequireDefault(require("../../components/SelectStatePopup"));

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _Utils = require("../../models/Utils");

var _actions = require("../../redux/actions");

var _game = require("../../redux/actions/game");

require("../../resources/scss/main.scss");

require("../../resources/scss/test.scss");

var _EndTest = _interopRequireDefault(require("./EndTest"));

var _TestComponent = require("./TestComponent");

var _TestSettingView = _interopRequireDefault(require("./TestSettingView"));

var _reactGa = _interopRequireDefault(require("react-ga"));

var TestViewScreen = (_ref) => {
  var {
    getAppInfo,
    appInfoState,
    topicId = -1
  } = _ref;
  var {
    appNameId
  } = (0, _reactRouterDom.useParams)();
  appNameId = appNameId !== null && appNameId !== void 0 ? appNameId : '';
  var theme = (0, _styles.useTheme)();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm'));
  (0, _react.useEffect)(() => {
    getAppInfo(appNameId);

    if (isMobile) {
      (0, _Utils.scrollToTop)();
    }
  }, [getAppInfo, appNameId, isMobile]);
  var appInfo = appInfoState.data[appNameId];
  (0, _react.useEffect)(() => {
    if (appInfo) {
      (0, _Utils.setSEOContent)({
        title: 'Test - ' + appInfo.title,
        description: appInfo.description,
        keywords: appInfo.keywords,
        icon: appInfo.avatar
      });

      _reactGa.default.pageview('/testpage/' + appInfo.title);
    }
  }, [appInfo]);

  if (!appInfo) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  return /*#__PURE__*/_react.default.createElement(TestView, {
    appInfo: appInfo,
    topicId: topicId > -1 ? topicId : appInfo.id,
    isMobile: isMobile
  });
};

class TestViewUI extends _react.Component {
  constructor(props) {
    super(props);

    this.renderTest = () => {
      var {
        gameState,
        onContinue,
        testSetting
      } = this.props;
      var appInfo = this.state.appInfo;

      if (!testSetting || !testSetting.currentSetting || testSetting.currentSetting.appId != appInfo.id) {
        return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
      }

      var currentQuestion = gameState.currentQuestion;
      var isSkip = currentQuestion && currentQuestion.questionStatus == _config.default.QUESTION_NOT_ANSWERED;
      return /*#__PURE__*/_react.default.createElement(_core.Grid, {
        item: true,
        sm: 12,
        md: 8,
        className: "right-panel",
        style: this.state.isMobile ? {
          display: this.state.showGame ? '' : 'none'
        } : {}
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "box-question-panel"
      }, !gameState.isFinish ? /*#__PURE__*/_react.default.createElement(_TestComponent.TestProgressPanel, null) : '', /*#__PURE__*/_react.default.createElement(_TestComponent.TestQuestionPanel, {
        className: "question-view-study-game",
        appId: appInfo.id,
        topicId: this.state.topicId,
        gameType: _config.default.TEST_GAME,
        testSetting: testSetting.currentSetting
      })), !gameState.isFinish ? /*#__PURE__*/_react.default.createElement(_core.Grid, {
        container: true,
        justify: "center",
        className: "button-game-panel"
      }, /*#__PURE__*/_react.default.createElement(_core.Button, {
        className: isSkip ? "skip-button" : "continue-button",
        onClick: () => {
          onContinue(testSetting.currentSetting);
        }
      }, isSkip ? "Skip" : "Continue")) : '');
    };

    var appInfo = props.appInfo;
    this.state = {
      topicId: props.topicId,
      appInfo: appInfo,
      showGame: false,
      isMobile: props.isMobile
    };
  }

  componentWillReceiveProps(nextProps) {
    // auto show test
    if (this.state.isMobile && this.props.gameState.isLoaded === false && nextProps.gameState.isLoaded === true) {
      this.setState({
        showGame: nextProps.gameState.isLoading == 3 || nextProps.gameState.isLoading == 4 // new game || resume game

      });
    }
  }

  render() {
    var {
      startNewTest: _startNewTest,
      gameState,
      stateInfoState
    } = this.props;
    var appInfo = this.state.appInfo; // contentTest Setting

    var loading = this.state.isMobile && gameState && gameState.isLoading == 2;
    return /*#__PURE__*/_react.default.createElement(_Widgets.MainWidget, null, /*#__PURE__*/_react.default.createElement(_Header.default, null), /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, {
      className: "test-game-panel"
    }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      direction: "row",
      spacing: this.state.isMobile ? 0 : 3
    }, loading ? /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      fixed: true
    }) : '', /*#__PURE__*/_react.default.createElement(_core.Grid, {
      item: true,
      sm: 12,
      md: 4,
      className: "left-panel",
      style: this.state.isMobile ? {
        display: this.state.showGame && !gameState.isFinish ? 'none' : ''
      } : {}
    }, gameState.isFinish ? /*#__PURE__*/_react.default.createElement(_EndTest.default, null) : /*#__PURE__*/_react.default.createElement(_TestSettingView.default, {
      topicId: this.state.topicId,
      appInfo: appInfo,
      startNewTest: testSetting => {
        // console.log("Custom Testxxxxx", testSetting);
        var appId = appInfo.id;
        var topicId = this.state.topicId;

        if (appInfo.hasState && stateInfoState.mapCurrentStateInfo[appId]) {
          topicId = stateInfoState.mapCurrentStateInfo[appId].id;
        }

        console.log("appIdappIdappIdappId", appId, 'topicId', topicId, 'testSetting', testSetting);

        _startNewTest(appId, topicId, testSetting);
      },
      showButtonContinue: this.state.isMobile && !this.state.showGame,
      onContinueTest: () => {
        this.setState({
          showGame: true
        });
      }
    })), this.state.isMobile && this.state.showGame && !gameState.isFinish ? /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      onClick: () => {
        this.setState({
          showGame: false
        });
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.ArrowBack, null))) : '', this.renderTest())), /*#__PURE__*/_react.default.createElement(_Footer.default, null), /*#__PURE__*/_react.default.createElement(_Dialog.ShowImage, null), appInfo.hasState ? /*#__PURE__*/_react.default.createElement(_SelectStatePopup.default, {
      appInfo: appInfo,
      openPopupChangeState: false
    }) : '');
  }

}

var mapStateToProps = (state, ownProps) => {
  return Object.assign({
    topicReducer: state.topicReducer,
    gameState: state.gameState,
    testSetting: state.testSettingState,
    stateInfoState: state.stateInfoState
  }, ownProps);
};

var mapDispatchToProps = dispatch => ({
  startNewTest: (appId, topicId, testSetting) => dispatch((0, _game.startNewExamTest)({
    appId: appId,
    topicId: topicId,
    setting: testSetting,
    gameType: _config.default.TEST_GAME
  })),
  onContinue: testSetting => dispatch((0, _game.onContinue)(testSetting))
});

var mapStateToPropsMain = (state, ownProps) => {
  return Object.assign({
    appInfoState: state.appInfoState
  }, ownProps);
};

var mapDispatchToPropsMain = dispatch => ({
  getAppInfo: appNameId => dispatch((0, _actions.getAppInfo)(appNameId))
});

var TestView = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TestViewUI);

var _default = (0, _reactRedux.connect)(mapStateToPropsMain, mapDispatchToPropsMain)(TestViewScreen);

exports.default = _default;