"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestProgressPanel = exports.TestQuestionPanel = void 0;

var _core = require("@material-ui/core");

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _QuestionContentPanel = _interopRequireWildcard(require("../../components/QuestionContentPanel"));

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _Choice = _interopRequireDefault(require("../../models/Choice"));

var _QuestionX = _interopRequireDefault(require("../../models/QuestionX"));

var _actions = require("../../redux/actions");

var _game = require("../../redux/actions/game");

var _game2 = require("../../redux/reducers/game");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var arrayIndex = new Array();

var TestQuestionPanelUI = (_ref) => {
  var {
    initial = 0,
    questionProgress = {},
    className = "",
    loadGame = () => {// console.log("vkl");
    },
    gameType = _config.default.TEST_GAME,
    gameState = _game2.GameState.init(),
    appId,
    topicId,
    index = 0,
    onBookmark,
    testSetting,
    theme
  } = _ref;
  // const theme = useTheme();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm')); // console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTEST GAME GameState ", gameState, 'testSetting', testSetting);

  (0, _react.useEffect)(() => {
    // console.log("FIRST LOAD", appId, topicId, gameType, loadGame);
    loadGame({
      appId: appId,
      topicId: topicId,
      gameType: gameType,
      setting: testSetting
    });
  }, [loadGame, appId, topicId, gameType, testSetting]);
  var currentQuestion = gameState.currentQuestion;

  if (!questionProgress) {
    questionProgress = {};
  }

  var loading = gameState.isLoading == 1 || gameState.isLoading == 2;

  if (!currentQuestion || loading) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      color: null
    });
  }

  var questions = [currentQuestion]; // console.log("TEST game state ", gameState);

  if (gameState.isFinish) {
    questions = gameState.questions.sort((a, b) => a.index - b.index);
  }

  if (questions.length === 0) {
    return /*#__PURE__*/_react.default.createElement("div", null, "Empty!");
  }

  if (gameState.questions.length > 0 && arrayIndex.length == 0) {
    for (var i = 0; i < gameState.questions.length; i++) {
      arrayIndex.concat(i);
      index = i;
    }
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "questions-panel" + (className ? " " + className : "") + (gameState.isFinish ? " end-game" : ""),
    style: gameState.isFinish && !isMobile ? {
      maxHeight: 500
    } : {}
  }, questions.map(question => {
    if (questionProgress[question.id]) {
      question.progress = questionProgress[question.id];
    } // if (!question.progress) {
    //     question.progress = {};
    // }


    return /*#__PURE__*/_react.default.createElement(QuestionItem, {
      question: question,
      key: 'question-item-' + question.id,
      index: question.index,
      onBookmark: onBookmark
    });
  }));
};

var QuestionItem = (_ref2) => {
  var {
    question = new _QuestionX.default(),
    index = 0,
    onBookmark
  } = _ref2;
  // question.answers.forEach(element => {
  //     mapAnswerResult[element] = true;
  // });
  var listAnswer = question.choices;
  var [openCollapse, setOpenCollapse] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    setOpenCollapse(false);
  }, [question]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "question-item-panel"
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "center",
    className: "question-header-panel"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "q-title"
  }, "Question ", index + 1, ":"), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      'marginLeft': 'auto'
    },
    onClick: () => {
      onBookmark(question);
    }
  }, question.progress.bookmark ? /*#__PURE__*/_react.default.createElement(_icons.Favorite, {
    style: {
      'color': '#aaa'
    }
  }) : /*#__PURE__*/_react.default.createElement(_icons.FavoriteBorder, {
    style: {
      'color': '#aaa'
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "question-content"
  }, /*#__PURE__*/_react.default.createElement(_QuestionContentPanel.default, {
    content: question.question,
    image: question.image,
    type: _QuestionContentPanel.TextContentType.question
  })), question.paragraphId && question.paragraphId > -1 && question.paragraphContent ? /*#__PURE__*/_react.default.createElement("div", {
    className: "question-paragraph"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      marginBottom: "10px"
    },
    variant: "outlined",
    color: "primary",
    onClick: () => {
      setOpenCollapse(!openCollapse);
    }
  }, openCollapse ? "Hidden" : "Read more"), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    style: {
      color: '#555',
      paddingBottom: "10px"
    },
    in: openCollapse
  }, /*#__PURE__*/_react.default.createElement(_QuestionContentPanel.default, {
    content: question.paragraphContent,
    type: _QuestionContentPanel.TextContentType.explanation
  }))) : '', /*#__PURE__*/_react.default.createElement(ChoicesPanel, {
    listAnswer: listAnswer,
    questionId: question.id,
    questionStatus: question.questionStatus,
    explanation: question.explanation
  }));
};

