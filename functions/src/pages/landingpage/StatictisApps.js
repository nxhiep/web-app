"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _icons = require("@material-ui/icons");

var _react = _interopRequireDefault(require("react"));

var _Widgets = require("../../components/Widgets");

var _landingPageStatictisApps = _interopRequireDefault(require("../../resources/images/landing-page-statictis-apps.jpg"));

var _Image = _interopRequireDefault(require("../../components/Image"));

var StatictisApps = () => {
  return /*#__PURE__*/_react.default.createElement("section", {
    className: "statictis-apps"
  }, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement(_Widgets.TitleBlock, {
    title: "Some of the best features",
    description: "With thousands of exam-simulated questions with detail explanations, lifetime access to the complete Manual, and dozens of test-taking strategies, our Test Prep helps you pass your test with flying colors."
  }), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    className: "image-statictis-apps",
    alt: 'With thousands of exam-simulated questions with detail explanations, lifetime access to the complete Manual, and dozens of test-taking strategies, our Test Prep helps you pass your test with flying colors',
    src: _landingPageStatictisApps.default
  })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 6,
    className: "statictis-apps-items"
  }, /*#__PURE__*/_react.default.createElement(StatictisAppItem, {
    title: "Completely free",
    description: "Our application is 100% free, so you can practice your test in our web or in any other devices with our available free app on google play or appStore. No internet connection and no registration required."
  }), /*#__PURE__*/_react.default.createElement(StatictisAppItem, {
    title: "Practice by topics",
    description: "Test your knowledge by practicing by topics exactly as in real test. Moreover, topic is also divided into small parts which helps you get your interest in studying, just like playing a game."
  }), /*#__PURE__*/_react.default.createElement(StatictisAppItem, {
    title: "Customize your exam",
    description: "You can design your test so that it works best for you. Gradually set the test as close as the real test to ready for it. This is the most effective way that helps many people get over their challenge."
  }), /*#__PURE__*/_react.default.createElement(StatictisAppItem, {
    title: "Special review mode",
    description: "With this feature, you can review which questions you are weak, medium or strong. And this will help you find out where you need to work more and make the most of your study time."
  }))), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    className: "list-number"
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/_react.default.createElement(ActiveItem, {
    value: "10,123",
    title: "Users"
  })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/_react.default.createElement(ActiveItem, {
    value: "20,432",
    title: "Download"
  })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/_react.default.createElement(ActiveItem, {
    value: "7871",
    title: "Likes"
  })), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/_react.default.createElement(ActiveItem, {
    value: "945",
    title: "5 star rating"
  })))));
};

var ActiveItem = (_ref) => {
  var {
    value = '',
    title = ''
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "active-item"
  }, /*#__PURE__*/_react.default.createElement("strong", null, value), /*#__PURE__*/_react.default.createElement("span", null, title));
};

var StatictisAppItem = (_ref2) => {
  var {
    title = '',
    description = ''
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "statictis-app-item"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "image"
  }, /*#__PURE__*/_react.default.createElement(_icons.CalendarToday, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "info"
  }, /*#__PURE__*/_react.default.createElement("strong", {
    className: "title"
  }, title), /*#__PURE__*/_react.default.createElement("p", null, description)));
};

var _default = StatictisApps;
exports.default = _default;