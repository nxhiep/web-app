"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.immediate");

require("core-js/modules/web.queue-microtask");

require("core-js/modules/web.url");

require("core-js/modules/web.url.to-json");

require("core-js/modules/web.url-search-params");

var _styles = require("@material-ui/core/styles");

var _jss = require("jss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _reactRedux = require("react-redux");

var _react2 = require("redux-persist/integration/react");

var _App = _interopRequireDefault(require("./App.js"));

var _store = _interopRequireDefault(require("./redux/store"));

var _serviceWorker = require("./serviceWorker");

var _utils = require("./utils.js");

var _reactRouterDom = require("react-router-dom");

// import "@babel/polyfill";
var jss = (0, _jss.create)(Object.assign(Object.assign({}, (0, _styles.jssPreset)()), {
  insertionPoint: 'jss-insertion-point'
}));
var store = (0, _store.default)();
ReactDOM.hydrate( /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
  store: store.store
}, /*#__PURE__*/_react.default.createElement(_react2.PersistGate, {
  persistor: store.persistor,
  loading: (0, _utils.makeMainLoading)()
}, /*#__PURE__*/_react.default.createElement(_styles.StylesProvider, {
  jss: jss
}, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_App.default, null))))), document.getElementById('root')); // if (module.hot) { module.hot.accept(App); }
// serviceWorker.unregister();

(0, _serviceWorker.register)();