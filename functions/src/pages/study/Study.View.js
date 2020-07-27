"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onScrollHoz = onScrollHoz;
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

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _QuestionX = _interopRequireDefault(require("../../models/QuestionX"));

var _Utils = require("../../models/Utils");

var _actions = require("../../redux/actions");

var _card = require("../../redux/actions/card");

var _game = require("../../redux/actions/game");

var _topic = require("../../redux/actions/topic");

require("../../resources/scss/game.scss");

require("../../resources/scss/main.scss");

require("../../resources/scss/study.scss");

var _routes = _interopRequireDefault(require("../../routes"));

var _utils = require("../../utils");

var _Game = require("../game/Game.ViewTS");

var _reactGa = _interopRequireDefault(require("react-ga"));

var questionsX = new Map();

var StudyViewScreen = (_ref) => {
  var {
    getAppInfo,
    appInfoState
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
        title: 'Study - ' + appInfo.title,
        description: appInfo.description,
        keywords: appInfo.keywords,
        icon: appInfo.avatar
      });

      _reactGa.default.pageview('/studypage/' + appInfo.title);
    }
  }, [appInfo]);

  if (!appInfo) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  return /*#__PURE__*/_react.default.createElement(StudyView, {
    appInfo: appInfo,
    topicId: topicId,
    isMobile: isMobile
  });
};

