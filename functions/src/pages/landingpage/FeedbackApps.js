"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _Rating = _interopRequireDefault(require("@material-ui/lab/Rating"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactSlick = _interopRequireDefault(require("react-slick"));

var _Widgets = require("../../components/Widgets");

var _actions = require("../../redux/actions");

var _utils = require("../../utils");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var FeedbackAppsUI = (_ref) => {
  var {
    getUserRatesPerfectest,
    userRateState,
    theme
  } = _ref;
  // const theme = useTheme();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm'));
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: isMobile ? 1 : 3,
    className: "feedback-slider"
  };
  (0, _react.useEffect)(() => {
    getUserRatesPerfectest();
  }, []);
  var userRates = [];

  for (var i = 0; i < userRateState.perfectest.length; i++) {
    if (i < 6) {
      userRates.push(userRateState.perfectest[i]);
    } else {
      break;
    }
  }

  console.log("XXXXX userRates", userRates);
  return /*#__PURE__*/_react.default.createElement("section", {
    className: "feedback-apps"
  }, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement(_Widgets.TitleBlock, {
    title: "What our clients say"
  }), /*#__PURE__*/_react.default.createElement(_reactSlick.default, Object.assign({}, settings), userRates && userRates.length > 0 ? userRates.map(userRate => {
    return /*#__PURE__*/_react.default.createElement(FeedbackItem, {
      key: "FeedbackItem-" + userRate.id,
      // value={userRate.rateValue}
      value: 5,
      content: userRate.content,
      name: userRate.userName,
      createTime: userRate.createDate
    });
  }) : /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null))));
};

var FeedbackItem = (_ref2) => {
  var {
    value = 0,
    content = '',
    name = '',
    createTime = 0
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "feedback-item"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    size: "small",
    value: value,
    readOnly: true
  }), /*#__PURE__*/_react.default.createElement("p", {
    className: "dot-7"
  }, content), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    className: "info"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "border"
  }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("strong", null, name), /*#__PURE__*/_react.default.createElement("div", null, (0, _utils.formatDate)(createTime))))));
};

var mapStateToPropsUserRate = (state, ownProps) => {
  return Object.assign({
    userRateState: state.userRateState
  }, ownProps);
};

var mapDispatchToPropsUserRate = dispatch => ({
  getUserRatesPerfectest: () => dispatch((0, _actions.getUserRatesPerfectest)())
});

var _default = (0, _reactRedux.connect)(mapStateToPropsUserRate, mapDispatchToPropsUserRate)((0, _styles.withTheme)(FeedbackAppsUI));

exports.default = _default;