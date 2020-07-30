"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressQuestionTS = exports.AnswerButtonTS = exports.ChoicesPanelTS = exports.QuestionItemTS = exports.QuestionsPanelTS = exports.ReviewQuestionPanel = void 0;

var _core = require("@material-ui/core");

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _QuestionContentPanel = _interopRequireWildcard(require("../../components/QuestionContentPanel"));

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _QuestionProgress = _interopRequireDefault(require("../../models/QuestionProgress"));

var _actions = require("../../redux/actions");

var _game = require("../../redux/actions/game");

var mapStateToProps = (state, ownProps) => Object.assign({
  gameState: state.gameState,
  cardProgressReducer: state.cardProgressReducer
}, ownProps // user: state.user
);

var mapDispatchToProps = {
  loadGame: props => (0, _game.loadGame)(props),
  onBookmark: question => (0, _actions.onBookmark)(question)
};
var mapDispatchReviewQuestionToProps = {
  onBookmark: question => (0, _actions.onBookmark)(question)
};
var mapDispatchChoiceToProps = {
  onChoiceSelected: choice => (0, _game.onSelectedChoice)(choice)
};

var ReviewQuestionPanelUI = (_ref) => {
  var {
    questions,
    questionProgress,
    onBookmark,
    appInfo
  } = _ref;

  if (!questionProgress) {
    questionProgress = new Map();
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: 'questions-panel'
  }, questions.map((question, index) => {
    var _a;

    if (questionProgress.has(question.id)) {
      question.progress = (_a = questionProgress.get(question.id)) !== null && _a !== void 0 ? _a : new _QuestionProgress.default();
    }

    return /*#__PURE__*/_react.default.createElement(QuestionItemTS, {
      question: question,
      key: 'question-item-' + question.id,
      index: index,
      onBookmark: onBookmark
    });
  }));
};

var QuestionsPanelx = (_ref2) => {
  var {
    questionProgress,
    className,
    topicId,
    loadGame,
    gameState,
    gameType,
    currentIndex,
    onBookmark,
    cardProgressReducer,
    questionIds,
    appInfo
  } = _ref2;
  // console.log("QuestionsPanelx QuestionsPanelx QuestionsPanelx cards", Object.assign({}, questionIds));
  (0, _react.useEffect)(() => {
    loadGame({
      appId: appInfo.id,
      topicId: topicId,
      gameType: gameType,
      questionIds: questionIds
    });
  }, [loadGame, appInfo, topicId, gameType, questionIds]);
  console.log("************** ", gameState.isLoading);

  if (gameState.isLoading == 1 || gameState.isLoading == 2) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      color: null
    });
  }

  if (gameType === _config.default.REVIEW_GAME) {
    var _questions = gameState.questions;

    if (!_questions) {
      return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
        color: null
      });
    } // console.log("RENDER OK ", questions);


    return /*#__PURE__*/_react.default.createElement("div", {
      className: "questions-panel" + (className ? " " + className : "")
    }, _questions.map((question, index) => {
      return /*#__PURE__*/_react.default.createElement(QuestionItemTS, {
        question: question,
        key: 'question-item-' + question.id,
        index: index,
        onBookmark: onBookmark
      });
    }));
  }

  var currentQuestion = gameState.currentQuestion;

  if (!questionProgress) {
    questionProgress = new Map();
  } // console.log("check check check ", gameState);


  if (!currentQuestion) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      color: null
    });
  }

  if (!currentIndex) {
    currentIndex = 0;
  }

  var questions = [currentQuestion];
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "questions-panel" + (className ? " " + className : "")
  }, questions.map((question, index) => {
    var _a;

    if (questionProgress.has(question.id)) {
      question.progress = (_a = questionProgress.get(question.id)) !== null && _a !== void 0 ? _a : new _QuestionProgress.default();
    }

    return /*#__PURE__*/_react.default.createElement(QuestionItemTS, {
      question: question,
      key: 'question-item-' + question.id,
      index: currentIndex,
      onBookmark: onBookmark
    });
  }));
};

