"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireWildcard(require("react"));

var _Footer = _interopRequireDefault(require("../../components/Footer"));

var _Image = _interopRequireDefault(require("../../components/Image"));

var _Widgets = require("../../components/Widgets");

var _Utils = require("../../models/Utils");

var _landingPageHeader = _interopRequireDefault(require("../../resources/images/landing-page-header.png"));

require("../../resources/scss/landing-page.scss");

require("../../resources/scss/main.scss");

var _FeedbackApps = _interopRequireDefault(require("./FeedbackApps"));

var _ListGreatApps = _interopRequireDefault(require("./ListGreatApps"));

var _StatictisApps = _interopRequireDefault(require("./StatictisApps"));

var _reactGa = _interopRequireDefault(require("react-ga"));

var LandingPage = () => {
  (0, _react.useEffect)(() => {
    _reactGa.default.pageview('/homepage');
  }, []);
  return /*#__PURE__*/_react.default.createElement(_Widgets.MainWidget, {
    className: 'landing-page'
  }, /*#__PURE__*/_react.default.createElement(Header, null), /*#__PURE__*/_react.default.createElement(_StatictisApps.default, null), /*#__PURE__*/_react.default.createElement(_FeedbackApps.default, null), /*#__PURE__*/_react.default.createElement(_ListGreatApps.default, null), /*#__PURE__*/_react.default.createElement(_Footer.default, {
    alt: "ABC Elearning"
  }));
};

var Header = () => {
  return /*#__PURE__*/_react.default.createElement("header", null, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    justify: "space-between",
    className: "header-tab-panel"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "parent-logo"
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: "/",
    className: "logo"
  }, /*#__PURE__*/_react.default.createElement("strong", null, "A B C"), /*#__PURE__*/_react.default.createElement("div", null, "E-Learning"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "menu-appbar"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "space-header"
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: "header-button header-button-right",
    variant: "contained",
    color: "secondary",
    onClick: event => {
      (0, _Utils.onScrollToElement)('.list-great-apps');
    }
  }, "Explore Our Exams"))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%",
      height: "20px"
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    justify: "space-between"
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 7,
    className: "header-content"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      fontWeight: 600
    }
  }, "Make your study great with our thousands of free practice questions"), /*#__PURE__*/_react.default.createElement("p", null, "You want to get 100% ready for your important day? You desire to pass your exam at your first try? You are wondering if you should pay a charge of money buying some practice materials? That\u2019s why we are here to support you achieve the gate of success with our test prep solutions.")), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 5,
    className: "header-image-content"
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    alt: 'Make your study great with our thousands of free practice questions',
    src: _landingPageHeader.default
  })))));
};

var _default = LandingPage;
exports.default = _default;