import QuestionProgress from "../../models/QuestionProgress";
import Question from "../../models/QuestionX";
import * as Types from "./types";

export interface QuestionProgressAction {
    type: string,
    data?: Array<QuestionProgress>,
    error?: any,
    ids?: Array<number>,
    topicId?: number,
}

export const resetCardInTopic = (topicId: number) : QuestionProgressAction => {
    return { 
        type: Types.RESET_CARD_IN_TOPIC, 
        topicId: topicId,
    };
}

export function updateCardProgress(questionsProgress: Array<QuestionProgress>): QuestionProgressAction {
    return { 
        type: Types.UPDATE_QUESTION_PROGRESS, 
        data: questionsProgress, 
    };
}

export function onBookmark(question: Question): QuestionProgressAction {
    let listProgress: Array<QuestionProgress> = new Array<QuestionProgress>();
    let questionProgress: QuestionProgress = question.progress;
    if(questionProgress){
        questionProgress.bookmark = !questionProgress.bookmark;
        listProgress.push(questionProgress);
        question.progress = questionProgress;
    }
    return updateCardProgress(listProgress);
}

export function getAllCardProgress(): QuestionProgressAction {
    return { 
        type: Types.GET_CARDS_PROGRESS, 
    };
}
export function getAllCardProgressSuccess(questionsProgress: Array<QuestionProgress>): QuestionProgressAction {
    return { 
        type: Types.GET_CARDS_PROGRESS_SUCCESS, 
        data: questionsProgress
    };
}
export function getAllCardProgressFailure(error: any): QuestionProgressAction {
    return { 
        type: Types.GET_CARDS_PROGRESS_FAILURE, 
        error: error,
    };
}

export function getQuestionProgressByIds(ids: Array<number>): QuestionProgressAction {
    return { 
        type: Types.GET_QUESTION_PROGRESS_BY_IDS,
        ids: ids
    };
}
export function getQuestionProgressByIdsSuccess(ids: Array<number>, questionsProgress: Array<QuestionProgress>): QuestionProgressAction {
    return { 
        type: Types.GET_QUESTION_PROGRESS_BY_IDS_SUCCESS, 
        data: questionsProgress,
        ids: ids,
    };
}
export function getQuestionProgressByIdsFailure(error: any): QuestionProgressAction {
    return { 
        type: Types.GET_QUESTION_PROGRESS_BY_IDS_FAILURE, 
        error: error,
    };
}