class StudyViewScreenUI extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.topicId,
      appInfo: props.appInfo,
      topics: null,
      currentTopic: null,
      currentIndex: 0,
      showGame: false,
      showAlertName: '',
      isMobile: props.isMobile
    };
    this.props.getTopicsByParentId(this.state.id);
  }

  checkLoaded(prevState, nextState) {
    return prevState.loading === true && nextState.loading === false && nextState.data || prevState.loading === false && !(0, _utils.isObjEmpty)(prevState.data) && nextState.loading === false && !(0, _utils.isObjEmpty)(nextState.data);
  }

  componentWillReceiveProps(nextProps) {
    var _a;

    console.log('componentWillReceiveProps nextProps', Object.assign({}, this.props), Object.assign({}, nextProps));
    var topicState = nextProps.topicReducer;

    if (this.checkLoaded(this.props.topicReducer, topicState)) {
      // console.log('componentWillReceiveProps nextProps', Object.values(topicState.data));
      var temp = Object.values(topicState.data);
      var parts = new Array();
      var playingIndex = -1;
      temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach(topic => {
        if (topic.parentId === this.state.id) {
          if (topic.progress.playing === true) {
            playingIndex = parts.length;
          }

          parts.push(topic);
        }
      });
      console.log('parts', parts, 'playingIndex', playingIndex);

      if (parts.length > 0) {
        if (playingIndex < 0) {
          playingIndex = 0;
        }

        parts[playingIndex].progress.lock = false;
        parts[playingIndex].progress.playing = true; // console.log("3333333 updateTopicsProgress ", parts[playingIndex].progress);

        this.props.updateTopicsProgress([parts[playingIndex].progress]);
        this.setState({
          topics: parts,
          currentIndex: playingIndex,
          currentTopic: parts[playingIndex]
        });
      } else {
        console.log("END GAME");
      }
    } // console.log("nextProps.topicReducer xxxx ", nextProps.topicReducer, " ------------------ nextProps.gameState", nextProps.gameState);
    // TODO: check next topic 


    if (((_a = nextProps.gameState) === null || _a === void 0 ? void 0 : _a.isFinish) === true) {
      this.setState({
        showGame: nextProps.gameState.isFinish
      }); //     // alert("done");
      //     console.log("finish currentIndex", this.state.currentIndex, 'topics', this.state.topics);
      //     let newIndex = this.state.currentIndex + 1;
      //     if(newIndex < this.state.topics.length){
      //         let currentTopic: Topic = this.state.topics[newIndex];
      //         this.activeTopic(currentTopic, newIndex);
      //     } else {
      //         console.log("END GAME");
      //     }
    }
  }

  activeTopic(currentTopic, index) {
    var mapTopicProgress = {};
    this.state.topics.forEach(topic => {
      if (topic.progress.playing === true) {
        topic.progress.playing = false;
        mapTopicProgress[topic.id] = topic.progress;
      }
    });
    currentTopic.progress.lock = false;
    currentTopic.progress.playing = true;
    mapTopicProgress[currentTopic.id] = currentTopic.progress;
    var listP = Object.values(mapTopicProgress);
    this.props.updateTopicsProgress(listP);
    this.setState({
      currentIndex: index,
      currentTopic: currentTopic,
      showGame: true
    });
  }

  componentDidUpdate() {
    // Check open next topic part
    var currentTopic = this.state.currentTopic;
    var topics = this.state.topics; // console.log("this.state.currentTopic", currentTopic && topics ? topics.length : null, currentTopic, 'getPercentComplete', currentTopic ? currentTopic.getPercentComplete() : null, 'current index', this.state.currentIndex);

    if (currentTopic && topics && topics.length > this.state.currentIndex + 1 && currentTopic.getPercentComplete() >= _config.default.NEXT_PART_PROGRESS && topics[this.state.currentIndex + 1].progress.lock === true) {
      // console.log("OK", topics[this.state.currentIndex + 1]);
      var i = this.state.currentIndex + 1;
      topics[i].progress.lock = false;
      this.setState({
        topics: topics
      }); // console.log("22222222 updateTopicsProgress ", topics[i].progress);

      this.props.updateTopicsProgress([topics[i].progress]);
    }
  }

  render() {
    var _a, _b, _c, _d, _e;

    var {
      onContinue
    } = this.props;
    var currentTopic = this.state.currentTopic;
    var currentQuestionIndex = 0;
    var gameState = this.props.gameState;
    console.log("currentTopic", currentTopic);

    if (gameState) {
      var topicId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;

      if (!questionsX.has(topicId) || ((_b = questionsX.get(topicId)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
        // console.log("gameState.questions topicId", topicId, 'questions', gameState.questions);
        questionsX.set(topicId, gameState.questions.map(item => Object.assign({}, item)));
      } // console.log("SIZE ", questionsX.size);


      if (questionsX.size > 0) {
        // console.log("ngao ngao ngao");
        var currentQuestionId = (_d = (_c = gameState.currentQuestion) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : -1; // console.log("currentQuestionId ", currentQuestionId);

        if (currentQuestionId) {
          var listQ = (_e = questionsX.get(topicId)) !== null && _e !== void 0 ? _e : new Array();
          currentQuestionIndex = listQ ? listQ.findIndex(q => q.id === currentQuestionId) : 0;
        }
      }
    }

    var congratulationTopic = !!gameState.isFinish; // console.log("congratulationTopiccongratulationTopiccongratulationTopic", gameState);

    return /*#__PURE__*/_react.default.createElement(_Widgets.MainWidget, {
      className: this.state.isMobile ? " mobile" : ""
    }, /*#__PURE__*/_react.default.createElement(_Header.default, null), /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, {
      className: "study-game-panel"
    }, !!this.state.showAlertName ? /*#__PURE__*/_react.default.createElement(CongratulationAlert, {
      topicName: this.state.showAlertName,
      onClose: () => this.setState({
        showAlertName: ''
      })
    }) : null, /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      direction: "row",
      spacing: this.state.isMobile ? 0 : 3
    }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
      item: true,
      xs: 12,
      sm: 12,
      md: 5,
      lg: 4,
      className: "left-panel",
      style: this.state.isMobile ? {
        display: this.state.showGame ? 'none' : ''
      } : {}
    }, /*#__PURE__*/_react.default.createElement(TopicInfoPanel, {
      topicId: currentTopic ? currentTopic.parentId : -1,
      appInfo: this.state.appInfo,
      isMobile: this.state.isMobile
    }), /*#__PURE__*/_react.default.createElement(TopicTreePanel, {
      parentId: this.state.id,
      currentQuestionId: currentTopic ? currentTopic.id : null,
      onChangeTopic: (topic, index) => {
        this.activeTopic(topic, index);
        this.setState({
          showGame: true
        });
      },
      openAlert: topic => {
        this.setState({
          showAlertName: topic.name
        });
      }
    })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
      item: true,
      xs: 12,
      sm: 12,
      md: 7,
      lg: 8,
      className: "right-panel",
      style: this.state.isMobile ? {
        display: this.state.showGame ? '' : 'none'
      } : {}
    }, this.state.isMobile && this.state.showGame ? /*#__PURE__*/_react.default.createElement(_core.Grid, {
      style: {
        borderBottom: '1px solid #ddd'
      },
      container: true,
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      onClick: () => {
        this.setState({
          showGame: false
        });
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.ArrowBack, null)), /*#__PURE__*/_react.default.createElement("span", null, currentTopic ? currentTopic.name : '')) : '', this.renderRightContentPanel(currentTopic, currentQuestionIndex, congratulationTopic, this.state.appInfo), /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      alignItems: "center",
      justify: "center"
    }, /*#__PURE__*/_react.default.createElement(_core.Button, {
      variant: "contained",
      color: "primary",
      className: "next-part-button",
      onClick: () => {
        // console.log("XXXX congratulationTopic ", congratulationTopic);
        if (congratulationTopic) {
          this.onNextPart();
        } else {
          onContinue();
        }
      }
    }, congratulationTopic ? 'Next part' : 'Next Question', "    ", /*#__PURE__*/_react.default.createElement(_icons.ArrowRightAlt, null)))))), !this.state.isMobile || !this.state.showGame ? /*#__PURE__*/_react.default.createElement(FloatingButtonTest, {
      currentTopic: this.state.currentTopic
    }) : '', /*#__PURE__*/_react.default.createElement(_Footer.default, null), /*#__PURE__*/_react.default.createElement(_Dialog.ShowImage, null));
  }

  onNextPart() {
    // let gameState: GameState = this.props.gameState;
    // if(gameState && gameState.isFinish === true){
    // console.log("finish currentIndex", this.state.currentIndex, 'topics', this.state.topics);
    var newIndex = this.state.currentIndex + 1;

    if (newIndex < this.state.topics.length) {
      var currentTopic = this.state.topics[newIndex];
      this.activeTopic(currentTopic, newIndex);
    } else {
      console.log("END GAME");
    } // }

  }

  renderRightContentPanel(currentTopic, currentQuestionIndex, congratulationTopic, appInfo) {
    // console.log("renderRightContentPanel", currentTopic ? currentTopic.getPercentComplete() : null);
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      style: congratulationTopic ? {
        display: 'none'
      } : {}
    }, /*#__PURE__*/_react.default.createElement(QuestionProgressPanel, {
      topic: currentTopic
    }), currentTopic ? /*#__PURE__*/_react.default.createElement(_Game.QuestionsPanelTS, {
      appInfo: appInfo,
      className: "question-view-study-game",
      topicId: currentTopic.id,
      gameType: _config.default.STUDY_GAME,
      currentIndex: currentQuestionIndex
    }) : /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-congratulations-panel",
      style: congratulationTopic ? {} : {
        display: 'none'
      }
    }, /*#__PURE__*/_react.default.createElement("h1", null, "Congratulations!"), /*#__PURE__*/_react.default.createElement("p", null, "You have passed ", currentTopic ? currentTopic.name : '', " with excellent performance"), /*#__PURE__*/_react.default.createElement("div", null)));
  }

}

