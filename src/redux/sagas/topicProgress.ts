import { put, select, take } from 'redux-saga/effects';
import Config from '../../config';
import TopicProgress from '../../models/TopicProgress';
import { callApi } from '../../services';
import * as Actions from '../actions/topicProgress';
import * as Types from '../actions/types';
import { resetCardInTopic } from './../actions/cardProgress';
import { TopicProgressAction } from './../actions/topicProgress';
import { AppState } from './../appstate';
import { TopicProgressState } from './../reducers/topicProgress';

function getTopicsProgressByIds(ids: Array<number>) {
    return callApi({ url: '/gettopicprogress', method: 'post', params: ids });
}

function* getTopicsProgressSaga() {
    try {
        let action: TopicProgressAction = yield take(Types.GET_QUESTION_PROGRESS_BY_IDS);
        let topicsProgressState: TopicProgressState | any = yield select((state: AppState) => state.topicProgressReducer);
        let listProgress: Array<TopicProgress> = new Array<TopicProgress>();
        if(topicsProgressState && topicsProgressState.data){
            let ids: Array<number> = action.params ?? [];
            ids.forEach(function(topicId: number){
                if(topicsProgressState.data[topicId]){
                    listProgress.push(TopicProgress.fromJS(topicsProgressState.data[topicId]));
                } else {
                    listProgress.push(TopicProgress.init(topicId, Config.USER_ID));
                }
            });
        } else {
            // let data = yield call(getTopicsProgressByIds, action.params); // TODO
            // if(data){
            //     data.forEach((element: any) => listProgress.push(TopicProgress.fromJS(element)));
            // }
        }
        yield put(Actions.getTopicsProgressByTopicIdsSuccess(listProgress));
    } catch(e){
        yield put(Actions.getTopicsProgressByTopicIdsFailure(e))
    }
}

function updateTopicsProgressApi(listProgress: Array<TopicProgress>) {
    return callApi({ url: '/update', method: 'post', params: listProgress });
}

function* updateTopicsProgress() {
    while(true) {
        try {
            let action: TopicProgressAction = yield take(Types.UPDATE_TOPICS_PROGRESS);
            // console.log("updateTopicsProgress cxxxxxxxxxxx ", action);
            // console.log("1111111111111", Object.assign({}, action));
            // let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
            // console.log("2222222222222", Object.assign({}, topicState));
            if(action.data && action.data.length > 0){
                // TODO: yield call(updateTopicsProgressApi, action.data);
                yield put(Actions.updateTopicsProgressSuccess(action.data));
            }
        } catch(e){
            // yield put(Actions.updateTopicsProgressFailure(e));
        }
    }
}

function* resetTopicProgress() {
    while(true) {
        try {
            let action: TopicProgressAction = yield take(Types.RESET_TOPIC_PROGRESS);
            let topicId = action ? (action.topicProgress ? action.topicProgress.topicId : -1) : -1; 
            if(topicId > -1){
                yield put(resetCardInTopic(topicId));
            }
        } catch(e){}
    }
}

export const topicsProgressSaga = [
    getTopicsProgressSaga(),
    updateTopicsProgress(),
    resetTopicProgress()
];