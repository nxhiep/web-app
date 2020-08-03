import { REHYDRATE } from 'redux-persist';
import AppInfo from '../../models/AppInfo';
import { replaceItem } from '../../utils';
import * as Types from '../actions';
// import appInfoData from '../../../data.json/appInfo.json';
// const appInfosJson = JSON.parse(appInfoData);
// let map = {}
// appInfoData.forEach((info) => {
//     let appInfo = AppInfo.fromJS(info);
//     map[appInfo.appNameId] = appInfo;
// });
const initState = {
    loading: false,
    data: {},
    list: [],
    error: null,
};

const appValueState = (state = initState, action) => {

    var _a, _b, _c;
    console.log("type", action.type)
    switch (action.type) {
        case Types.GET_APP_INFO: {
            return Object.assign(Object.assign({}, state), { loading: true });
        }
        case Types.GET_APP_INFO_SUCCESS: {
            let map = (_b = state.data) !== null && _b !== void 0 ? _b : {};
            if (action.data) {
                action.data.forEach((info) => {
                    let appInfo = AppInfo.fromJS(info);
                    if (!map[appInfo.appNameId]) {
                        state.list.push(appInfo);
                    }
                    else {
                        replaceItem(state.list, 'appNameId', appInfo);
                    }
                    map[appInfo.appNameId] = appInfo;
                });
            }
            console.log("done set success")
            return Object.assign(Object.assign({}, state), { loading: false, data: map, error: null });
        }
        case Types.GET_APP_INFO_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        case Types.GET_ALL_APP_INFO: {
            return Object.assign(Object.assign({}, state), { loading: true });
        }
        case Types.GET_ALL_APP_INFO_SUCCESS: {
            console.log("reducer")
            console.log(action.data)
            let map = (_c = state.data) !== null && _c !== void 0 ? _c : {};
            if (action.data) {
                action.data.forEach((info) => {
                    let appInfo = AppInfo.fromJS(info);
                    map[appInfo.appNameId] = appInfo;
                    replaceItem(state.list, 'appNameId', appInfo);
                });
            }

            return Object.assign(Object.assign({}, state), { loading: "xxx", data: map, error: null });
        }
        case Types.GET_ALL_APP_INFO_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        default:
            return state;
    }
};
export default appValueState;
