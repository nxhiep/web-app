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

var _Image = _interopRequireDefault(require("../../components/Image"));

var _Widgets = require("../../components/Widgets");

var _actions = require("../../redux/actions");

var _reactGa = _interopRequireDefault(require("react-ga"));

var ListGreatApps = (_ref) => {
  var {
    getAllAppInfo = () => {},
    appInfoState
  } = _ref;
  (0, _react.useEffect)(() => {
    getAllAppInfo();
  }, []);

  if (appInfoState.loading === true || !appInfoState.data) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var appInfos = Object.values(appInfoState.data);
  return /*#__PURE__*/_react.default.createElement("section", {
    className: "list-great-apps"
  }, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement(_Widgets.TitleBlock, {
    title: "Great apps for you",
    description: "Practice right now with our free apps!"
  }), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "stretch",
    spacing: 2
  }, appInfos.sort((a, b) => a.appName.localeCompare(b.appName)).map((appInfo, index) => {
    return /*#__PURE__*/_react.default.createElement(AppInfoItem, {
      appInfo: appInfo,
      key: "AppInfoItem-" + index
    });
  }))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%",
      height: "100px"
    }
  }));
};

var AppInfoItem = (_ref2) => {
  var {
    appInfo
  } = _ref2;
  var appName = appInfo.appName ? appInfo.appName : appInfo.title;
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 6,
    sm: 4,
    md: 2,
    className: "app-info-item"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    href: "/" + appInfo.appNameId,
    target: "_blank",
    onClick: () => {
      _reactGa.default.event({
        category: 'click-app',
        action: 'Clicked ' + appInfo.appName
      });
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Image.default, {
    src: appInfo.avatar,
    alt: appName,
    width: "100%"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "title"
  }, /*#__PURE__*/_react.default.createElement("strong", null, appName)), /*#__PURE__*/_react.default.createElement("div", {
    className: "rating"
  }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    size: "small",
    value: 5,
    readOnly: true
  }))));
};

var mapStateToProps = (state, ownProps) => {
  return Object.assign({
    appInfoState: state.appInfoState
  }, ownProps);
};

var mapDispatchToProps = dispatch => ({
  getAllAppInfo: () => dispatch((0, _actions.getAllAppInfo)())
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ListGreatApps);

exports.default = _default;