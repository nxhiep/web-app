import * as Types from './types';
export function getUserRate(appId) {
    return {
        type: Types.GET_USER_RATES,
        appId: appId,
    };
}
export function getUserRateSuccess(userRates) {
    return {
        type: Types.GET_USER_RATES_SUCCESS,
        data: userRates,
    };
}
export function getUserRateFailure(error) {
    return {
        type: Types.GET_USER_RATES_FAILURE,
        error: error,
    };
}
export function getUserRatesPerfectest() {
    console.log("actions userRates")
    return {
        type: Types.GET_USER_RATES_PERFECTEST,
    };
}
export function getUserRatesPerfectestSuccess(userRates) {
    return {
        type: Types.GET_USER_RATES_PERFECTEST_SUCCESS,
        data: userRates,
    };
}
export function getUserRatesPerfectestFailure(error) {
    return {
        type: Types.GET_USER_RATES_PERFECTEST_FAILURE,
        error: error,
    };
}