var QuestionItemTS = (_ref3) => {
  var {
    question,
    index,
    onBookmark
  } = _ref3;
  // question.answers.forEach(element => {
  //     mapAnswerResult[element] = true;
  // });
  // console.log(111, question);
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
  }, "Question ", index + 1, ":"), /*#__PURE__*/_react.default.createElement(ProgressQuestionTS, {
    progress: question.progress.progress,
    questionId: question.id
  }), /*#__PURE__*/_react.default.createElement("span", {
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
  }))) : '', question.correctNums > 1 ? /*#__PURE__*/_react.default.createElement("div", {
    className: "select-multiple-question-title"
  }, "Selected: ", question.getNumberChoiceSelected(), "/", question.correctNums) : null, /*#__PURE__*/_react.default.createElement(ChoicesPanelTS, {
    listAnswer: listAnswer,
    questionId: question.id,
    questionStatus: question.questionStatus,
    explanation: question.explanation
  }));
};

exports.QuestionItemTS = QuestionItemTS;

var ChoicesPanelTS = (_ref4) => {
  var {
    questionId,
    listAnswer,
    questionStatus,
    explanation
  } = _ref4;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "choices-panel"
  }, listAnswer.map((choice, index) => {
    return /*#__PURE__*/_react.default.createElement(AnswerButtonTS, {
      index: index,
      answer: choice.content,
      key: 'answer-item-' + questionId + '-' + index,
      showResult: questionStatus === _config.default.QUESTION_NOT_ANSWERED ? false : true,
      explanation: explanation,
      result: choice.isCorrect,
      selected: choice.selected,
      choice: choice
    });
  }));
};

exports.ChoicesPanelTS = ChoicesPanelTS;

var AnswerButton2 = (_ref5) => {
  var {
    index,
    answer,
    explanation,
    result,
    selected,
    choice,
    onChoiceSelected,
    showResult
  } = _ref5;
  var showCss = ""; // console.log(")))))))))))))))) showResult", showResult, 'selected', selected, 'result', result);

  if (showResult) {
    if (selected) {
      showCss = result ? " correct" : " wrong";
    } else {
      showCss = result ? " correct" : "";
    }
  }

  return /*#__PURE__*/_react.default.createElement("button", {
    className: "answer-button" + (!showResult && selected ? " selected" : "") + showCss + (_config.default.TEST_MODE && result ? " test-true" : ""),
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
    content: answer,
    type: _QuestionContentPanel.TextContentType.answer
  }))), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    className: "explanation",
    in: showResult && result
  }, /*#__PURE__*/_react.default.createElement("p", null, "Explanation:"), /*#__PURE__*/_react.default.createElement(_QuestionContentPanel.default, {
    content: explanation,
    type: _QuestionContentPanel.TextContentType.explanation
  })));
};

var ProgressQuestionTS = (_ref6) => {
  var {
    progress,
    questionId
  } = _ref6;

  if (!progress) {
    return /*#__PURE__*/_react.default.createElement("div", null);
  }

  return /*#__PURE__*/_react.default.createElement("span", null, progress.map((item, index) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      key: 'ProgressQuestion-item-' + questionId + '-' + index
    }, item === 1 ? /*#__PURE__*/_react.default.createElement(_icons.Done, {
      style: {
        'color': 'green',
        'fontSize': '16px'
      }
    }) : /*#__PURE__*/_react.default.createElement(_icons.Clear, {
      style: {
        'color': 'red',
        'fontSize': '16px'
      }
    }));
  }));
};

exports.ProgressQuestionTS = ProgressQuestionTS;
var AnswerButtonTS = (0, _reactRedux.connect)(null, mapDispatchChoiceToProps)(AnswerButton2);
exports.AnswerButtonTS = AnswerButtonTS;
var QuestionsPanelTS = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(QuestionsPanelx);
exports.QuestionsPanelTS = QuestionsPanelTS;
var ReviewQuestionPanel = (0, _reactRedux.connect)(null, mapDispatchReviewQuestionToProps)(ReviewQuestionPanelUI);
exports.ReviewQuestionPanel = ReviewQuestionPanel;