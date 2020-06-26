import { AppState } from './../appstate';
import { call, put, select, take, delay } from 'redux-saga/effects';
import { callApi } from '../../services';
import * as Actions from '../actions/stateInfo';
import * as Types from '../actions/types';
import { StateInfo } from './../../models/StateInfo';
import { StateInfoState } from './../reducers/stateInfo';

function getStateInfoAPI(appId: number) {
    return callApi({ url: '/data?type=get_states&appId=' + appId, params: null, method: 'post' });
}

function* getStateInfoSaga() {
    while(true) {
        try {
            let action = yield take(Types.GET_STATE_INFO);
            console.log("getStateInfoSaga ", action)
            let appId: number = action.parentId;
            let stateInfoState: StateInfoState = yield select((appState: AppState) => appState.stateInfoState);
            let stateInfos: Array<StateInfo> = new Array<StateInfo>();
            if(stateInfoState && stateInfoState.list){
                stateInfoState.list.forEach((s) => {
                    s = StateInfo.fromJS(s);
                    stateInfos.push(s);
                })
            }
            if(stateInfos.length === 0){
                let result = yield call(getStateInfoAPI, appId);
                result && result.forEach((s: any) => {
                    s = StateInfo.fromJS(s);
                    stateInfos.push(s);
                });
            } else {
                yield delay(0);
            }
            yield put(Actions.getStateInfoSuccess(stateInfos));
        } catch(e){
            yield put(Actions.getStateInfoFailure(e));
        }
    }
}

export const stateInfoSaga = [
    getStateInfoSaga()
];