var CongratulationAlert = (_ref2) => {
  var {
    topicName = "",
    onClose = () => {}
  } = _ref2;
  (0, _react.useEffect)(() => {
    var time = setTimeout(() => {
      onClose();
    }, 5000);
    return () => {
      clearTimeout(time);
    };
  }, [topicName]);
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    justify: "space-between",
    className: "congratulation-alert-panel"
  }, /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", {
    className: "title"
  }, /*#__PURE__*/_react.default.createElement(_icons.LockOpen, {
    width: "100px",
    fontSize: "large"
  }), /*#__PURE__*/_react.default.createElement("span", null, "You must complete previous topic ", /*#__PURE__*/_react.default.createElement("strong", null, topicName), "!")), /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    onClick: () => onClose()
  }, /*#__PURE__*/_react.default.createElement(_icons.Close, null)));
};

var FloatingButtonTest = (_ref3) => {
  var {
    currentTopic
  } = _ref3;
  var history = (0, _reactRouterDom.useHistory)();

  if (!currentTopic) {
    return null;
  }

  var name = (0, _utils.stringReplaceUrl)(currentTopic.name);
  return /*#__PURE__*/_react.default.createElement(_core.Fab, {
    color: "secondary",
    variant: "extended",
    className: "floating-button-test",
    onClick: () => {
      // history.push(id > -1 ? Routes.TEST_SCREEN + "?appId="+getAppId()+"&id=" + id : Routes.TEST_SCREEN);
      history.push(_routes.default.TEST_SCREEN + '-' + name + '-' + currentTopic.id);
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.Assignment, null), " Test");
};

var QuestionProgressPanelUI = props => {
  var _a, _b, _c; // const theme = useTheme();
  // console.log("QuestionProgressPanelUI props", props, 'theme', theme);


  var topic = props === null || props === void 0 ? void 0 : props.topic;
  var gameState = props === null || props === void 0 ? void 0 : props.gameState;
  console.log("topic", topic, 'gameState', gameState);

  if (!gameState || !(gameState === null || gameState === void 0 ? void 0 : gameState.isLoaded)) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var topicId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;
  var currentQuestion = (_b = gameState.currentQuestion) !== null && _b !== void 0 ? _b : new _QuestionX.default();
  var listQuestion = (_c = questionsX.get(topicId)) !== null && _c !== void 0 ? _c : new Array();
  var loading = gameState.isLoading == 1 || gameState.isLoading == 2;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "question-progress-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-name"
  }, /*#__PURE__*/_react.default.createElement(_icons.ViewList, null), " ", /*#__PURE__*/_react.default.createElement("span", null, topic ? topic.name : 'Topic name')), /*#__PURE__*/_react.default.createElement("div", {
    className: "scroll-panel function-scroll-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "list-question-panel"
  }, loading ? /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null) : listQuestion.map((item, index) => {
    return /*#__PURE__*/_react.default.createElement(QuestionItemProgress, {
      index: index,
      key: 'question-item-right-' + item.id,
      question: item,
      currentQuestion: currentQuestion
    });
  }))));
};

