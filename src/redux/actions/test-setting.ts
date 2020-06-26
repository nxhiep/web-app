import TestSetting from '../../models/TestSetting';
import { RehydrateAction } from './game.js';
import * as Types from './types.js';
interface LoadTestSettingByTopicIdAction {
    type: typeof Types.LOAD_TEST_SETTING_BY_TOPIC_ID,
    appId: number,
    topicId: number,
    topicIds: Array<number>,
}

interface SaveNewTestSettingAction {
    type: typeof Types.SAVE_NEW_TEST_SETTING,
    setting: TestSetting,
    topicId: number,
    appId: number
}

interface UpdateTestSettingAction {
    type: typeof Types.UPDATE_TEST_SETTING,
    testSetting: TestSetting,
    topicIds: Array<number>,
    topicId: number,
    appId: number
}

export type TestSettingTypes = LoadTestSettingByTopicIdAction | SaveNewTestSettingAction | RehydrateAction | UpdateTestSettingAction;

export const loadTestSettingByTopicId = (params: {appId: number, topicId: number, topicIds: Array<number>}) : LoadTestSettingByTopicIdAction => {
    return {
        type: Types.LOAD_TEST_SETTING_BY_TOPIC_ID,
        appId: params.appId,
        topicId: params.topicId,
        topicIds: params.topicIds
    }
}
export const saveNewTestSetting = (params: {setting: TestSetting, appId: number, topicId: number}) : SaveNewTestSettingAction => {
    return {
        type: Types.SAVE_NEW_TEST_SETTING,
        setting: params.setting,
        topicId: params.topicId,
        appId: params.appId
    }
}

export const updateTestSetting = (appId: number, topicId: number, testSetting: TestSetting, topicIds: Array<number>) : UpdateTestSettingAction => {
    return {
        type: Types.UPDATE_TEST_SETTING,
        testSetting: testSetting,
        topicIds: topicIds,
        topicId: topicId,
        appId: appId,
    }
}
