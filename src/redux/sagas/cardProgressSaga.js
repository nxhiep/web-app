var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { delay, put, select, take } from 'redux-saga/effects';
import QuestionProgress from '../../models/QuestionProgress';
import * as Actions from '../actions/cardProgress';
import * as Types from '../actions/types';
import { updateListGame } from './../actions/game';
function getAllCardsProgressApi() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            // const result = await GET({ url: '/get-topics-by-parent-id?parentId=' + parentId });
            // const result = await POST({ url: '/get-all-card-progress' });
            // resolve(result.data);
            let fakeData = Array();
            let cardIds = [4503750085443584, 4503905778008064, 4504236507267072,
                4504333899005952, 4504596462436352, 4504653135872000, 4504926252171264,
                4505245237379072, 4505988736483328, 4506380014714880, 4506415079096320];
            for (let i = 0; i < cardIds.length; i++) {
                let num = Math.floor(Math.random() * 4);
                let progress = Array();
                let boxNum = 0;
                let bookmark = false;
                if (num === 0) {
                    progress = Array(0);
                    boxNum = 0;
                }
                if (num === 1) {
                    progress = Array(0, 1, 1);
                    boxNum = 1;
                    bookmark = true;
                }
                if (num === 2) {
                    progress = Array(1, 1, 1);
                    boxNum = 2;
                    bookmark = true;
                }
                if (num === 3) {
                    progress = Array(0, 0, 0, 1);
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
        }
        catch (error) {
            reject(error);
        }
    }));
}
function* getAllCardsProgressSaga() {
    while (true) {
        try {
            yield take(Types.GET_CARDS_PROGRESS);
            // let data = yield call(getAllCardsProgressApi);
            let list = new Array();
            // if(data){
            //     data.map((item: any) => list.push(new QuestionProgress(item)));
            // }
            yield delay(0);
            yield put(Actions.getAllCardProgressSuccess(list));
        }
        catch (e) {
            yield put(Actions.getAllCardProgressFailure(e));
        }
    }
}
export function* getQuestionsProgress(cards) {
    var _a;
    let questionProgressState = yield select((state) => state.cardProgressReducer);
    let mapQuestionProgress = (_a = questionProgressState.data) !== null && _a !== void 0 ? _a : null;
    if (mapQuestionProgress) {
        cards.forEach((c) => {
            if (mapQuestionProgress[c.id]) {
                let p = QuestionProgress.fromJs(mapQuestionProgress[c.id]);
                c.progress = p;
            }
        });
        console.log("UPDATED OK OK OK");
    }
    else {
        //TODO: get from server
    }
}
function* updateCardProgress() {
    while (true) {
        try {
            let action = yield take(Types.UPDATE_QUESTION_PROGRESS);
            // console.log("update bookmark ", action, action.data);
            let questionsProgress = action.data;
            if (questionsProgress) {
                // TODO: update question progress to cloud
                // yield put(Actions.updateCardProgressSuccess(questionsProgress));
                let gameReducer = yield select((state) => state.gameState);
                let cardProgressReducer = yield select((state) => state.cardProgressReducer);
                if (gameReducer && cardProgressReducer && gameReducer.id, gameReducer.topicId) {
                    yield put(updateListGame(gameReducer.id, gameReducer.topicId, gameReducer, cardProgressReducer));
                }
                else {
                    console.log("&&&&&&&& cannot update list game");
                }
            }
        }
        catch (e) {
            // yield put(Actions.updateCardProgressFailure(e));
        }
    }
}
function* getQuestionProgressByIds() {
    var _a;
    while (true) {
        try {
            let action = yield take(Types.GET_QUESTION_PROGRESS_BY_IDS);
            let ids = (_a = action.ids) !== null && _a !== void 0 ? _a : [];
            if (ids) {
                //TODO: 
                yield put(Actions.getQuestionProgressByIdsSuccess(ids, []));
            }
        }
        catch (e) {
            yield put(Actions.getQuestionProgressByIdsFailure(e));
        }
    }
}
export const cardsProgressSaga = [
    getAllCardsProgressSaga(),
    updateCardProgress(),
    getQuestionProgressByIds(),
];
