import { Reducer } from 'redux';
import { REHYDRATE } from 'redux-persist';
import TestSetting from "../../models/TestSetting";
import { TestSettingTypes } from "../actions/test-setting";
import * as Types from '../actions/types.js';
import { TestSettingState } from '../appstate';

const initialState = {
    data: [],
    currentSetting: undefined
}

const testSettingReducer: Reducer<TestSettingState> = (state: TestSettingState = initialState, action: TestSettingTypes | any): TestSettingState => {
    switch (action.type) {
        case Types.LOAD_TEST_SETTING_BY_TOPIC_ID:
            let appId = action.appId;
            let topicId = action.topicId;
            let topicIds = action.topicIds;
            let currentSetting: TestSetting | undefined = state.data.find((item: TestSetting) => (item.topicId == topicId));
            // console.log("currentSetting", currentSetting);
            if (currentSetting) {
                state.currentSetting = currentSetting;
            } else {
                state.currentSetting = TestSetting.init(appId, topicId, topicIds);
            }
            return { ...state };
        case REHYDRATE:
            let result = new Array<TestSetting>();
            // console.log("ACTIONNNNNNNNN", action)
            if (action.payload && action.payload['testSettingState']) {
                let lists = action.payload['testSettingState']['data'];
                if(lists) {
                    for (let i = 0; i < lists.length; i++) {
                        const element = lists[i];
                        let testSetting = TestSetting.fromJS(element);
                        result.push(testSetting);
                    }
                }
                let currentTestSettingData = action.payload['testSettingState']['currentSetting'];
                if(currentTestSettingData){
                    state.currentSetting = TestSetting.fromJS(currentTestSettingData);
                }
                state.data = result;
            }
            return { ...state };
        case Types.SAVE_NEW_TEST_SETTING: {
            let topicId = action.topicId;
            state.data = state.data.filter((item: TestSetting) => (item.topicId != topicId));
            state.data.push(action.setting);
            state.currentSetting = action.setting;
            return { ...state };
        }
        case Types.UPDATE_TEST_SETTING: {
            let topicId = action.topicId;
            state.data = state.data.filter((item: TestSetting) => (item.topicId != topicId));
            action.testSetting.contentTest = action.topicIds;
            state.data.push(action.testSetting);
            state.currentSetting = action.testSetting;
            return { ...state };
        }
        default: return { ...state };
    }
}


export { testSettingReducer };
