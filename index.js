import express from 'express';
import renderer from './src/utils/renderer.js';
import configureStore from './src/utils/configureStore';
import rootSaga from './src/redux/sagas';
import * as functions from 'firebase-functions'
import compress from 'compression'
const admin = require('firebase-admin');
admin.initializeApp();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));
app.use(compress())
app.get('*', (req, res) => {    
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
    return res.status(200).send(content)
    store.close();
});
app.get('/', )
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
export let ssr = functions.https.onRequest(app);
// //# sourceMappingURL=server.js.map



// const functions = require('firebase-functions');

// exports.bigben = functions.https.onRequest((req, res) => {
//   const hours = (new Date().getHours() % 12) + 1  // London is UTC + 1hr;
//   res.status(200).send(`<!doctype html>
//     <head>
//       <title>Time</title>
//     </head>
//     <body>
//       ${'BONG '.repeat(hours)}
//     </body>
//   </html>`);
// });