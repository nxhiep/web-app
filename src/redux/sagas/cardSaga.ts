import { call, put, select, take } from 'redux-saga/effects';
import Config from '../../config';
import Question from '../../models/QuestionX';
import { callApi } from '../../services';
import * as Actions from '../actions/card';
import { GET_CARDS_BY_IDS, GET_CARDS_BY_PARENT_ID } from '../actions/types';
import { AppState } from './../appstate';
import { QuestionState } from './../reducers/card';
import TestSetting from '../../models/TestSetting';

function getCardsByIdsSagaApi(ids: Array<number>) {
    return callApi({ url: '/data?type=get_cards_by_ids&ids=' + ids.toString(), params: null, method: 'post' });
}

export function getCardByParentIdForStudy(topicId: number) {
    return callApi({ method: 'post', url: '/data?type=get_cards_by_parent_id&parentId=' + topicId, params: {} });
}

export function getCardForTest(testsetting: TestSetting) {
    // 6225635760406528
    console.log("getCardForTest ", testsetting);
    return callApi({ url: Config.API_GET_CARDS_FOR_TEST_SETTING, params: { ...testsetting.toJS() }, method: "POST" });
}

function getCardsByParentIdSagaApi(parentId: number) {
    return callApi({ url: '/data?type=get_cards&id=' + parentId, params: null, method: 'post' });
}

function* getCardsByParentIdSaga() {
    try {
        let action = yield take(GET_CARDS_BY_PARENT_ID);
        let data = yield call(getCardsByParentIdSagaApi, action.params);
        let cards: Array<Question> = new Array<Question>();
        if(data){
            data.forEach((card: any) => cards.push(new Question(card)));
        }
        yield put(Actions.getCardsByParentIdSuccess(cards));
    } catch(e){
        yield put(Actions.getCardsByParentIdFailure(e));
    }
}

export function *getCardsByIdsAPI(cardIds: Array<number>) {
    let questionState: QuestionState = yield select((state: AppState) => state.cardReducer);
    let cards: Array<Question> = new Array<Question>();
    let cardMissIds: Array<number> = [];
    console.log("questionState ", questionState)
    if(questionState){
        let mapCard: any = questionState.data ?? {};
        cardIds.forEach((cardId: number) => {
            if(mapCard[cardId]){
                let card: Question = Question.fromJs(mapCard[cardId]);
                cards.push(card);
            } else {
                cardMissIds.push(cardId);
            }
        });
    }
    console.log("cardMissIds ", cardMissIds)
    if(cardMissIds.length > 0){
        let data = yield call(getCardsByIdsSagaApi, cardMissIds);
        if(data){
            data.forEach((card: any) => cards.push(Question.fromJs(card)));
        }
    }
    return cards;
}

function* getCardsByIdsSaga() {
    while(true) {
        try {
            let action = yield take(GET_CARDS_BY_IDS);
            let cards: Array<Question> = yield call(getCardsByIdsAPI, action.params);
            yield put(Actions.getCardsByIdsSuccess(cards));
        } catch(e){
            yield put(Actions.getCardsByIdsFailure(e));
        }
    }
}

export const cardsSaga = [
    getCardsByIdsSaga(),
    getCardsByParentIdSaga()
];