var ChoicesPanelUI = (_ref3) => {
  var {
    questionId = -1,
    listAnswer = [],
    questionStatus = 0,
    explanation = "",
    testSettingState,
    isFinish = false
  } = _ref3;
  var testSetting = testSettingState === null || testSettingState === void 0 ? void 0 : testSettingState.currentSetting;
  var showResult = isFinish || !(questionStatus === _config.default.QUESTION_NOT_ANSWERED) && testSetting && testSetting.instanceFeedback; // console.log("ChoicesPanel XXXXXXXXXXXx showResult", showResult, 'testSetting instanceFeedback', testSetting.instanceFeedback, 'listAnswer', listAnswer);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "choices-panel"
  }, listAnswer.map((choice, index) => {
    return /*#__PURE__*/_react.default.createElement(AnswerButton, {
      index: index,
      key: 'answer-item-' + questionId + '-' + index,
      showResult: showResult,
      explanation: explanation,
      choice: Object.assign({}, choice)
    });
  }));
};

var AnswerButtonUI = (_ref4) => {
  var {
    index = 0,
    showResult = false,
    choice = new _Choice.default(),
    explanation = "",
    onChoiceSelected = () => {}
  } = _ref4;
  // console.log("55555555555555", choice);
  // useEffect(() => {
  //     console.log("choice ccccccc ", choice);
  // }, [choice])
  var showCss = "";

  if (showResult) {
    if (choice.selected) {
      showCss = choice.isCorrect ? " correct" : " wrong";
    } else {
      showCss = choice.isCorrect ? " correct" : "";
    }
  } // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&", showResult, choice.isCorrect, 111, choice.selected);


  return /*#__PURE__*/_react.default.createElement("button", {
    className: "answer-button" + (!showResult && choice.selected ? " selected" : "") + showCss + (_config.default.TEST_MODE && choice.isCorrect ? " test-true" : ""),
    onClick: () => {
      if (showResult) {
        return;
      }

      onChoiceSelected(choice);
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "answered-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: 'answer-button-title'
  }, String.fromCharCode(65 + index)), /*#__PURE__*/_react.default.createElement("div", {
    className: 'answer-button-content'
  }, /*#__PURE__*/_react.default.createElement(_QuestionContentPanel.default, {
    content: choice.content,
    type: _QuestionContentPanel.TextContentType.answer
  }))), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    className: "explanation",
    in: !!showResult && !!choice.isCorrect
  }, /*#__PURE__*/_react.default.createElement("p", null, "Explanation:"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_QuestionContentPanel.default, {
    content: explanation,
    type: _QuestionContentPanel.TextContentType.explanation
  }))));
};

var TestProgressPanelUI = (_ref5) => {
  var {
    gameState
  } = _ref5;
  var progress = gameState.progress;
  var size = progress.done / progress.total * 100;
  var loading = gameState.isLoading == 1 || gameState.isLoading == 2;

  if (loading) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      color: null
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "test-progress-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "progress-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "content-line-progress",
    style: {
      left: 'calc(' + size + '% - 25px)'
    }
  }, progress.done, " / ", progress.total), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      visibility: 'hidden'
    }
  }, "X"), /*#__PURE__*/_react.default.createElement("div", {
    className: "parent-content-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "content-progress",
    style: {
      width: size + '%'
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      visibility: 'hidden'
    }
  }, "X"))));
};

var mapTestSettingStateToProps = state => {
  // console.log("mapTestSettingStateToProps ", Object.assign({}, state.gameState));
  return {
    testSettingState: state.testSettingState,
    isFinish: state.gameState.isFinish
  };
}; // const mapTestSettingStateToProps = (state: AppState) => ({
//     testSettingState: state.testSettingState,
//     isFinish: state.gameState.isFinish
// })


var mapStateToProps = (state, ownProps) => Object.assign({
  gameState: state.gameState,
  cardProgressReducer: state.cardProgressReducer
}, ownProps // user: state.user
);

var mapDispatchToProps = {
  loadGame: params => (0, _game.loadGame)(params),
  onChoiceSelected: choice => (0, _game.onSelectedChoice)(choice),
  onBookmark: question => (0, _actions.onBookmark)(question)
};
var AnswerButton = (0, _reactRedux.connect)(null, mapDispatchToProps)(AnswerButtonUI);
var TestQuestionPanel = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withTheme)(TestQuestionPanelUI));
exports.TestQuestionPanel = TestQuestionPanel;
var ChoicesPanel = (0, _reactRedux.connect)(mapTestSettingStateToProps, null)(ChoicesPanelUI);
var TestProgressPanel = (0, _reactRedux.connect)(mapStateToProps, null)(TestProgressPanelUI);
exports.TestProgressPanel = TestProgressPanel;