import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, } from 'redux';
import { logger } from 'redux-logger';
import rootReducer from './reducers/index';
import rootSaga from './sagas';
import { persistReducer, persistStore } from 'redux-persist';
import localforage from 'localforage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createEncryptor from 'redux-persist-transform-encrypt';
import Config from '../config';
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
}
localforage.config({
    driver: localforage.WEBSQL,
    name: 'uTest',
    version: 1.0,
    size: 4980736,
    storeName: 'data',
    description: 'offline data for web',
});
const encryptor = createEncryptor({
    secretKey: Config.SECRET_KEY,
    onError: function (error) {
        // Handle the error.
        console.log("encrypt error", error);
    },
});
const persistConfig = {
    key: 'root',
    storage: localforage,
    stateReconciler: autoMergeLevel2,
    transform: [encryptor],
    // blacklist: ["cardReducer", "listGameState", "countnerState", "demoState", "cardProgressReducer", "topicReducer", "testSettingState", "topicProgressReducer"],
    // whitelist: ["topicProgressReducer"]
    whitelist: ["cardReducer", "listGameState", "countnerState", "demoState",
        "cardProgressReducer", "topicReducer", "testSettingState",
        "topicProgressReducer", "appInfoState", "stateInfoState", "userRateState"],
};
// localforage.clear();
const pReducer = persistReducer(persistConfig, rootReducer);
// const store: Store<AppState> = createStore<AppState>(
//     pReducer,
//     applyMiddleware(...middlewares),
// );
// sagaMiddleware.run(rootSaga);
// export default store;
export default function configStore(initialState
    // history: History,
    // initialState: AppState
) {
    // create the composing function for our middlewares
    // const composeEnhancers = composeWithDevTools({})
    // create the redux-saga middleware
    // const sagaMiddleware = createSagaMiddleware()
    // We'll create our store with the combined reducers/sagas, and the initial Redux state that
    // we'll be passing from our entry point.
    const store = createStore(
        //   connectRouter(history)(rootReducer),
        pReducer,
        initialState,
        applyMiddleware(...middlewares));
    const persistor = persistStore(store, null)
    // Don't forget to run the root saga, and return the store object.
    sagaMiddleware.run(rootSaga);
    return {store, persistor};
}
