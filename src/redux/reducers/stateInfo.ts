import { REHYDRATE } from 'redux-persist';
import { Reducer } from 'redux';
import { StateInfoAction } from '../actions/stateInfo';
import { StateInfo } from "../../models/StateInfo";
import * as Types from '../actions';
import { replaceItem } from '../../utils';

export interface StateInfoState {
    loading: boolean,
    list: Array<StateInfo>,
    data: any,
    error: any,
    listCurrentState: Array<StateInfo>,
    mapCurrentStateInfo: any
  }
  
const InitialStateInfo = {
    loading: false,
    data: {}, // { stateId: state }
    list: [],
    error: null,
    listCurrentState: [],
    mapCurrentStateInfo: {}
};

const stateInfoState: Reducer<StateInfoState> = (state: StateInfoState = InitialStateInfo, action: StateInfoAction | any): StateInfoState => {
    let mapStateInfo = state.data ?? {};
    switch (action.type) {
        case REHYDRATE: {
            if (action.payload && action.payload['stateInfoState']) {
                let list = action.payload['stateInfoState']['list'];
                let listCurrentState = action.payload['stateInfoState']['listCurrentState'];
                if(listCurrentState){
                    listCurrentState.forEach((s: any) => {
                        let stateInfo: StateInfo = StateInfo.fromJS(s);
                        state.mapCurrentStateInfo[stateInfo.parentId] = stateInfo;
                    });
                    state.listCurrentState = listCurrentState;
                }
                if (list) {
                  list.forEach((t: any) => {
                    let stateInfo: StateInfo = StateInfo.fromJS(t);
                    mapStateInfo[stateInfo.id] = stateInfo;
                  });
                  state.data = mapStateInfo;
                }
            }
            return { ...state };
        }
        case Types.GET_STATE_INFO: {
            return { ...state, loading: true };
        }
        case Types.GET_STATE_INFO_SUCCESS: {
            if(action.data){
                action.data.forEach((s: StateInfo) => {
                    s = StateInfo.fromJS(s);
                    if(!mapStateInfo[s.id]){
                        state.list.push(s);
                    } else {
                        replaceItem(state.list, 'id', s);
                    }
                    mapStateInfo[s.id] = s;
                });
            }
            return { ...state, loading: false, data: mapStateInfo, error: null };
        }
        case Types.SET_CURRENT_STATE_INFO: {
            if(action.currentStateInfo){
                let s = StateInfo.fromJS(action.currentStateInfo);
                if(state.mapCurrentStateInfo[s.parentId]){
                    replaceItem(state.listCurrentState, 'id', s);
                } else {
                    state.listCurrentState.push(s);
                }
                state.mapCurrentStateInfo[s.parentId] = s;
            }
            return { ...state };
        }
        case Types.GET_STATE_INFO_FAILURE: {
            return { ...state, loading: false, error: action.error };
        }
        default: return { ...state };
    }
}

export default stateInfoState;