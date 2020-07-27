import "core-js/web";
import "regenerator-runtime/runtime";
import express from 'express';
import renderer from './utils/renderer.js';
import configureStore from './utils/configureStore';
import rootSaga from './redux/sagas';
import chalk from 'chalk'
import * as actions from './redux/actions/index';


const app = express();
app.use(express.static('public'));
app.use( (req, res) => {    
    console.log(req.url)
    if (req.url.search('png') !== -1) {
        res.set('Content-Type', 'png')
    }
    const store = configureStore();
    const context = {};
    if (context.url) {
        res.redirect(context.url);
        console.log(chalk.red(context.url))
        return;
    }
    let loadableState = {};
    store.runSaga(rootSaga);
    // store.dispatch(actions.getUserRatesPerfectestSaga());
    // console.log(store.getState());
    const content = renderer(req, store, context, store.getState());
    res.status(200).send(content)
    // .done is resolved when store.close() send an END event
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
//# sourceMappingURL=server.js.map