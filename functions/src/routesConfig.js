"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _react = _interopRequireDefault(require("react"));

var _component = _interopRequireDefault(require("@loadable/component"));

// import { createBrowserHistory } from 'history';
var HomeViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/home/Home.View'))));
var LandingPageScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/landingpage/LandingPage'))));
var ReviewViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/review/Review.View'))));
var StudyViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/study/Study.View'))));
var TestViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/test/Test.View'))));
var GameViewScreen = (0, _component.default)(() => Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('./pages/game/Game.ViewTS'))));

var _default = routesConfig = [{
  component: LandingPageScreen,
  routes: [{
    path: "/",
    exact: true
  }, {
    path: "/:appNameId",
    component: HomeViewScreen,
    exact: true,
    routes: [{
      path: "/:appNameId/review",
      component: ReviewViewScreen,
      exact: true
    }]
  }]
}];

exports.default = _default;