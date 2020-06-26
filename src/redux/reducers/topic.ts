import { Reducer } from "redux";
import { REHYDRATE } from 'redux-persist';
import Topic from "../../models/Topic";
import * as Types from "../actions/types";
import { replaceItem } from "../../utils";
export interface TopicState {
  loading: boolean,
  list: Array<Topic>,
  data: any,
  error: any,
}

const InitialTopisState = {
  loading: false,
  data: {}, // { topicId: topic }
  list: [],
  error: null,
};
const topicReducer: Reducer<TopicState> = (state: TopicState = InitialTopisState, action): TopicState => {
  // console.log("topicReducer FFFFFFFFFFFFFFFFFFF ", state, action);
  let mapTopic = state.data ?? {};
  switch (action.type) {
    case REHYDRATE: {
      // console.log("topicReducer REHYDRATE gggggggg", Object.assign({}, action.payload));
      if (action.payload && action.payload['topicReducer']) {
        let list = action.payload['topicReducer']['list'];
        // console.log("topicReducer ffffffff", Object.assign({}, list));
        if (list) {
          list.forEach((t: any) => {
            let topic: Topic = Topic.fromJS(t);
            mapTopic[topic.id] = topic;
          });
          state.loading = true;
          state.data = mapTopic;
          state.list = list;
        }
      } 
      return { ...state };
    }
    case Types.GET_TOPICS_BY_PARENT_ID: {
      return { ...state, loading: true };
    }
    case Types.GET_TOPICS_BY_PARENT_ID_SUCCESS: {
      action.data && action.data.forEach((t: Topic) => {
        let topic: Topic = Topic.fromJS(t);
        if(!mapTopic[topic.id]){
          state.list.push(topic);
        } else {
          replaceItem(state.list, 'id', topic);
        }
        mapTopic[topic.id] = topic;
      });
      return { ...state, loading: false, data: mapTopic, error: null };
    }
    case Types.GET_TOPICS_BY_PARENT_ID_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    case Types.GET_TOPIC_BY_ID: {
      return { ...state, loading: true };
    }
    case Types.GET_TOPIC_BY_ID_SUCCESS: {
      let topic: Topic = action.data;
      if(topic){
        if(!mapTopic[topic.id]){
          state.list.push(topic);
        } else {
          replaceItem(state.list, 'id', topic);
        }
        mapTopic[topic.id] = topic;
      }
      return { ...state, loading: false, data: mapTopic, error: null };
    }
    case Types.GET_TOPIC_BY_ID_FAILURE: {
      return { ...state, loading: false, error: action.error }
    }
    default:
      return state;
  }
};

export default topicReducer;