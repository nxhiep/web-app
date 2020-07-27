"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _Widgets = require("../../components/Widgets");

var _config = _interopRequireDefault(require("../../config"));

var _actions = require("../../redux/actions");

require("../../resources/scss/main.scss");

require("../../resources/scss/test.scss");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var CustomTestView = (_ref) => {
  var {
    testSetting,
    topicState,
    appInfo,
    topicId,
    startNewTest,
    endTest,
    loadTestSetting,
    getTopicsByParentId,
    showButtonContinue,
    onContinueTest,
    stateInfoState
  } = _ref;
  var [openModal, setOpenModal] = (0, _react.useState)(false);
  var appId = appInfo.id;
  var parentId = appId; // console.log("stateInfoState", stateInfoState);

  if (appInfo && appInfo.hasState && stateInfoState.mapCurrentStateInfo[appId]) {
    parentId = stateInfoState.mapCurrentStateInfo[appId].id;
    topicId = parentId;
  } // console.log("parentIdparentIdparentIdparentIdparentIdparentIdparentId", parentId, 'appId', appId)


  (0, _react.useEffect)(() => {
    if (!appInfo.hasState || appInfo.hasState && parentId != appId) {
      getTopicsByParentId(parentId);
    }
  }, [getTopicsByParentId, appInfo, parentId, appId]);
  var mainTopics = new Array();
  var topicIds = new Array(); // console.log("11111111 topicState", topicState);

  if (!topicState.loading) {
    var topics = Object.values(topicState.data);
    topics.forEach(topic => {
      if (topic.parentId === parentId) {
        mainTopics.push(topic);
        topicIds.push(topic.id);
      }
    });
  }

  if (topicId !== appId && !appInfo.hasState) {
    topicIds.push(topicId);
  }

  (0, _react.useEffect)(() => {
    // console.log("XXXX topicIds", topicIds, 'appId', appId, 'topicId', topicId, 'testSetting', testSetting);
    if (topicIds && topicIds.length > 0 && (!testSetting || testSetting && testSetting.appId != appId && testSetting.topicId != topicId)) {
      // console.log("load test setting", topicIds);
      loadTestSetting(appId, topicId, topicIds);
    }
  }, [loadTestSetting, appId, topicId, topicIds, testSetting]); // console.log("CustomTestView xxxxxxxxxxxxxxxxxxx testSetting", testSetting);

  if (!testSetting) return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "custom-test-view"
  }, /*#__PURE__*/_react.default.createElement("p", null, "You are about to take the simulator test. If you pass this test at least 5 times, congratulations! You are ready for your real test"), /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, "As close as it gets to the actual test."), /*#__PURE__*/_react.default.createElement("li", null, testSetting.totalQuestion, " questions."), /*#__PURE__*/_react.default.createElement("li", null, testSetting.allowMistake, " mistakes allowed."), /*#__PURE__*/_react.default.createElement("li", null, "New questions every time you re-take."), /*#__PURE__*/_react.default.createElement("li", null, "Stop as soon as you have reached the failing score.")), showButtonContinue ? /*#__PURE__*/_react.default.createElement("div", {
    className: "buttons-panel"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "primary",
    className: "custom-test-button",
    onClick: () => onContinueTest()
  }, "Continue")) : '', /*#__PURE__*/_react.default.createElement("div", {
    className: "buttons-panel"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "primary",
    className: "custom-test-button",
    onClick: () => setOpenModal(true)
  }, "Custom Test")), /*#__PURE__*/_react.default.createElement("div", {
    className: "buttons-panel"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "secondary",
    className: "end-test-button",
    onClick: () => {
      endTest(appId, topicId, _config.default.TEST_GAME, testSetting);
    }
  }, "End Test")), /*#__PURE__*/_react.default.createElement(_core.Modal, {
    className: "my-modal",
    "aria-labelledby": "simple-modal-title",
    "aria-describedby": "simple-modal-description",
    open: openModal,
    onClose: () => setOpenModal(false)
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(CustomTestModal, {
    appId: appId,
    topicId: topicId,
    mainTopics: mainTopics,
    onClose: () => setOpenModal(false),
    onChange: testSetting => {
      if (startNewTest) startNewTest(testSetting);
      setOpenModal(false);
    },
    testSetting: testSetting
  }))));
};

