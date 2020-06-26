import { call, put, select, take, delay } from 'redux-saga/effects';
import Config from '../../config';
import Topic from '../../models/Topic';
import TopicProgress from '../../models/TopicProgress';
import { callApi } from '../../services';
import * as Actions from '../actions/topic';
import * as Types from '../actions/types';
import { TopicState } from '../reducers/topic';
import { getTopicsProgressByTopicIdsSuccess } from './../actions/topicProgress';
import { AppState } from './../appstate';
import { TopicProgressState } from './../reducers/topicProgress';

function getTopicsSagaApi(parentId: number) {
    return callApi({ method: 'post', url: '/data?type=get_topics_by_parent_id&parentId=' + parentId, params: null });
}

function getTopicByIdSagaApi(id: number) {
    return callApi({ method: 'post', url: '/data?type=get_topics_by_ids&ids=' + id, params: null });
}

function* getTopicByIdAPI(id: number) : any {
    let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
    let topic: Topic | undefined;
    if(topicState && topicState.data){
        let topic: Topic = topicState.data[id];
        if(topic){
            topic = Topic.fromJS(topic);
        }
        if(!topic){
            console.log("loading topic by ids ", id);
            let topics: Array<Topic> = yield call(getTopicByIdSagaApi, id);
            console.log("load topic by ids ", topics);
            if(topics && topics.length > 0){
                topic = topics[0];
            }
        }
    }
    return topic;
}

function* getTopicsByParentIdAPI(parentId: number) {
    let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
    let topics: Array<Topic> = new Array<Topic>();
    if(topicState && topicState.list){
        topicState.list.forEach((t) => {
            if(t.parentId === parentId) {
                let topic = Topic.fromJS(t);
                topics.push(topic);
            }
        });
        if(topics.length === 0){
            topics = yield call(getTopicsSagaApi, parentId);
        }
    }
    return topics.filter((t) => t.status > -1);
}

function* getTopicsSaga() {
    while(true) {
        let action = yield take(Types.GET_TOPICS_BY_PARENT_ID);
        // console.log("getTopicsSaga GET_TOPICS_BY_PARENT_ID ", action)
        try {
            let data = yield call(getTopicsByParentIdAPI, action.params);
            let topicProgressState: TopicProgressState = yield select((state: AppState) => state.topicProgressReducer);
            let topicState: TopicState = yield select((state: AppState) => state.topicReducer);
            let mapProgress: any = topicProgressState ? topicProgressState.data ?? {} : {};
            // console.log("topicProgressState topicProgressState topicProgressState ", topicProgressState);
            let topics = new Array<Topic>();
            // console.log("getTopicsSaga topics ", topics);
            let listTopicProgress: Array<TopicProgress> = [];
            let mapParentTopic: any = {}; // Map<topicParentId, Array<Topic>>
            if(topicState && topicState.data){
                // console.log("that khong the tin noi ", topicState);
                Object.values(topicState.data).forEach((t: Topic | any) => {
                    let topic: Topic = Topic.fromJS(t);
                    // console.log("wtf 1111111 topic ", topic.parentId, topic.name, ' = ', topic.getPercentComplete());
                    if(!mapParentTopic[topic.parentId]){
                        mapParentTopic[topic.parentId] = new Array<Topic>();
                    }
                    mapParentTopic[topic.parentId].push(topic);
                })
            }
            // console.log("mapParentTopic.ddddddddddddddd", mapParentTopic);
            data.sort((a: any, b: any) => a.orderIndex - b.orderIndex).forEach((topicData: any) => {
                // console.log("getTopicsSaga topicData ", topicData, Topic.getArguments());
                let topic : Topic = new Topic(topicData);
                if(topic.status > -1){
                    let topicProgress: TopicProgress | any = mapProgress[topic.id];
                    if(topicProgress){
                        topic.progress = TopicProgress.fromJS(topicProgress);
                    } else {
                        topic.progress = TopicProgress.init(topic.id, Config.USER_ID);
                        listTopicProgress.push(topic.progress);
                    }
                    if(Object.keys(mapParentTopic).length > 0){
                        let count = 0;
                        let arr: Array<Topic> = mapParentTopic[topic.id];
                        if(arr && arr.length > 0){
                            arr.forEach((childTopic: Topic) => {
                                count += childTopic.getPercentComplete();
                            });
                            topic.progress.progress = Math.round((count / (arr.length * 100)) * 100);
                        }
                    }
                    topics.push(topic);
                }
            });
            // console.log("getTopicsSaga topics ", topics, 'listTopicProgress', listTopicProgress);
            yield put(Actions.getTopicsByParentIdSuccess(action.params, topics));
            if(listTopicProgress.length > 0){
                yield put(getTopicsProgressByTopicIdsSuccess(listTopicProgress));
            }
        } catch(e){
            // console.log("getTopicsByParentIdFailure ", e)
            yield put(Actions.getTopicsByParentIdFailure(action.params, e));
        }
    }
}

function* getTopicByIdSaga() {
    while(true) {
        try {
            let action = yield take(Types.GET_TOPIC_BY_ID);
            let topic: Topic = getTopicByIdAPI(action.params);
            if(topic){
                yield put(Actions.getTopicByIdSuccess(topic));
            } else {
                yield put(Actions.getTopicByIdFailure(action.params, 'topic null'));
            }
        } catch(e) {
            yield put(Actions.getTopicByIdFailure(-1, e));
        }
    }
}

export const topicsSaga = [
    getTopicsSaga(),
    getTopicByIdSaga(),
];