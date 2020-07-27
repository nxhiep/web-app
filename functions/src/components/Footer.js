"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireDefault(require("react"));

var _Widgets = require("./Widgets");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _reactRouterDom = require("react-router-dom");

var Footer = (_ref) => {
  var {
    alt = ''
  } = _ref;
  var theme = (0, _styles.useTheme)();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm'));
  console.log("useMediaQuery isMobile", isMobile);

  if (isMobile) {
    return /*#__PURE__*/_react.default.createElement("div", null);
  }

  return /*#__PURE__*/_react.default.createElement(_core.Box, {
    component: "footer",
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement("div", {
    className: 'footer-content'
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "center",
    justify: "space-between"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/",
    className: 'logo-web'
  }, /*#__PURE__*/_react.default.createElement("img", {
    alt: alt,
    src: require('../resources/images/logo.svg').default
  }))))));
};

var _default = Footer;
exports.default = _default;