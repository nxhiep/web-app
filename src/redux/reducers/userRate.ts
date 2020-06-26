import { Reducer } from 'redux';
import { REHYDRATE } from 'redux-persist';
import UserRate from '../../models/UserRate';
import * as Types from '../actions';
import { UserRateAction } from './../actions/userRate';
import { replaceItem } from '../../utils';

export interface UserRateState {
    loading: boolean,
    list: Array<UserRate>,
    data: any,
    perfectest: Array<UserRate>,
    error: any,
}

const initState = {
    loading: false,
    data: {}, // map { appId: [list user rate] }
    list: [],
    perfectest: [],
    error: null,
}

const userRateState: Reducer<UserRateState> = (state: UserRateState = initState, action: UserRateAction | any ): UserRateState => {
    switch (action.type) {
        case REHYDRATE: {
            if(action.payload){
                let list = action.payload.userRateState?.list;
                let perfectests = action.payload.userRateState?.perfectest;
                if(perfectests){
                    let listPerfect: Array<UserRate> = [];
                    perfectests.forEach((info: any) => {
                        let userRate: UserRate = UserRate.fromJS(info);
                        listPerfect.push(userRate);
                    });
                    state.perfectest = listPerfect;
                }
                if(list){
                    let map: any = {};
                    list.forEach((info: any) => {
                        let userRate: UserRate = UserRate.fromJS(info);
                        if(!map[userRate.appId]) {
                            map[userRate.appId] = [];
                        }
                        map[userRate.appId].push(userRate);
                    });
                    state.list = list;
                    state.data = map;
                }
            }
            return { ...state };
        }
        case Types.GET_USER_RATES: {
            return { ...state, loading: true, error: null };
        }
        case Types.GET_USER_RATES_SUCCESS: {
            let map: any = {};
            if(action.data){
                action.data.forEach((u: UserRate) => {
                    let userRate: UserRate = UserRate.fromJS(u);
                    replaceItem(state.list, 'id', userRate);
                    if(!map[userRate.appId]) {
                        map[userRate.appId] = [];
                    }
                    map[userRate.appId].push(userRate);
                });
            }
            return { ...state, loading: false, data: map, error: null };
        }
        case Types.GET_USER_RATES_FAILURE: {
            return { ...state, loading: false, error: action.error };
        }
        case Types.GET_USER_RATES_PERFECTEST: {
            return { ...state, loading: true, error: null }
        }
        case Types.GET_USER_RATES_PERFECTEST_SUCCESS: {
            if(action.data){
                state.perfectest = action.data;
            }
            return { ...state, loading: false, error: null }
        }
        case Types.GET_USER_RATES_PERFECTEST_FAILURE: {
            return { ...state, loading: false, error: action.error }
        }
        default:
            return state;
    }
}

export default userRateState;