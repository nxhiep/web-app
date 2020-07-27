"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.immediate");

require("core-js/modules/web.queue-microtask");

require("core-js/modules/web.url");

require("core-js/modules/web.url.to-json");

require("core-js/modules/web.url-search-params");

var _express = _interopRequireDefault(require("express"));

var _renderer = _interopRequireDefault(require("./utils/renderer.js"));

var _configureStore = _interopRequireDefault(require("./utils/configureStore"));

var _sagas = _interopRequireDefault(require("./redux/sagas"));

var _chalk = _interopRequireDefault(require("chalk"));

var actions = _interopRequireWildcard(require("./redux/actions/index"));

var app = (0, _express.default)();
app.use(_express.default.static('public'));
app.use((req, res) => {
  console.log(req.url);

  if (req.url.search('png') !== -1) {
    res.set('Content-Type', 'png');
  }

  var store = (0, _configureStore.default)();
  var context = {};

  if (context.url) {
    res.redirect(context.url);
    console.log(_chalk.default.red(context.url));
    return;
  }

  var loadableState = {};
  store.runSaga(_sagas.default); // store.dispatch(actions.getUserRatesPerfectestSaga());
  // console.log(store.getState());

  var content = (0, _renderer.default)(req, store, context, store.getState());
  res.status(200).send(content); // .done is resolved when store.close() send an END event
  // store.runSaga(rootSaga).toPromise().then( () => {
  //     const preloadedState = store.getState();
  //     const content = renderer(req, store, context, preloadedState);
  //     return res.status(200).send(content);
  // })
  // .catch((e) => {
  //     console.log(e.message)
  //     return res.status(500).send(e.message)
  // })
  // Trigger sagas for component to run
  // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
  // Dispatch a close event so sagas stop listening after they're resolved

  store.close();
});
app.listen(3000, () => {
  console.log("Server is running on 3000");
});