import UserRate from '../../models/UserRate';
import * as Types from './types';

export interface UserRateByAppIdAction {
    type: string,
    appId?: number,
    data?: Array<UserRate>,
    error?: any,
}

export interface UserRatePerfectestAction {
    type: string,
    data?: Array<UserRate>,
    error?: any,
}

export type UserRateAction = UserRateByAppIdAction | UserRatePerfectestAction;

export function getUserRate(appId: number): UserRateAction {
    return {
        type: Types.GET_USER_RATES, 
        appId: appId,
    };
}

export function getUserRateSuccess(userRates: Array<UserRate>): UserRateAction {
    return {
        type: Types.GET_USER_RATES_SUCCESS, 
        data: userRates,
    };
}

export function getUserRateFailure(error: any): UserRateAction {
    return {
        type: Types.GET_USER_RATES_FAILURE, 
        error: error,
    };
}

export function getUserRatesPerfectest(): UserRatePerfectestAction {
    return {
        type: Types.GET_USER_RATES_PERFECTEST, 
    };
}

export function getUserRatesPerfectestSuccess(userRates: Array<UserRate>): UserRatePerfectestAction {
    return {
        type: Types.GET_USER_RATES_PERFECTEST_SUCCESS, 
        data: userRates,
    };
}

export function getUserRatesPerfectestFailure(error: any): UserRatePerfectestAction {
    return {
        type: Types.GET_USER_RATES_PERFECTEST_FAILURE, 
        error: error,
    };
}
