"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configStore;

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _redux = require("redux");

var _reduxLogger = require("redux-logger");

var _index = _interopRequireDefault(require("./reducers/index"));

var _sagas = _interopRequireDefault(require("./sagas"));

var _reduxPersist = require("redux-persist");

var _localforage = _interopRequireDefault(require("localforage"));

var _autoMergeLevel = _interopRequireDefault(require("redux-persist/lib/stateReconciler/autoMergeLevel2"));

var _reduxPersistTransformEncrypt = _interopRequireDefault(require("redux-persist-transform-encrypt"));

var _config = _interopRequireDefault(require("../config"));

var sagaMiddleware = (0, _reduxSaga.default)();
var middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(_reduxLogger.logger);
}

_localforage.default.config({
  driver: _localforage.default.WEBSQL,
  name: 'uTest',
  version: 1.0,
  size: 4980736,
  storeName: 'data',
  description: 'offline data for web'
});

var encryptor = (0, _reduxPersistTransformEncrypt.default)({
  secretKey: _config.default.SECRET_KEY,
  onError: function onError(error) {
    // Handle the error.
    console.log("encrypt error", error);
  }
});
var persistConfig = {
  key: 'root',
  storage: _localforage.default,
  stateReconciler: _autoMergeLevel.default,
  transform: [encryptor],
  // blacklist: ["cardReducer", "listGameState", "countnerState", "demoState", "cardProgressReducer", "topicReducer", "testSettingState", "topicProgressReducer"],
  // whitelist: ["topicProgressReducer"]
  whitelist: ["cardReducer", "listGameState", "countnerState", "demoState", "cardProgressReducer", "topicReducer", "testSettingState", "topicProgressReducer", "appInfoState", "stateInfoState", "userRateState"]
}; // localforage.clear();

var pReducer = (0, _reduxPersist.persistReducer)(persistConfig, _index.default); // const store: Store<AppState> = createStore<AppState>(
//     pReducer,
//     applyMiddleware(...middlewares),
// );
// sagaMiddleware.run(rootSaga);
// export default store;

function configStore(initialState // history: History,
// initialState: AppState
) {
  // create the composing function for our middlewares
  // const composeEnhancers = composeWithDevTools({})
  // create the redux-saga middleware
  // const sagaMiddleware = createSagaMiddleware()
  // We'll create our store with the combined reducers/sagas, and the initial Redux state that
  // we'll be passing from our entry point.
  var store = (0, _redux.createStore)( //   connectRouter(history)(rootReducer),
  pReducer, initialState, (0, _redux.applyMiddleware)(...middlewares));
  var persistor = (0, _reduxPersist.persistStore)(store, null); // Don't forget to run the root saga, and return the store object.

  sagaMiddleware.run(_sagas.default);
  return {
    store,
    persistor
  };
}