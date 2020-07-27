import { put, select, take } from 'redux-saga/effects';
import Config from '../../config';
import TopicProgress from '../../models/TopicProgress';
import { callApi } from '../../services';
import * as Actions from '../actions/topicProgress';
import * as Types from '../actions/types';
import { resetCardInTopic } from './../actions/cardProgress';
function getTopicsProgressByIds(ids) {
    return callApi({ url: '/gettopicprogress', method: 'post', params: ids });
}
function* getTopicsProgressSaga() {
    var _a;
    try {
        let action = yield take(Types.GET_QUESTION_PROGRESS_BY_IDS);
        let topicsProgressState = yield select((state) => state.topicProgressReducer);
        let listProgress = new Array();
        if (topicsProgressState && topicsProgressState.data) {
            let ids = (_a = action.params) !== null && _a !== void 0 ? _a : [];
            ids.forEach(function (topicId) {
                if (topicsProgressState.data[topicId]) {
                    listProgress.push(TopicProgress.fromJS(topicsProgressState.data[topicId]));
                }
                else {
                    listProgress.push(TopicProgress.init(topicId, Config.USER_ID));
                }
            });
        }
        else {
            // let data = yield call(getTopicsProgressByIds, action.params); // TODO
            // if(data){
            //     data.forEach((element: any) => listProgress.push(TopicProgress.fromJS(element)));
            // }
        }
        yield put(Actions.getTopicsProgressByTopicIdsSuccess(listProgress));
    }
    catch (e) {
        yield put(Actions.getTopicsProgressByTopicIdsFailure(e));
    }
}
function updateTopicsProgressApi(listProgress) {
    return callApi({ url: '/update', method: 'post', params: listProgress });
}
function* updateTopicsProgress() {
    while (true) {
        try {
            let action = yield take(Types.UPDATE_TOPICS_PROGRESS);
            // console.log("updateTopicsProgress cxxxxxxxxxxx ", action);
            // console.log("1111111111111", Object.assign({}, action));
            // let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
            // console.log("2222222222222", Object.assign({}, topicState));
            if (action.data && action.data.length > 0) {
                // TODO: yield call(updateTopicsProgressApi, action.data);
                yield put(Actions.updateTopicsProgressSuccess(action.data));
            }
        }
        catch (e) {
            // yield put(Actions.updateTopicsProgressFailure(e));
        }
    }
}
function* resetTopicProgress() {
    while (true) {
        try {
            let action = yield take(Types.RESET_TOPIC_PROGRESS);
            let topicId = action ? (action.topicProgress ? action.topicProgress.topicId : -1) : -1;
            if (topicId > -1) {
                yield put(resetCardInTopic(topicId));
            }
        }
        catch (e) { }
    }
}
export const topicsProgressSaga = [
    getTopicsProgressSaga(),
    updateTopicsProgress(),
    resetTopicProgress()
];
