"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _routes = _interopRequireDefault(require("./routes"));

var _reactGa = _interopRequireDefault(require("react-ga"));

var _component = _interopRequireDefault(require("@loadable/component"));

var _Home = _interopRequireDefault(require("./pages/home/Home.View"));

var _LandingPage = _interopRequireDefault(require("./pages/landingpage/LandingPage"));

var _Review = _interopRequireDefault(require("./pages/review/Review.View"));

var _Study = _interopRequireDefault(require("./pages/study/Study.View"));

var _Test = _interopRequireDefault(require("./pages/test/Test.View"));

var _Game = _interopRequireDefault(require("./pages/game/Game.ViewTS"));

// import { createBrowserHistory } from 'history';
initializeReactGA();

function initializeReactGA() {
  _reactGa.default.initialize('UA-167769768-1');
}

function App() {
  // const history = createBrowserHistory();
  return (
    /*#__PURE__*/
    // <Router >
    // <Suspense fallback={makeMainLoading()}>
    _react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/:appNameId/:screen",
      children: /*#__PURE__*/_react.default.createElement(ScreenChild, null)
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/:appNameId"
    }, /*#__PURE__*/_react.default.createElement(_Home.default, null)), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/"
    }, /*#__PURE__*/_react.default.createElement(_LandingPage.default, null)))
  );
}

function ScreenChild() {
  var {
    screen
  } = (0, _reactRouterDom.useParams)();
  screen = screen !== null && screen !== void 0 ? screen : '';

  if (screen.startsWith(_routes.default.TEST_SCREEN)) {
    // console.log("screen", screen);
    var offset = screen.lastIndexOf('-');
    var topicId = -1;

    if (offset > -1) {
      offset += 1;
      topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    } // console.log("TestViewScreen topicId ", topicId);


    return /*#__PURE__*/_react.default.createElement(_Test.default, {
      topicId: topicId
    });
  }

  if (screen.startsWith(_routes.default.REVIEW_SCREEN)) {
    return /*#__PURE__*/_react.default.createElement(_Review.default, null);
  }

  if (screen.length > 0) {
    return /*#__PURE__*/_react.default.createElement(_Study.default, null);
  }

  return /*#__PURE__*/_react.default.createElement(_Home.default, null);
}
/*
<Route exact path={"/:appNameId/" + Routes.TEST_SCREEN}>
  <TestViewScreen />
</Route>
<Route exact path={"/:appNameId/" + Routes.REVIEW_SCREEN}>
  <ReviewViewScreen />
</Route>
*/


var _default = App;
exports.default = _default;