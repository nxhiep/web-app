import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import sagaMonitor from '@redux-saga/simple-saga-monitor'
import rootReducer from '../redux/reducers/index'
// import Call
import {callApi} from '../services/index'
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  const store = createStore(rootReducer,initialState, applyMiddleware(sagaMiddleware))
  store.close = () => store.dispatch(END)
  return store
}