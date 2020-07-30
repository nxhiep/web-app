"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require("redux");

var _reduxSaga = _interopRequireWildcard(require("redux-saga"));

var _simpleSagaMonitor = _interopRequireDefault(require("@redux-saga/simple-saga-monitor"));

var _index = _interopRequireDefault(require("../redux/reducers/index"));

var _axios = _interopRequireDefault(require("axios"));

var _reduxAxiosMiddleware = _interopRequireDefault(require("redux-axios-middleware"));

var _index2 = require("../services/index");

var _sagas = _interopRequireDefault(require("../redux/sagas"));

// import Call
function configureStore(initialState) {
  var sagaMiddleware = (0, _reduxSaga.default)({
    sagaMonitor: _simpleSagaMonitor.default
  }, _axios.default);
  var store = (0, _redux.createStore)(_index.default, (0, _redux.applyMiddleware)(sagaMiddleware, (0, _reduxAxiosMiddleware.default)(_index2.callApi)));
  store.runSaga = sagaMiddleware.run;

  store.close = () => store.dispatch(_reduxSaga.END);

  return store;
}