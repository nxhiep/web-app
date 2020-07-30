// import "@babel/polyfill";
import "core-js/web";
import "regenerator-runtime/runtime";
import { jssPreset, StylesProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.js';
import configStore from './redux/store';
import { register } from './serviceWorker';
import { makeMainLoading } from './utils.js';
import { BrowserRouter } from 'react-router-dom';
const jss = create(Object.assign(Object.assign({}, jssPreset()), { insertionPoint: 'jss-insertion-point' }));
const store = configStore();
ReactDOM.hydrate(
    <Provider store={store.store}>
        <PersistGate
            persistor={store.persistor}
            loading={makeMainLoading()}
        >
            <StylesProvider jss={jss}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>

            </StylesProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
// if (module.hot) { module.hot.accept(App); }
// serviceWorker.unregister();
register();
