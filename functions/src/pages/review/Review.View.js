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

var _Image = _interopRequireDefault(require("../../components/Image"));

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _ReviewProgress = _interopRequireDefault(require("../../models/ReviewProgress"));

var _Utils = require("../../models/Utils");

var _actions = require("../../redux/actions");

var _cardProgress = require("../../redux/actions/cardProgress");

require("../../resources/scss/game.scss");

require("../../resources/scss/main.scss");

require("../../resources/scss/review.scss");

var _utils = require("../../utils");

var _Game = require("../game/Game.ViewTS");

var _reactGa = _interopRequireDefault(require("react-ga"));

var ReviewViewScreen = (_ref) => {
  var {
    getAppInfo,
    appInfoState,
    theme
  } = _ref;
  var {
    appNameId,
    screen
  } = (0, _reactRouterDom.useParams)();
  var topicId = -1;

  if (screen) {
    var offset = screen.lastIndexOf('-') + 1;
    topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
  }

  appNameId = appNameId !== null && appNameId !== void 0 ? appNameId : ''; // const theme = useTheme();

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
        title: appInfo.title,
        description: appInfo.description,
        keywords: appInfo.keywords,
        icon: appInfo.icon
      });

      _reactGa.default.pageview('/reviewpage/' + appInfo.title);
    }
  }, [appInfo]);

  if (!appInfo) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  return /*#__PURE__*/_react.default.createElement(ReviewView, {
    appInfo: appInfo,
    topicId: topicId,
    isMobile: isMobile
  });
};

class ReviewViewScreenUI extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      appInfo: props.appInfo,
      levelId: -1,
      questionIds: null,
      showReview: false,
      isMobile: props.isMobile
    };
  }

  componentDidMount() {
    this.props.getAllCardProgress();
  }

  componentWillReceiveProps(nextProps) {
    if (!(0, _utils.checkLoadedReceiveProps)(this.props.cardProgressReducer, nextProps.cardProgressReducer)) {
      var reviewProgress = getReviewProgress(this.props.cardProgressReducer);

      if (this.state.levelId == -1) {
        var levelIdSelected = reviewProgress.getCurrentSelectedId();
        this.setState({
          levelId: levelIdSelected,
          questionIds: reviewProgress.getQuestionsIdsByLevelId(levelIdSelected)
        });
      }
    }
  }

  render() {
    var reviewProgress = getReviewProgress(this.props.cardProgressReducer);

    if (!reviewProgress) {
      return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
        color: null
      });
    }

    var levelIdSelected = -1;
    var questionIds = new Array();

    if (this.state.levelId == -1) {
      levelIdSelected = reviewProgress.getCurrentSelectedId();
      questionIds = reviewProgress.getQuestionsIdsByLevelId(levelIdSelected); // this.state.levelId = levelIdSelected;
      // this.state.questionIds = questionIds;
      // this.setState({
      //     levelId: levelIdSelected,
      //     questionIds: questionIds
      // })
    } else {
      levelIdSelected = this.state.levelId;
      questionIds = this.state.questionIds;
    }

    console.log("levelSelected ", levelIdSelected, 'questionIds', questionIds);
    return /*#__PURE__*/_react.default.createElement(_Widgets.MainWidget, {
      className: 'review-page'
    }, /*#__PURE__*/_react.default.createElement(_Header.default, null), /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, {
      className: 'review-page-content' + (this.state.isMobile && this.state.showReview ? ' show-review' : '')
    }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      direction: "row",
      spacing: this.state.isMobile ? 0 : 3
    }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
      className: "left-panel",
      item: true,
      xs: 12,
      sm: 12,
      md: 4,
      style: this.state.isMobile ? {
        display: this.state.showReview ? 'none' : 'block'
      } : {}
    }, /*#__PURE__*/_react.default.createElement(LevelQuestionPanel, {
      activeId: levelIdSelected,
      gameProgress: reviewProgress,
      onSelected: item => {
        this.setState({
          levelId: item.id,
          questionIds: reviewProgress.getQuestionsIdsByLevelId(item.id),
          showReview: true
        });
      }
    })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
      className: "right-panel",
      item: true,
      xs: 12,
      sm: 12,
      md: 8,
      style: this.state.isMobile ? {
        display: !this.state.showReview ? 'none' : 'block'
      } : {}
    }, this.state.isMobile && this.state.showReview ? /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      onClick: () => {
        this.setState({
          showReview: false
        });
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.ArrowBack, null)), /*#__PURE__*/_react.default.createElement("span", null, _config.default.LEVEL_QUESTION.map(item => {
      if (this.state.levelId === item.id) {
        return item.name;
      }

      return '';
    }))) : '', questionIds.length > 0 ? /*#__PURE__*/_react.default.createElement(_Game.QuestionsPanelTS, {
      appInfo: this.state.appInfo,
      className: "question-view-study-game",
      examId: -1,
      gameType: _config.default.REVIEW_GAME,
      questionIds: questionIds
    }) : /*#__PURE__*/_react.default.createElement("div", {
      className: "empty-question-panel"
    }, "Empty question!") // <ReviewQuestionPanel questions={questions} questionProgress={questionProgress} />
    ))), /*#__PURE__*/_react.default.createElement(_Footer.default, null), /*#__PURE__*/_react.default.createElement(_Dialog.ShowImage, null));
  }

}

