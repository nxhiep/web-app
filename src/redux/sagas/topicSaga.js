import { call, put, select, take } from 'redux-saga/effects';
import Config from '../../config';
import Topic from '../../models/Topic';
import TopicProgress from '../../models/TopicProgress';
import { callApi } from '../../services';
import * as Actions from '../actions/topic';
import * as Types from '../actions/types';
import { getTopicsProgressByTopicIdsSuccess } from './../actions/topicProgress';
function getTopicsSagaApi(parentId) {
    return callApi({ method: 'post', url: '/data?type=get_topics_by_parent_id&parentId=' + parentId, params: null });
}
function getTopicByIdSagaApi(id) {
    return callApi({ method: 'post', url: '/data?type=get_topics_by_ids&ids=' + id, params: null });
}
function* getTopicByIdAPI(id) {
    let topicState = yield select((state) => state.topicReducer);
    let topic;
    if (topicState && topicState.data) {
        let topic = topicState.data[id];
        if (topic) {
            topic = Topic.fromJS(topic);
        }
        if (!topic) {
            console.log("loading topic by ids ", id);
            let topics = yield call(getTopicByIdSagaApi, id);
            console.log("load topic by ids ", topics);
            if (topics && topics.length > 0) {
                topic = topics[0];
            }
        }
    }
    return topic;
}
function* getTopicsByParentIdAPI(parentId) {
    let topicState = yield select((state) => state.topicReducer);
    let topics = new Array();
    if (topicState && topicState.list) {
        topicState.list.forEach((t) => {
            if (t.parentId === parentId) {
                let topic = Topic.fromJS(t);
                topics.push(topic);
            }
        });
        if (topics.length === 0) {
            topics = yield call(getTopicsSagaApi, parentId);
        }
    }
    return topics.filter((t) => t.status > -1);
}
function* getTopicsSaga() {
    var _a;
    while (true) {
        let action = yield take(Types.GET_TOPICS_BY_PARENT_ID);
        // console.log("getTopicsSaga GET_TOPICS_BY_PARENT_ID ", action)
        try {
            let data = yield call(getTopicsByParentIdAPI, action.params);
            let topicProgressState = yield select((state) => state.topicProgressReducer);
            let topicState = yield select((state) => state.topicReducer);
            let mapProgress = topicProgressState ? (_a = topicProgressState.data) !== null && _a !== void 0 ? _a : {} : {};
            // console.log("topicProgressState topicProgressState topicProgressState ", topicProgressState);
            let topics = new Array();
            // console.log("getTopicsSaga topics ", topics);
            let listTopicProgress = [];
            let mapParentTopic = {}; // Map<topicParentId, Array<Topic>>
            if (topicState && topicState.data) {
                // console.log("that khong the tin noi ", topicState);
                Object.values(topicState.data).forEach((t) => {
                    let topic = Topic.fromJS(t);
                    // console.log("wtf 1111111 topic ", topic.parentId, topic.name, ' = ', topic.getPercentComplete());
                    if (!mapParentTopic[topic.parentId]) {
                        mapParentTopic[topic.parentId] = new Array();
                    }
                    mapParentTopic[topic.parentId].push(topic);
                });
            }
            // console.log("mapParentTopic.ddddddddddddddd", mapParentTopic);
            data.sort((a, b) => a.orderIndex - b.orderIndex).forEach((topicData) => {
                // console.log("getTopicsSaga topicData ", topicData, Topic.getArguments());
                let topic = new Topic(topicData);
                if (topic.status > -1) {
                    let topicProgress = mapProgress[topic.id];
                    if (topicProgress) {
                        topic.progress = TopicProgress.fromJS(topicProgress);
                    }
                    else {
                        topic.progress = TopicProgress.init(topic.id, Config.USER_ID);
                        listTopicProgress.push(topic.progress);
                    }
                    if (Object.keys(mapParentTopic).length > 0) {
                        let count = 0;
                        let arr = mapParentTopic[topic.id];
                        if (arr && arr.length > 0) {
                            arr.forEach((childTopic) => {
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
            if (listTopicProgress.length > 0) {
                yield put(getTopicsProgressByTopicIdsSuccess(listTopicProgress));
            }
        }
        catch (e) {
            // console.log("getTopicsByParentIdFailure ", e)
            yield put(Actions.getTopicsByParentIdFailure(action.params, e));
        }
    }
}
function* getTopicByIdSaga() {
    while (true) {
        try {
            let action = yield take(Types.GET_TOPIC_BY_ID);
            let topic = getTopicByIdAPI(action.params);
            if (topic) {
                yield put(Actions.getTopicByIdSuccess(topic));
            }
            else {
                yield put(Actions.getTopicByIdFailure(action.params, 'topic null'));
            }
        }
        catch (e) {
            yield put(Actions.getTopicByIdFailure(-1, e));
        }
    }
}
export const topicsSaga = [
    getTopicsSaga(),
    getTopicByIdSaga(),
];
