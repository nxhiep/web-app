import { Reducer } from 'redux';
import { REHYDRATE } from 'redux-persist';
import Question from "../../models/QuestionX";
import * as Types from "../actions/types";
import { replaceItem } from '../../utils';

export interface QuestionState {
  loading: boolean,
  data: {}, // Map<number, Question>
  list: Array<Question>,
  error: any,
}

const initialState = {
  loading: false,
  data: {},
  list: new Array<Question>(),
  error: null,
}

const cardReducer: Reducer<QuestionState> = (state: QuestionState = initialState, action): QuestionState => {
  // console.log("cardReducer action ", action, '\nstate', state);
  // let mapCards = state.data ?? new Map<number, Map<number, Question>>();
  let mapQuestion: any = state.data ?? {};
  switch (action.type) {
    case REHYDRATE: {
      if(action.payload){
        let list = action.payload.cardReducer?.list;
        if(list){
          list.forEach((value: any) => {
            let qs: Question = Question.fromJs(value);
            mapQuestion[qs.id] = qs;
          });
          state.list = list;
          state.data = mapQuestion;
        }
      }
      return { ...state };
    }
    case Types.GET_CARDS_BY_PARENT_ID: {
      return { ...state, loading: true };
    }
    case Types.GET_CARDS_BY_PARENT_ID_SUCCESS: {
      let cards: Array<Question> = action.data;
      cards.forEach((card: Question) => {
        if(!mapQuestion[card.id]){
          state.list.push(card);
        } else {
          replaceItem(state.list, 'id', card);
          // state.list = state.list.filter((item: Question) => item.id != card.id);
          // state.list.push(card);
        }
        mapQuestion[card.id] = card
      });
      return { ...state, loading: false, data: mapQuestion, error: null };
    }
    case Types.GET_CARDS_BY_PARENT_ID_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    case Types.GET_CARDS_BY_IDS: {
      return { ...state, loading: true };
    }
    case Types.GET_CARDS_BY_IDS_SUCCESS: {
      // let cards: Array<Question> = action.data;
      // let mapCard: Map<number, Question> = new Map<number, Question>();
      // cards.forEach((card: Question) => mapCard.set(card.id, card));
      // mapCards.set(action.parentId, mapCard);
      let cards: Array<Question> = action.data;
      cards.forEach((card: Question) => {
        if(!mapQuestion[card.id]){
          state.list.push(card);
        } else {
          replaceItem(state.list, 'id', card);
          // state.list = state.list.filter((item: Question) => item.id != card.id);
          // state.list.push(card);
        }
        mapQuestion[card.id] = card
      });
      return { ...state, loading: false, data: mapQuestion, error: null };
    }
    case Types.GET_CARDS_BY_IDS_FAILURE: {
      return { ...state, loading: false, error: action.error };
    }
    default:
      return state;
  }
};

export default cardReducer;