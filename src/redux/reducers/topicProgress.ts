import { Reducer } from "redux";
import { REHYDRATE } from 'redux-persist';
import Progress from '../../models/Progress';
import Topic from "../../models/Topic";
import TopicProgress from '../../models/TopicProgress';
import { replaceItem } from "../../utils";
import * as Types from "../actions/types";
import { TopicProgressAction } from './../actions/topicProgress';
export interface TopicProgressState {
  loading: boolean,
  data: {}, // { topicId: TopicProgress }
  list: Array<TopicProgress>,
  error: any,
}

const InitialTopisState = {
  loading: false,
  data: {}, // parentId : { topicId: topic }
  list: [],
  error: null,
};

const topicProgressReducer: Reducer<TopicProgressState> = (state: TopicProgressState = InitialTopisState, action: TopicProgressAction | any): TopicProgressState => {
  let mapProgress: any = state.data ?? {};
  // let listProgress: Array<TopicProgress> = state.data ?? [];
  switch (action.type) {
    case REHYDRATE: {
      // console.log("topicProgressReducer REHYDRATE", state, " ---- action", action);
      if (action.payload && action.payload['topicProgressReducer']) {
        let list: any = action.payload['topicProgressReducer']['list'];
        // console.log("ftopicProgressReducer fffffff", data);
        if (list) {
          list.forEach((p: TopicProgress) => {
            let progress: TopicProgress = TopicProgress.fromJS(p);
            mapProgress[progress.topicId] = progress;
            state.list.push(progress);
          });
          state.list = list;
          state.data = mapProgress;
        }
      }
      return { ...state };
    }
    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS: {
      return { ...state, loading: true };
    }
    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_SUCCESS: {
      if(action.data){
        action.data.forEach((p: TopicProgress) => {
          let progress: TopicProgress = TopicProgress.fromJS(p);
          if(!mapProgress[progress.topicId]){
            state.list.push(progress);
          } else {
            replaceItem(state.list, 'id', progress);
          }
          mapProgress[progress.topicId] = progress;
        });
      }
      return { ...state, loading: false, data: mapProgress, error: null };
    }
    case Types.GET_TOPICS_PROGRESS_BY_TOPIC_IDS_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    case Types.UPDATE_TOPICS_PROGRESS: {
      // console.log("UPDATE_TOPICS_PROGRESS action", action, 'state', state);
      return { ...state, data: mapProgress, error: null };
    }
    case Types.UPDATE_TOPICS_PROGRESS_SUCCESS: {
      // console.log("updating progress", Object.assign({}, mapProgress));
      if(action.data){
        action.data.forEach((p: TopicProgress) => {
          let progress: TopicProgress = TopicProgress.fromJS(p);
          if(!mapProgress[progress.topicId]){
            state.list.push(progress);
          } else {
            // console.log("GGGGGGGGG ITEM ", progress);
            replaceItem(state.list, 'id', progress);
            // state.list = state.list.filter((item) => item.id != progress.id);
            // state.list.push(progress);
          }
          mapProgress[progress.topicId] = progress;
          // console.log("updated progress", Object.assign({}, mapProgress), 111, progress.topicId, progress);
        });
      }
      return { ...state, data: mapProgress, error: null };
    }
    case Types.CALCULAR_TOPICS_PROGRESS: {
      let topic: Topic = action.topic;
      let progress: Progress = action.progress;
      if(topic && progress){
        let topicId: number = topic.id ?? -1;
        let topicProgress: TopicProgress | any = mapProgress[topicId];
        console.log("calc topic progress from game progress", topicProgress);
        if(topicProgress){
          topicProgress.notSeen = progress.getNotSeenNumber();
          topicProgress.familiar = progress.getFamiliarNumber();
          topicProgress.mastered = progress.getMasteredNumber();
          mapProgress[topicId] = topicProgress;
          topic.progress = topicProgress;
          replaceItem(state.list, 'id', topic.progress);
        }
        console.log("XXXXXXXX ", state);
      }
      return { ...state, loading: false, data: mapProgress, error: null };
    }
    case Types.CALCULAR_PARENT_TOPICS_PROGRESS: {
      // let childTopic: Topic = action.topic;
      // let parentTopic: Topic = action.parentTopic;
      //TODO:
      return state;
    }
    case Types.RESET_TOPIC_PROGRESS: {
      let topicProgress: TopicProgress = action.topicProgress;
      if(topicProgress){
        topicProgress = TopicProgress.fromJS(topicProgress);
        topicProgress.reset();
        mapProgress[topicProgress.topicId] = topicProgress;
        replaceItem(state.list, 'id', topicProgress);
      }
      return { ...state, data: mapProgress };
    }
    default:
      return state;
  }
};

export default topicProgressReducer;