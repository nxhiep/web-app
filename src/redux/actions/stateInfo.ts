import { StateInfo } from '../../models/StateInfo';
import * as Types from './types';

export interface StateInfoAction {
    type: string,
    parentId?: number,
    data?: Array<StateInfo>,
    error?: any,
    currentStateInfo?: StateInfo
}

export const getStateInfo = (parentId: number) : StateInfoAction => {
    return {
        type: Types.GET_STATE_INFO,
        parentId: parentId
    }
}

export const getStateInfoSuccess = (states: Array<StateInfo>) : StateInfoAction => {
    return {
        type: Types.GET_STATE_INFO_SUCCESS,
        data: states
    }
}

export const getStateInfoFailure = (error: any) : StateInfoAction => {
    return {
        type: Types.GET_STATE_INFO_FAILURE,
        error: error
    }
}

export const setCurrentStateInfo = (stateInfo: StateInfo) : StateInfoAction => {
    return {
        type: Types.SET_CURRENT_STATE_INFO,
        currentStateInfo: stateInfo
    }
}