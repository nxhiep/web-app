import * as Types from "./types";
import Topic from "../../models/Topic";

export interface TopicAction {
    type: string,
    params: number,
    data?: Array<Topic>,
    topic?: Topic | any;
    error?: any
}

export const getTopicById = (id: number) : TopicAction => {
    return { 
        type: Types.GET_TOPIC_BY_ID, 
        params: id,
    };
}

export const getTopicByIdSuccess = (topic: Topic) : TopicAction => {
    return { 
        type: Types.GET_TOPIC_BY_ID_SUCCESS, 
        params: topic ? topic.id : -1,
        topic: topic,
    };
}

export const getTopicByIdFailure = (id: number, error: any) : TopicAction => {
    return { 
        type: Types.GET_TOPIC_BY_ID_FAILURE, 
        params: id,
        error: error,
    };
}

export const getTopicsByParentId = (parentId: number) : TopicAction => {
    return { 
        type: Types.GET_TOPICS_BY_PARENT_ID, 
        params: parentId,
    };
}
export const getTopicsByParentIdSuccess = (parentId: number, topics: Array<Topic>) : TopicAction => {
    return { 
        type: Types.GET_TOPICS_BY_PARENT_ID_SUCCESS, 
        params: parentId,
        data: topics
    };
}
export const getTopicsByParentIdFailure = (parentId: number, error: any) : TopicAction => {
    return { 
        type: Types.GET_TOPICS_BY_PARENT_ID_FAILURE, 
        params: parentId,
        error: error,
    };
}