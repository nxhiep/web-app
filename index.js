import express from 'express';
import renderer from './src/utils/renderer.js';
import configureStore from './src/utils/configureStore';
import compress from 'compression'
import { callApi } from './src/services/index.js';
import AppInfo from './src/models/AppInfo.js';
import UserRate from './src/models/UserRate.js';
import { replaceItem } from "./src/utils.js";
import cors from 'cors'
import { StateInfo } from "./src/models/StateInfo.js";
const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp();
const listAppNameId = ["dmv-permit-practice-test-2020", "ati-teas-vi-practice-test", "ged-practice-test-free-2020", "comptia-network-exam-training",
"comptia-a-exam-training", "hesi-a2-practice-test-free-2020", "pmp-exam-prep-6th-edition", "cissp-practice-test-free-2020", "g1-practice-test-2020",
"motorcycle-permit-practice-test", "driving-theory-uk-practice-test-2020", "comptia-security-exam-training", "ptcb-pharmacy-technician-certification-exam-prep",
"cdl-practice-test-2020", "asvab-practice-test-2020", "dkt-nsw-learner-car-practice-test-2020", "cna-practice-test-free-2020", "real-estate-license-exam-prep",
"college-board-accuplacer-study-app"
]
const app = express();
app.use(compress())
app.use(express.static('public'));
app.get('/', async (req, res) => {


    var appInfos = await callApi({ url: '/data?type=get_all_app_info', params: null, method: 'post' });
    var mapAppInfo = {};
    var listData = [];
    appInfos.forEach(x => {
        var xx = AppInfo.fromJS(x);
        mapAppInfo[xx.appNameId] = xx;
        listData.push(xx);
    })
    var mapUserRate = []
    var getUserRates = await callApi({ url: '/data?type=get_user_rates_perfectest', params: null, method: 'post' });
    getUserRates.forEach(userRate => {
        var temp = UserRate.fromJS(userRate);
        mapUserRate.push(temp);
    })
    var initState = {
        appInfoState: {
            data: mapAppInfo,
            list: listData,
            loading: false,
            error: null
        },
        userRateState: {
            loading: false,
            data: {},
            list: [],
            perfectest: mapUserRate,
            error: null
        }
    };
    const store = configureStore(initState);
    const context = {};
    const description = "With thousands of our FREE practice questions, we are here to help you achieve your gate of success with our test prep solutions."
    const title = "ABC Learning"
    const content = renderer(req.url, store, context,description,title)
    res.status(200).send(content)

})



app.get('/:appNameId', async (req, res) => {
    console.log(req.path )
    if (listAppNameId.indexOf(req.params.appNameId) != -1) {
        const appNameId = req.params.appNameId;
        const getAppInfo = await callApi({ url: '/data?type=get_app_info&appNameId=' + appNameId, params: null, method: 'post' });
        const appInfo = AppInfo.fromJS(getAppInfo);
        let mapAppInfo = {};
        let listData = []
        mapAppInfo[appInfo.appNameId] = appInfo;
        listData.push(appInfo);

        const userRateId = await callApi({ url: '/data?type=get_user_rates&appId=' + appInfo.id, params: null, method: 'post' });
        let mapUserRate = {}
        let listUserRate = []
        userRateId.forEach((u) => {
            let userRate = UserRate.fromJS(u);
            replaceItem(listUserRate, 'id', userRate);
            console.log("appInfo.id", appInfo.id)
            if (!mapUserRate[appInfo.id]) {
                mapUserRate[appInfo.id] = [];
            }
            mapUserRate[appInfo.id].push(userRate)
        });
        let mapStateInfo = {};
        let listStateInfo = []
        console.log("list state info start")
        if (appInfo.hasState) {
            const stateApi = await callApi({ url: '/data?type=get_states&appId=' + appInfo.id, params: null, method: 'post' });
            stateApi.forEach((s) => {
                let stateInfo = StateInfo.fromJS(s);
                if (!mapStateInfo[stateInfo.id]) {
                    listStateInfo.push(stateInfo);
                }
                else {
                    replaceItem(listStateInfo, 'id', stateInfo);
                }
                mapStateInfo[stateInfo.id] = stateInfo;
            });
            console.log("list state info end")
        }
        const initState = {
            appInfoState: {
                data: mapAppInfo,
                list: listData,
                loading: false,
                error: null
            },
            userRateState: {
                loading: false,
                data: mapUserRate,
                list: listUserRate,
                perfectest: [],
                error: null
            },
            stateInfoState: {
                loading: false,
                data: mapStateInfo,
                list : listStateInfo,
                error: null,
                listCurrentState: [],
                mapCurrentStateInfo: {}
            }
        }
        const store = configureStore(initState);
        const context = {};
        res.send(renderer(req.url, store, context,appInfo.description,appInfo.title))
        // res.send("hello");
    }


    // console.log(getAppInfo)
    // if ()
})
app.all('/:appNameId/:screen', async (req,res) => {
    if (listAppNameId.indexOf(req.params.appNameId) != -1) {
        const appNameId = req.params.appNameId;
        const getAppInfo = await callApi({ url: '/data?type=get_app_info&appNameId=' + appNameId, params: null, method: 'post' });
        const appInfo = AppInfo.fromJS(getAppInfo);
        let mapAppInfo = {};
        let listData = []
        mapAppInfo[appInfo.appNameId] = appInfo;
        listData.push(appInfo);
        const initState = {
            appInfoState: {
                data: mapAppInfo,
                list: listData,
                loading: false,
                error: null
            }
        }
        const store = configureStore(initState);
        const context = {};
        res.send(renderer(req.url, store, context))
    }
})
exports.ssr = functions.https.onRequest(app);