var LevelQuestionPanelUI = props => {
  var _a; // const [gameProgress, setGameProgress] = useState(props?.gameProgress);
  // useEffect(() => {
  //     let gameProgress = new GameProgress(Object.values(props.cardProgressReducer.data));
  //     setGameProgress(gameProgress);
  //     console.log("LevelQuestionPanelUI props.cardProgressReducer", gameProgress);
  // }, [props.cardProgressReducer]);


  var gameProgress = props === null || props === void 0 ? void 0 : props.gameProgress;
  var onSelected = (_a = props.onSelected) !== null && _a !== void 0 ? _a : function () {
    console.error("onSelected null");
  }; // console.log("LevelQuestionPanel gameProgress", gameProgress);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "level-question-panel"
  }, _config.default.LEVEL_QUESTION.map(item => {
    var totalQuestion = gameProgress ? gameProgress.getTotalQuestionByLevelId(item.id) : 0;
    return /*#__PURE__*/_react.default.createElement(LevelQuestionItem, {
      active: props.activeId === item.id,
      item: item,
      totalQuestion: totalQuestion,
      key: 'level-question-item-' + item.id,
      onSelected: onSelected
    });
  }));
};

var LevelQuestionItem = (_ref2) => {
  var {
    item,
    totalQuestion,
    active,
    onSelected
  } = _ref2;
  totalQuestion = totalQuestion ? totalQuestion : 0;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "level-question-item" + (active ? " active" : ""),
    onClick: () => onSelected(item)
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      'width': 'calc(100% - 40px)'
    }
  }, /*#__PURE__*/_react.default.createElement("label", null, item.name), /*#__PURE__*/_react.default.createElement("div", {
    className: "question-num"
  }, totalQuestion, " questions")), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      'width': '40px'
    }
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    src: item.image,
    width: '25px',
    height: "25px"
  }))));
};

function getReviewProgress(cardProgressState) {
  if (cardProgressState && cardProgressState.data) {
    return new _ReviewProgress.default(Object.values(cardProgressState.data));
  }

  return null;
}

var mapStateToProps = (state, ownProps) => {
  console.log("CHANGE CHANGE CHANGE ", Object.assign({}, state));
  return Object.assign({
    cardReducer: state.cardReducer,
    cardProgressReducer: state.cardProgressReducer
  }, ownProps);
};

var mapDispatchToProps = dispatch => ({
  getAllCardProgress: () => dispatch((0, _cardProgress.getAllCardProgress)())
});

var LevelQuestionPanel = (0, _reactRedux.connect)(mapStateToProps, null)(LevelQuestionPanelUI);
var ReviewView = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ReviewViewScreenUI);

var mapStateToPropsMain = (state, ownProps) => {
  return Object.assign({
    appInfoState: state.appInfoState
  }, ownProps);
};

var mapDispatchToPropsMain = dispatch => ({
  getAppInfo: appNameId => dispatch((0, _actions.getAppInfo)(appNameId))
});

var _default = (0, _reactRedux.connect)(mapStateToPropsMain, mapDispatchToPropsMain)((0, _styles.withTheme)(ReviewViewScreen));

exports.default = _default;