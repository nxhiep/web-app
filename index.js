import "core-js/web";
import "regenerator-runtime/runtime";
import express from 'express';
import renderer from './src/utils/renderer.js';
import configureStore from './src/utils/configureStore';
import rootSaga from './src/redux/sagas';
import chalk from 'chalk'
import * as functions from 'firebase-functions'
import compress from 'compression'
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));
app.use(compress())
app.use( (req, res) => {    
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
    res.set('Accept-Encoding: gzip, compress, br')
    res.status(200).send(content)
    store.close();
});
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
export let ssr = functions.https.onRequest(app);
//# sourceMappingURL=server.js.map