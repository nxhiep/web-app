"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _routes = _interopRequireDefault(require("../routes"));

var _Widgets = require("./Widgets");

var Header = (_ref) => {
  var {
    alt = ''
  } = _ref;
  var theme = (0, _styles.useTheme)();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm')); // console.log('isMobile', isMobile, "width", width, 'height', height);

  if (isMobile) {
    return /*#__PURE__*/_react.default.createElement(HeaderMobile, {
      alt: alt
    });
  }

  return /*#__PURE__*/_react.default.createElement(HeaderPC, {
    alt: alt
  });
};

var HeaderTabPanel = () => {
  var history = (0, _reactRouterDom.useHistory)();
  var {
    appNameId,
    screen
  } = (0, _reactRouterDom.useParams)(); // console.log("appNameId", appNameId, 'screen', screen);

  screen = screen !== null && screen !== void 0 ? screen : '';
  var homeScreen = screen.length == 0;
  var studyScreen = !screen.startsWith('test') && !screen.startsWith('review') && !homeScreen;

  var gotoPage = (event, screen) => {
    event.preventDefault();
    history.push(getLink(screen));
  };

  var getLink = screen => {
    return '/' + appNameId + (screen ? '/' + screen : '');
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "header-tabs-panel"
  }, studyScreen ? /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: "header-tab-button" + (studyScreen ? ' active' : '')
  }, "Learn") : /*#__PURE__*/_react.default.createElement(_core.Button, {
    href: getLink(),
    className: "header-tab-button" + (homeScreen ? ' active' : ''),
    onClick: event => gotoPage(event)
  }, "Home"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    href: getLink(_routes.default.TEST_SCREEN),
    className: "header-tab-button" + (screen.startsWith(_routes.default.TEST_SCREEN) ? ' active' : ''),
    onClick: event => gotoPage(event, _routes.default.TEST_SCREEN)
  }, "Test"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    href: getLink(_routes.default.REVIEW_SCREEN),
    className: "header-tab-button" + (screen.startsWith(_routes.default.REVIEW_SCREEN) ? ' active' : ''),
    onClick: event => gotoPage(event, _routes.default.REVIEW_SCREEN)
  }, "Review"));
};

var HeaderMobile = (_ref2) => {
  var {
    alt
  } = _ref2;
  var history = (0, _reactRouterDom.useHistory)();
  return /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    color: "inherit",
    position: "static",
    className: "main-app-bar"
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    justify: "space-between",
    alignItems: "flex-end",
    wrap: "nowrap"
  }, /*#__PURE__*/_react.default.createElement(_core.Link, {
    style: {
      alignSelf: "center"
    },
    href: "/",
    className: 'logo-web',
    onClick: event => {
      event.preventDefault();
      history.push('/');
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    alt: alt,
    src: require('../resources/images/logo.svg').default
  })), /*#__PURE__*/_react.default.createElement(HeaderTabPanel, null)));
};

var HeaderPC = (_ref3) => {
  var {
    alt
  } = _ref3;
  var history = (0, _reactRouterDom.useHistory)();
  return /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    color: "inherit",
    position: "static",
    className: "main-app-bar"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    justify: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_core.Link, {
    href: "/",
    className: 'logo-web',
    onClick: event => {
      event.preventDefault();
      history.push('/');
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    alt: alt,
    src: require('../resources/images/logo.svg').default
  })), /*#__PURE__*/_react.default.createElement(HeaderTabPanel, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "temp-panel"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "temp-panel"
  })))));
};

var LoginPanel = () => {
  return /*#__PURE__*/_react.default.createElement(_core.Box, {
    className: 'login-panel',
    component: "span"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "text",
    color: "inherit",
    style: {
      marginRight: '10px',
      'color': 'white'
    }
  }, "Log In"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "default",
    style: {
      'color': 'white',
      'backgroundColor': 'rgba(255, 255, 255, 0.5)'
    }
  }, "Sign Up"));
};

var _default = Header;
exports.default = _default;