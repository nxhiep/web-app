import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import sagaMonitor from '@redux-saga/simple-saga-monitor'
import rootReducer from '../redux/reducers/index'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware';
// import Call
import {callApi} from '../services/index'
import rootSaga from '../redux/sagas'
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor },axios)
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, axiosMiddleware(callApi)))
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}