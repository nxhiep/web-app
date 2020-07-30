import "core-js/web";
import "regenerator-runtime/runtime";
import express from 'express';
import renderer from './src/utils/renderer.js';
import configureStore from './src/utils/configureStore';
import rootSaga from './src/redux/sagas';
import chalk from 'chalk'
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
app.listen(3005, () => {
    console.log("3000")
})


//# sourceMappingURL=server.js.map