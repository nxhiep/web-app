import * as Types from './types';
export function getAppInfo(appNameId) {
    return {
        type: Types.GET_APP_INFO,
        appNameId: appNameId,
    };
}
export function getAppInfoSuccess(appInfos) {
    return {
        type: Types.GET_APP_INFO_SUCCESS,
        data: appInfos,
    };
}
export function getAppInfoFailed(error) {
    return {
        type: Types.GET_APP_INFO_FAILURE,
        error: error,
    };
}
export function getAllAppInfo() {
    return {
        type: Types.GET_ALL_APP_INFO,
    };
}
export function getAllAppInfoSuccess(appInfos) {
    return {
        type: Types.GET_ALL_APP_INFO_SUCCESS,
        data: appInfos,
    };
}
export function getAllAppInfoFailed(error) {
    return {
        type: Types.GET_ALL_APP_INFO_FAILURE,
        error: error,
    };
}