var QuestionItemProgress = (_ref4) => {
  var {
    index,
    question,
    currentQuestion
  } = _ref4;

  if (question.id === currentQuestion.id && currentQuestion.questionStatus !== _config.default.QUESTION_NOT_ANSWERED) {
    question.questionStatus = currentQuestion.questionStatus;
    question.progress.boxNum = currentQuestion.progress.boxNum;
  }

  var progress = question.progress;
  var statusStr = '';
  var borderCurrent = "";

  if (question.id === currentQuestion.id) {
    borderCurrent = " border-current-question";
  }

  if (question.questionStatus === _config.default.QUESTION_ANSWERED_CORRECT) {
    statusStr = ' correct';
  } else if (question.questionStatus === _config.default.QUESTION_ANSWERED_INCORRECT) {
    statusStr = ' incorrect';
  }

  var icon;

  if (progress.boxNum === 1) {
    icon = /*#__PURE__*/_react.default.createElement(_icons.Done, {
      className: "icon"
    });
  } else if (progress.boxNum > 1) {
    icon = /*#__PURE__*/_react.default.createElement(_icons.DoneAll, {
      className: "icon"
    });
  }

  (0, _react.useEffect)(() => {
    if (question.id === currentQuestion.id) {
      onScrollHoz('function-scroll-panel', index);
    }
  }, [question, currentQuestion]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "question-item" + statusStr + borderCurrent
  }, /*#__PURE__*/_react.default.createElement("span", null, index + 1), icon);
};

function onScrollHoz(parentClass, index) {
  var parentsElement = document.getElementsByClassName(parentClass);
  var scrollLeft = index * 60;
  console.log('onScrollHoz ', scrollLeft, parentsElement.length);

  for (var _index = 0; _index < parentsElement.length; _index++) {
    var parentElement = parentsElement[_index];
    parentElement.scrollTo({
      left: scrollLeft
    });
  }
}

var TopicInfoPanelUI = (_ref5) => {
  var {
    topicId = -1,
    getTopicById,
    topicState,
    appInfo,
    isMobile
  } = _ref5;
  (0, _react.useEffect)(() => {
    getTopicById(topicId);
  }, [topicId]);
  var history = (0, _reactRouterDom.useHistory)();

  if (topicState.loading === true || !topicState.data || (0, _utils.isObjEmpty)(topicState.data)) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var topic = topicState.data[topicId];

  if (!topic) {
    return /*#__PURE__*/_react.default.createElement("div", null);
  }

  if (isMobile) {
    return /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      onClick: () => {
        history.push("/" + appInfo.appNameId);
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.ArrowBack, null)), /*#__PURE__*/_react.default.createElement("span", null, topic.name));
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-info-panel"
  }, topic.name);
};

