import { REHYDRATE } from 'redux-persist';
import { Reducer } from 'redux';
import * as Types from "../actions/types";
import QuestionProgress from "../../models/QuestionProgress";
import { QuestionProgressAction } from '../actions';
import { replaceItem } from '../../utils';

export type QuestionProgressState = {
  loading: boolean;
  data: any; // { questionId : QuestionProgress } // Map<number, QuestionProgress>
  error: any;
  list: Array<QuestionProgress> | any;
}

const InitialQuestionProgressState = {
  loading: false,
  data: {},
  error: null,
  list: [],
};

const cardProgressReducer: Reducer<QuestionProgressState> = 
(state: QuestionProgressState = InitialQuestionProgressState, action: QuestionProgressAction | any): QuestionProgressState => {
  // console.log("cardProgressReducer state", state, " ----- action", action);
  // let mapProgress: Map<number, QuestionProgress> = state.data ?? new Map<number, QuestionProgress>();
  let mapProgress = state.data ?? {};
  switch (action.type) {
    case REHYDRATE: {
      if(action.payload){
        let list = action.payload.cardProgressReducer?.list;
        if(list){
          list.forEach((value: any) => {
            let qp: QuestionProgress = QuestionProgress.fromJs(value);
            mapProgress[qp.questionId] = qp;
          });
          state.list = list;
          state.data = mapProgress;
        }
      }
      // console.log("REHYDRATE cardProgressReducer action", action, state);
      return { ...state };
    }
    case Types.GET_CARDS_PROGRESS: {
      // console.log("1111111 loading")
      return { ...state, loading: true };
    }
    case Types.GET_CARDS_PROGRESS_SUCCESS: {
      let questionProgress: Array<QuestionProgress> = action.data ?? new Array<QuestionProgress>();
      // console.log("GET_CARDS_PROGRESS_SUCCESS ", questionProgress, mapProgress);
      if (questionProgress) {
        questionProgress.forEach((p: QuestionProgress) => {
          let progress: QuestionProgress = QuestionProgress.fromJs(p);
          if(!mapProgress[p.questionId]){
            state.list.push(progress);
          } else {
            replaceItem(state.list, 'id', progress);
            // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
            // state.list.push(progress);
          }
          mapProgress[p.questionId] = progress
        });
      }
      return { ...state, loading: false, data: mapProgress, error: null };
    }
    case Types.GET_CARDS_PROGRESS_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    case Types.UPDATE_QUESTION_PROGRESS: {
      let questionProgress: Array<QuestionProgress> = action.data ?? new Array<QuestionProgress>();
      // console.log("UPDATE_QUESTION_PROGRESS cardProgressReducer action", questionProgress);
      if (mapProgress && questionProgress) {
        questionProgress.forEach((p: QuestionProgress) => {
          let progress: QuestionProgress = QuestionProgress.fromJs(p);
          if(!mapProgress[p.questionId]){
            state.list.push(progress);
          } else {
            replaceItem(state.list, 'id', progress);
            // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
            // state.list.push(progress);
          }
          mapProgress[p.questionId] = progress
        });
      }
      return { ...state, data: mapProgress };
    }
    case Types.GET_QUESTION_PROGRESS_BY_IDS: {
      return { ...state, loading: true };
    }
    case Types.GET_QUESTION_PROGRESS_BY_IDS_SUCCESS: {
      let questionProgress: Array<QuestionProgress> = action.data;
      // console.log("TTTTTTTTT ", questionProgress, mapProgress);
      if(questionProgress){
        questionProgress.forEach((p: QuestionProgress) => {
          let progress: QuestionProgress = QuestionProgress.fromJs(p);
          if(!mapProgress[progress.questionId]){
            state.list.push(progress);
          } else {
            replaceItem(state.list, 'id', progress);
            // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
            // state.list.push(progress);
          }
          mapProgress[progress.questionId] = progress;
        });
      }
      return { ...state, loading: false, data: mapProgress, error: null };
    }
    case Types.GET_QUESTION_PROGRESS_BY_IDS_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    case Types.RESET_CARD_IN_TOPIC: {
      let topicId = action.topicId;
      if(topicId){
        state.list.forEach((q: any) => {
          let questionProgress: QuestionProgress = QuestionProgress.fromJs(q);
          if(questionProgress.parentId == topicId){
            questionProgress.reset();
            mapProgress[questionProgress.questionId] = questionProgress;
          }
        });
      }
      return { ...state, data: mapProgress }
    }
    default:
      return state;
  }
};

export default cardProgressReducer;