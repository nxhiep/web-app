import { REHYDRATE } from 'redux-persist';
import AppInfo from '../../models/AppInfo';
import { replaceItem } from '../../utils';
import * as Types from '../actions';
const initState = {
    loading: false,
    data: {},
    list: [],
    error: null,
};
const appValueState = (state = initState, action) => {
    var _a, _b, _c;
    switch (action.type) {
        case REHYDRATE: {
            if (action.payload) {
                let list = (_a = action.payload.appInfoState) === null || _a === void 0 ? void 0 : _a.list;
                if (list) {
                    let map = {};
                    list.forEach((info) => {
                        let appInfo = AppInfo.fromJS(info);
                        map[appInfo.appNameId] = appInfo;
                    });
                    state.list = list;
                    state.data = map;
                }
            }
            return Object.assign({}, state);
        }
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
            return Object.assign(Object.assign({}, state), { loading: false, data: map, error: null });
        }
        case Types.GET_APP_INFO_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        case Types.GET_ALL_APP_INFO: {
            return Object.assign(Object.assign({}, state), { loading: true });
        }
        case Types.GET_ALL_APP_INFO_SUCCESS: {
            let map = (_c = state.data) !== null && _c !== void 0 ? _c : {};
            if (action.data) {
                action.data.forEach((info) => {
                    let appInfo = AppInfo.fromJS(info);
                    map[appInfo.appNameId] = appInfo;
                    replaceItem(state.list, 'appNameId', appInfo);
                });
            }
            return Object.assign(Object.assign({}, state), { loading: false, data: map, error: null });
        }
        case Types.GET_ALL_APP_INFO_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        default:
            return state;
    }
};
export default appValueState;