var CustomTestModalUI = (_ref2) => {
  var {
    mainTopics,
    onClose,
    onChange,
    testSetting,
    appId,
    topicId
  } = _ref2;

  var _a, _b, _c, _d; // console.log("CustomTestModal props ", testSetting);


  var [instanceFeedback, setInstanceFeedback] = (0, _react.useState)((_a = testSetting.instanceFeedback) !== null && _a !== void 0 ? _a : false);
  var [totalQuestion, setTotalQuestion] = (0, _react.useState)((_b = testSetting.totalQuestion) !== null && _b !== void 0 ? _b : 0);
  var [allowMistake, setAllowMistake] = (0, _react.useState)((_c = testSetting.allowMistake) !== null && _c !== void 0 ? _c : 0);
  var [contentTest, setContentTest] = (0, _react.useState)((_d = testSetting.contentTest) !== null && _d !== void 0 ? _d : []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "my-modal-content custom-test-content-dialog-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "my-modal-header"
  }, "Custom Test", /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    "aria-label": "delete",
    className: "close-icon-button",
    onClick: () => onClose()
  }, /*#__PURE__*/_react.default.createElement(_icons.Clear, {
    fontSize: "small"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "my-modal-body"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "custom-test-content-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Questions number for test"), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    id: "text-box-question-number",
    defaultValue: !totalQuestion || isNaN(totalQuestion) ? 0 : totalQuestion,
    variant: "outlined",
    // size="small"
    type: "number",
    className: "field-content",
    onChange: event => {
      var value = event.target.value;
      var total = 0;

      try {
        total = parseInt(value, 10);
      } catch (e) {}

      setTotalQuestion(total);
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Max allowed questions mistake"), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    id: "text-box-allowed-mistakes",
    defaultValue: !allowMistake || isNaN(allowMistake) ? 0 : allowMistake,
    variant: "outlined",
    // size="small"
    type: "number",
    className: "field-content",
    onChange: event => {
      var value = event.target.value;
      var total = 0;

      try {
        total = parseInt(value, 10);
      } catch (e) {}

      setAllowMistake(total);
    }
  })), mainTopics.length > 0 ? /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Content test"), /*#__PURE__*/_react.default.createElement(MultipleSelectBox, {
    valuesDefault: contentTest,
    mainTopics: mainTopics,
    className: "field-content",
    onChange: values => {
      setContentTest(values);
    }
  })) : '', /*#__PURE__*/_react.default.createElement("div", {
    className: "item"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Instance feedback"), /*#__PURE__*/_react.default.createElement(_core.FormControl, {
    variant: "outlined",
    className: "select-instance-feedback field-content"
  }, /*#__PURE__*/_react.default.createElement(_core.Select, {
    id: "select-instance-feedback",
    value: instanceFeedback ? 1 : 0,
    onChange: event => {
      console.log("event.target.value", event.target.value);
      setInstanceFeedback(!!event.target.value);
    }
  }, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    value: 0
  }, "Off"), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    value: 1
  }, "On"))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "start-test-button-panel"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "primary",
    className: "start-test-button",
    onClick: () => {
      onChange({
        instanceFeedback: instanceFeedback,
        totalQuestion: totalQuestion,
        allowMistake: allowMistake,
        contentTest: contentTest,
        appId: appId,
        topicId: topicId
      });
    }
  }, "Start Test"))));
};

var MultipleSelectBox = props => {
  var {
    mainTopics,
    onChange: _onChange,
    className,
    valuesDefault
  } = props;
  var [topicIds, setTopicIds] = (0, _react.useState)(valuesDefault ? valuesDefault : new Array());
  var mapTopicId = new Map();
  mainTopics.forEach(item => {
    mapTopicId.set(item.id, item);
  });
  var theme = (0, _styles.useTheme)();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm'));
  var width;

  if (isMobile) {
    width = window.innerWidth - 60;
  }

  return /*#__PURE__*/_react.default.createElement(_core.FormControl, {
    style: width ? {
      maxWidth: width
    } : {},
    className: "select-content-test" + (className ? " " + className : ""),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_core.Select, {
    id: "select-content-test",
    multiple: true,
    value: topicIds,
    onChange: event => {
      var values = event.target.value; // console.log("values", values);

      _onChange(values);

      setTopicIds(values);
    },
    input: /*#__PURE__*/_react.default.createElement(_core.Input, null),
    renderValue: selected => {
      var result = new Array();
      selected.forEach(id => {
        var item = mapTopicId.get(id);
        if (item) result.push(item.name);
      });
      return result.join(', ');
    }
  }, mainTopics.map(item => {
    return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      value: item.id,
      key: 'menu-select-item-' + item.id
    }, /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
      checked: topicIds.indexOf(item.id) > -1
    }), /*#__PURE__*/_react.default.createElement(_core.ListItemText, {
      primary: item.name
    }));
  })));
};

var mapStateToProps = (state, ownProps) => {
  return Object.assign({
    topicState: state.topicReducer,
    testSetting: state.testSettingState.currentSetting,
    stateInfoState: state.stateInfoState
  }, ownProps);
};

var mapDispatchToProps = {
  getTopicsByParentId: parentId => (0, _actions.getTopicsByParentId)(parentId),
  loadTestSetting: (appId, topicId, topicIds) => (0, _actions.loadTestSettingByTopicId)({
    appId: appId,
    topicId: topicId,
    topicIds: topicIds
  }),
  endTest: (appId, topicId, gameType, setting) => (0, _actions.endTest)({
    appId: appId,
    topicId: topicId,
    gameType: gameType,
    setting: setting
  })
};

var mapStateToPropsModal = (state, ownProps) => {
  return Object.assign({
    topicState: state.topicReducer,
    testSetting: state.testSettingState.currentSetting
  }, ownProps);
};

var CustomTestModal = (0, _reactRedux.connect)(mapStateToPropsModal, null)(CustomTestModalUI);

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CustomTestView);

exports.default = _default;