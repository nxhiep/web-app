import { REHYDRATE } from 'redux-persist';
import UserRate from '../../models/UserRate';
import * as Types from '../actions';
import { replaceItem } from '../../utils';
const initState = {
    loading: false,
    data: {},
    list: [],
    perfectest: [],
    error: null,
};
const userRateState = (state = initState, action) => {
    var _a, _b;
    console.log("userRate state test",state);
    console.log("userRate state type test " ,action.type)
    switch (action.type) {
        case Types.GET_USER_RATES: {
            return Object.assign(Object.assign({}, state), { loading: true, error: null });
        }
        case Types.GET_USER_RATES_SUCCESS: {
            let map = {};
            if (action.data) {
                action.data.forEach((u) => {
                    let userRate = UserRate.fromJS(u);
                    replaceItem(state.list, 'id', userRate);
                    if (!map[userRate.appId]) {
                        map[userRate.appId] = [];
                    }
                    map[userRate.appId].push(userRate);
                });
            }
            return Object.assign(Object.assign({}, state), { loading: false, data: map, error: null });
        }
        case Types.GET_USER_RATES_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        case Types.GET_USER_RATES_PERFECTEST: {
            return Object.assign(Object.assign({}, state), { loading: true, error: null });
        }
        case Types.GET_USER_RATES_PERFECTEST_SUCCESS: {
            console.log("userRates success reducer")
            if (action.data) {
                state.perfectest = action.data;
            }
            return Object.assign(Object.assign({}, state), { loading: false, error: null });
        }
        case Types.GET_USER_RATES_PERFECTEST_FAILURE: {
            return Object.assign(Object.assign({}, state), { loading: false, error: action.error });
        }
        default:
            return state;
    }
};
export default userRateState;
