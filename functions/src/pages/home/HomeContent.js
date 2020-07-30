"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _Widgets = require("../../components/Widgets");

var _Topic = _interopRequireDefault(require("../../models/Topic"));

var _Utils = require("../../models/Utils");

var _actions = require("../../redux/actions");

var _utils = require("../../utils");

var HomeContentUI = (_ref) => {
  var {
    parentId,
    appInfo,
    appNameId,
    topicState,
    getTopicsByParentId,
    hasState,
    onChangeState
  } = _ref;
  // console.log("HomeContentUI parentId", parentId);
  (0, _react.useEffect)(() => {
    getTopicsByParentId(parentId);
  }, [parentId]); // console.log("topicState", topicState);

  if (!topicState || topicState.loading === true || !topicState.data) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, {
      color: null
    });
  }

  var topics = [];
  var temp = Object.values(topicState.data);
  temp.forEach(topic => {
    if (parentId == topic.parentId) {
      topics.push(topic);
    }
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      'backgroundColor': 'var(--main-background-color)'
    },
    className: "content-home-page"
  }, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement("h3", {
    className: "main-title"
  }, /*#__PURE__*/_react.default.createElement("span", null, "All categories ", appInfo ? "of " + appInfo.appName : ""), hasState ? /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "outlined",
    color: "primary",
    onClick: () => {
      onChangeState();
    }
  }, "Change State") : ''), /*#__PURE__*/_react.default.createElement("hr", null), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: "content-panel",
    container: true,
    direction: "row"
  }, topics.map(t => {
    var topic = new _Topic.default(t);
    return /*#__PURE__*/_react.default.createElement(TopicItem, {
      topic: topic,
      appNameId: appNameId,
      key: 'home-topic-item-' + topic.id
    });
  })))));
};

var TopicItem = (_ref2) => {
  var {
    topic,
    appNameId
  } = _ref2;

  var _a;

  var history = (0, _reactRouterDom.useHistory)(); // console.log("TopicItem topic", topic);

  if (!topic) {
    return null;
  }

  var description = topic.description;
  var progress = (_a = topic === null || topic === void 0 ? void 0 : topic.progress) === null || _a === void 0 ? void 0 : _a.progress;

  if (!progress || isNaN(progress) || progress < 0) {
    progress = 0;
  }

  var link = '/' + appNameId + '/' + (0, _utils.stringReplaceUrl)(topic.name) + '-' + topic.id;
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    className: "topic-item-panel",
    onClick: () => history.push(link)
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: link,
    onClick: event => event.preventDefault()
  }, /*#__PURE__*/_react.default.createElement("label", null, topic.name), /*#__PURE__*/_react.default.createElement("div", null, (0, _Utils.stringToHtml)(description)), /*#__PURE__*/_react.default.createElement(_Widgets.LineProgress, {
    percent: progress,
    size: '15px'
  })));
};

var mapStateToProps = (state, ownProps) => Object.assign({
  topicState: state.topicReducer
}, ownProps);

var mapDispatchToProps = dispatch => ({
  getTopicsByParentId: parentId => dispatch((0, _actions.getTopicsByParentId)(parentId))
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(HomeContentUI);

exports.default = _default;