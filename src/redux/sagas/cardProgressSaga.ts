import { delay, put, select, take } from 'redux-saga/effects';
import QuestionProgress from '../../models/QuestionProgress';
import Question from '../../models/QuestionX';
import * as Actions from '../actions/cardProgress';
import * as Types from '../actions/types';
import { updateListGame } from './../actions/game';
import { AppState } from './../appstate';
import { QuestionProgressState } from './../reducers/cardProgress';

function getAllCardsProgressApi() {
    return new Promise(async (resolve, reject) => {
        try {
            // const result = await GET({ url: '/get-topics-by-parent-id?parentId=' + parentId });
            // const result = await POST({ url: '/get-all-card-progress' });
            // resolve(result.data);
            let fakeData: Array<QuestionProgress> = Array<QuestionProgress>();
            let cardIds = [4503750085443584, 4503905778008064, 4504236507267072, 
                4504333899005952, 4504596462436352, 4504653135872000, 4504926252171264, 
                4505245237379072, 4505988736483328, 4506380014714880, 4506415079096320];
            for(let i = 0; i < cardIds.length; i++){
                let num = Math.floor(Math.random() * 4);
                let progress: Array<number> = Array<number>();
                let boxNum = 0;
                let bookmark = false;
                if(num === 0){
                    progress = Array<number>(0);
                    boxNum = 0;
                }
                if(num === 1){
                    progress = Array<number>(0, 1, 1);
                    boxNum = 1;
                    bookmark = true;
                }
                if(num === 2){
                    progress = Array<number>(1, 1, 1);
                    boxNum = 2;
                    bookmark = true;
                }
                if(num === 3){
                    progress = Array<number>(0, 0, 0, 1);
                    boxNum = 0;
                }
                fakeData.push(new QuestionProgress({
                    id: cardIds[i] + '-userId',
                    progress: progress,
                    boxNum: boxNum,
                    index: i,
                    bookmark: bookmark,
                    questionId: cardIds[i]
                }));
            }
            resolve(fakeData);
        } catch (error) {
            reject(error);
        }
    });
}

function* getAllCardsProgressSaga() {
    while(true) {
        try {
            yield take(Types.GET_CARDS_PROGRESS);
            // let data = yield call(getAllCardsProgressApi);
            let list: Array<QuestionProgress> = new Array<QuestionProgress>();
            // if(data){
            //     data.map((item: any) => list.push(new QuestionProgress(item)));
            // }
            yield delay(0);
            yield put(Actions.getAllCardProgressSuccess(list));
        } catch(e){
            yield put(Actions.getAllCardProgressFailure(e));
        }
    }
}
export function *getQuestionsProgress(cards: Array<Question>) {
    let questionProgressState: QuestionProgressState = yield select((state: AppState) => state.cardProgressReducer);
    let mapQuestionProgress = questionProgressState.data ?? null;
    if(mapQuestionProgress){
        cards.forEach((c) => {
            if(mapQuestionProgress[c.id]){
                let p = QuestionProgress.fromJs(mapQuestionProgress[c.id]);
                c.progress = p;
            }
        });
        console.log("UPDATED OK OK OK")
    } else {
        //TODO: get from server
    }
}

function *updateCardProgress() {
    while(true) {
        try {
            let action:Actions.QuestionProgressAction = yield take(Types.UPDATE_QUESTION_PROGRESS);
            // console.log("update bookmark ", action, action.data);
            let questionsProgress = action.data;
            if(questionsProgress){
                // TODO: update question progress to cloud
                // yield put(Actions.updateCardProgressSuccess(questionsProgress));
                let gameReducer = yield select((state: AppState) => state.gameState);
                let cardProgressReducer: QuestionProgressState = yield select((state: AppState) => state.cardProgressReducer);
                if(gameReducer && cardProgressReducer && gameReducer.id, gameReducer.topicId){
                    yield put(updateListGame(gameReducer.id, gameReducer.topicId, gameReducer, cardProgressReducer));
                } else {
                    console.log("&&&&&&&& cannot update list game")
                }
            }
        } catch(e) {
            // yield put(Actions.updateCardProgressFailure(e));
        }
    }
}

function *getQuestionProgressByIds() {
    while(true) {
        try {
            let action:Actions.QuestionProgressAction = yield take(Types.GET_QUESTION_PROGRESS_BY_IDS);
            let ids: Array<number> = action.ids ?? [];
            if(ids){
                //TODO: 
                yield put(Actions.getQuestionProgressByIdsSuccess(ids, []));
            }
        } catch(e) {
            yield put(Actions.getQuestionProgressByIdsFailure(e));
        }
    }
}

export const cardsProgressSaga = [
    getAllCardsProgressSaga(),
    updateCardProgress(),
    getQuestionProgressByIds(),
];