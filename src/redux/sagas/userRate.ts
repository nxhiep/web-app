import { call, put, select, take } from 'redux-saga/effects';
import UserRate from '../../models/UserRate';
import { callApi } from '../../services';
import * as Types from '../actions/types';
import * as Actions from '../actions/userRate';
import { AppState } from './../appstate';
import { UserRateState } from './../reducers/userRate';

function getUserRatesPerfectestAPI() {
    return callApi({ url: '/data?type=get_user_rates_perfectest', params: null, method: 'post' });
}

function getUserRatesAPI(appId: number) {
    return callApi({ url: '/data?type=get_user_rates&appId=' + appId, params: null, method: 'post' });
}

function* getUserRatesPerfectestSaga() {
    while(true) {
        try {
            yield take(Types.GET_USER_RATES_PERFECTEST);
            let userRateState: UserRateState = yield select((appState: AppState) => appState.userRateState);
            let userRates: Array<UserRate> = new Array<UserRate>();
            if(userRateState && userRateState.perfectest){
                userRates = userRateState.perfectest.map((u: any) => UserRate.fromJS(u));
            }
            if(!userRates || userRates.length === 0){
                let result = yield call(getUserRatesPerfectestAPI);
                result && result.forEach((s: any) => {
                    s = UserRate.fromJS(s);
                    userRates.push(s);
                });
            }                
            yield put(Actions.getUserRatesPerfectestSuccess(userRates));
        } catch(e) {
            yield put(Actions.getUserRatesPerfectestFailure(e));
        }
    }
}

function* getUserRatesSaga() {
    while(true) {
        try {
            let action = yield take(Types.GET_USER_RATES);
            let appId: number = action.appId;
            let userRateState: UserRateState = yield select((appState: AppState) => appState.userRateState);
            let userRates: Array<UserRate> = new Array<UserRate>();
            console.log("userRateState", userRateState, 'appId', appId);
            if(userRateState && userRateState.data && userRateState.data[appId]){
                userRates = userRateState.data[appId].map((u: any) => UserRate.fromJS(u));
            }
            console.log("userRates", userRates);
            if(!userRates || userRates.length === 0){
                let result = yield call(getUserRatesAPI, appId);
                result && result.forEach((s: any) => {
                    s = UserRate.fromJS(s);
                    userRates.push(s);
                });
            }
            yield put(Actions.getUserRateSuccess(userRates));
        } catch(e){
            yield put(Actions.getUserRateFailure(e));
        }
    }
}

export const userRateSaga = [
    getUserRatesSaga(),
    getUserRatesPerfectestSaga()
];