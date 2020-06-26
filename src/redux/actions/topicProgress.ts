import Topic from "../../models/Topic";
import TopicProgress from "../../models/TopicProgress";
import * as Types from "./types";
import Progress from "../../models/Progress";

export interface TopicProgressAction {
    type: string,
    data?: any, // { topicId: TopicProgress }
    params?: any,
    error?: any,
    topic?: Topic | any,
    parentTopic?: Topic | any,
    progress?: Progress | any,
    topicProgress?: TopicProgress
}

export const resetTopicProgress = (topicProgress: TopicProgress) : TopicProgressAction => {
    return {
        type: Types.RESET_TOPIC_PROGRESS, 
        topicProgress: topicProgress,
    };
}

export const calcularTopicsProgress = (topic: Topic, progress: Progress) : TopicProgressAction => {
    return {
        type: Types.CALCULAR_TOPICS_PROGRESS, 
        topic: topic,
        progress: progress,
    };
}

export const calcularParentTopicsProgress = (childTopic: Topic, parentTopic: Topic) : TopicProgressAction => {
    return {
        type: Types.CALCULAR_PARENT_TOPICS_PROGRESS, 
        topic: childTopic,
        parentTopic: parentTopic,
    };
}

export const updateTopicsProgress = (topicsProgress: Array<TopicProgress>) : TopicProgressAction => {
    return {
        type: Types.UPDATE_TOPICS_PROGRESS, 
        data: topicsProgress
    };
}

export const updateTopicsProgressSuccess = (topicsProgress: Array<TopicProgress>) : TopicProgressAction => {
    return {
        type: Types.UPDATE_TOPICS_PROGRESS_SUCCESS, 
        data: topicsProgress
    };
}

export const getTopicsProgressByTopicIds = (ids: Array<number>) : TopicProgressAction => {
    return { 
        type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS, 
        params: ids,
    };
}
export const getTopicsProgressByTopicIdsSuccess = (topicsProgress: Array<TopicProgress>) : TopicProgressAction => {
    return { 
        type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_SUCCESS, 
        data: topicsProgress
    };
}
export const getTopicsProgressByTopicIdsFailure = (error: any) : TopicProgressAction => {
    return { 
        type: Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_FAILURE, 
        error: error,
    };
}