var TopicTreePanelUI = (_ref6) => {
  var {
    topicState,
    parentId,
    currentQuestionId,
    onChangeTopic,
    resetTopicProgress,
    openAlert
  } = _ref6;
  var [dialogInfo, setDialogInfo] = (0, _react.useState)(_Dialog.DialogInfo.init()); // console.log("TopicTreePanelUI props", Object.assign({}, props));

  if (!topicState || topicState.loading === true || !topicState.data) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var topics = [];
  var temp = Object.values(topicState.data);
  temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach(topic => {
    if (parentId === topic.parentId) {
      topics.push(topic);
    }
  });
  var widgets = [],
      childs = [];
  var count = 0;
  var totalQuestion = 0,
      familiar = 0,
      mastered = 0;
  var lastTopicUnLock = 0;
  console.log("topics", topics); // let mapTopicProgress: any = topicProgressReducer.data;

  topics.forEach((topic, index) => {
    var progress = topic.progress;

    if (progress.lock === false) {
      lastTopicUnLock = index;
    }

    familiar += progress.familiar;
    mastered += progress.mastered;
  });

  var onClickTopic = (topic, index, type) => {
    console.log("onClickTopic topic ", topic, 'type', type);

    if (type === 1) {
      // completed
      setDialogInfo(new _Dialog.DialogInfo({
        title: 'Play again',
        msg: 'Do you want to reset all progress of this part!',
        okText: '',
        cancelText: '',
        onConfirm: result => {
          if (result) {
            //TODO: reset topic
            topic.progress.reset();
            resetTopicProgress(topic.progress);
            onChangeTopic(topic, index);
          }
        }
      }));
    } else if (type === 2) {
      // locked
      // setDialogInfo(new DialogInfo({ title:'Notice', msg: 'Completed previous topic!', okText: ''}));
      openAlert(topic);
    } else if (type === 3) {
      // click topic
      onChangeTopic(topic, index);
    }
  };

  topics.forEach((topic, index) => {
    totalQuestion += topic.totalQuestion;
    var active = currentQuestionId === topic.id;

    if (count % 2 === 0) {
      childs.push( /*#__PURE__*/_react.default.createElement(TopicItem, {
        topic: topic,
        key: 'topic-item-' + parentId + '-' + topic.id,
        index: index,
        active: active,
        onClickTopic: onClickTopic
      }));

      if (childs.length === 3) {
        count++;
        childs.splice(1, 0, /*#__PURE__*/_react.default.createElement("div", {
          key: "topic-row-1-l-r-" + parentId + '-' + topic.id,
          className: "topic-line topic-row-1-l-r" + (lastTopicUnLock < index ? " active" : "")
        }));
        childs.splice(3, 0, /*#__PURE__*/_react.default.createElement("div", {
          key: "topic-row-2-l-r-" + parentId + '-' + topic.id,
          className: "topic-line topic-row-2-l-r"
        }));
        childs.push( /*#__PURE__*/_react.default.createElement("div", {
          key: "topic-row-3-l-r-c-" + parentId + '-' + topic.id,
          className: "topic-line topic-row-3-l-r-c"
        }));

        var row = /*#__PURE__*/_react.default.createElement("div", {
          className: "parent-topics-row",
          key: 'topic-row-' + parentId + '-' + count + '-' + topic.id
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "topics-row"
        }, [...childs]));

        widgets.push(row);
        childs = [];
      }
    } else {
      childs.unshift( /*#__PURE__*/_react.default.createElement(TopicItem, {
        topic: topic,
        key: 'topic-item-' + parentId + '-' + topic.id,
        active: active,
        onClickTopic: onClickTopic
      }));

      if (childs.length === 2) {
        count++;
        childs.splice(1, 0, /*#__PURE__*/_react.default.createElement("div", {
          key: "topic-row-1-r-l-" + parentId + '-' + topic.id,
          className: "topic-line topic-row-1-r-l"
        }));
        childs.unshift( /*#__PURE__*/_react.default.createElement("div", {
          key: "topic-row-2-r-l-" + parentId + '-' + topic.id,
          className: "topic-line topic-row-2-r-l-c"
        }));

        var _row = /*#__PURE__*/_react.default.createElement("div", {
          className: "parent-topics-row",
          key: 'topic-row-' + parentId + '-' + count + '-' + topic.id
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "topics-row"
        }, [...childs]));

        widgets.push(_row);
        childs = [];
      }
    }
  });

  if (childs.length > 0) {
    if (count % 2 === 0) {
      var row = /*#__PURE__*/_react.default.createElement("div", {
        className: "parent-topics-row",
        key: 'topic-row-' + parentId + '-' + count
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "topics-row"
      }, [...childs]));

      widgets.push(row);
    } else {
      var _row2 = /*#__PURE__*/_react.default.createElement("div", {
        className: "parent-topics-row",
        key: 'topic-row-' + parentId + '-' + count
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "topics-row"
      }, [...childs]));

      widgets.push(_row2);
    }
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "parent-topic-tree-panel"
  }, dialogInfo ? /*#__PURE__*/_react.default.createElement(_Dialog.AlertDialogSlide, {
    dialogInfo: dialogInfo
  }) : '', /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "center",
    justify: "space-around",
    className: "question-result-info"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Not seen"), /*#__PURE__*/_react.default.createElement("div", null, totalQuestion - familiar - mastered)), /*#__PURE__*/_react.default.createElement("div", {
    className: "item-line"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Familiar"), /*#__PURE__*/_react.default.createElement("div", null, familiar, " ", /*#__PURE__*/_react.default.createElement(_icons.Done, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "item-line"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Mastered"), /*#__PURE__*/_react.default.createElement("div", null, mastered, " ", /*#__PURE__*/_react.default.createElement(_icons.DoneAll, null)))), /*#__PURE__*/_react.default.createElement("div", {
    className: "box-topic-tree-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-tree-panel"
  }, widgets)));
};

var TopicItem = (_ref7) => {
  var {
    topic,
    active = false,
    index = 0,
    onClickTopic
  } = _ref7;
  var progress = topic.progress; // console.log("TopicItem topic", topic.getPercentComplete());

  if (topic.getPercentComplete() === 100) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-item completed" + (active ? ' active' : ''),
      onClick: () => onClickTopic(topic, index, 1)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "lds-ripple"
    }, /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-content"
    }, /*#__PURE__*/_react.default.createElement(_icons.Check, null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-name",
      "data-id": topic.id,
      "data-index": topic.orderIndex
    }, topic.name));
  }

  if (progress.lock === true) {
    return /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
      title: "Completed previous topic!"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-item locked",
      onClick: () => onClickTopic(topic, index, 2)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-content"
    }, /*#__PURE__*/_react.default.createElement(_icons.Lock, null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "topic-name",
      "data-id": topic.id,
      "data-index": topic.orderIndex
    }, topic.name)));
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-item" + (active ? ' active' : ''),
    onClick: () => onClickTopic(topic, index, 3)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "lds-ripple"
  }, /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-content"
  }, topic.getPercentComplete(), "%"), /*#__PURE__*/_react.default.createElement("div", {
    className: "topic-name",
    "data-id": topic.id,
    "data-index": topic.orderIndex
  }, topic.name));
};

var mapStateToProps = (state, ownProps) => {
  return Object.assign({
    topicReducer: state.topicReducer,
    cardReducer: state.cardReducer,
    gameState: state.gameState,
    appValueState: state.appValueState
  }, ownProps);
};

var mapDispatchToProps = dispatch => ({
  getCardsByParentId: parentId => dispatch((0, _card.getCardsByParentId)(parentId)),
  onContinue: () => dispatch((0, _game.onContinue)()),
  getTopicsByParentId: parentId => dispatch((0, _topic.getTopicsByParentId)(parentId)),
  updateTopicsProgress: topicsProgress => dispatch((0, _actions.updateTopicsProgress)(topicsProgress))
});

var mapDispatchTopicTreeToProps = dispatch => ({
  resetTopicProgress: topicProgress => dispatch((0, _actions.resetTopicProgress)(topicProgress))
});

var TopicTreePanel = (0, _reactRedux.connect)((state, ownProps) => {
  // console.log("LOL", Object.assign({}, state));
  return Object.assign({
    topicState: state.topicReducer,
    gameState: state.gameState,
    topicProgressReducer: state.topicProgressReducer
  }, ownProps);
}, mapDispatchTopicTreeToProps)(TopicTreePanelUI); // TODO: add action

var QuestionProgressPanel = (0, _reactRedux.connect)((state, ownProps) => {
  return Object.assign({
    gameState: state.gameState
  }, ownProps);
}, null)(QuestionProgressPanelUI); // TODO: add action

var TopicInfoPanel = (0, _reactRedux.connect)((state, ownProps) => {
  return Object.assign({
    topicState: state.topicReducer
  }, ownProps);
}, dispatch => ({
  getTopicById: topicId => dispatch((0, _topic.getTopicById)(topicId))
}))(TopicInfoPanelUI); // TODO: add action

var StudyView = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(StudyViewScreenUI);

var mapStateToPropsMain = (state, ownProps) => {
  return Object.assign({
    appInfoState: state.appInfoState
  }, ownProps);
};

var mapDispatchToPropsMain = dispatch => ({
  getAppInfo: appNameId => dispatch((0, _actions.getAppInfo)(appNameId))
});

var _default = (0, _reactRedux.connect)(mapStateToPropsMain, mapDispatchToPropsMain)(StudyViewScreen);

exports.default = _default;