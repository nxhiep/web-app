import Question from "../../models/QuestionX";
import * as Types from "./types";

export interface QuestionAction {
    type: string,
    data?: Array<Question>,
    cardIds?: Array<number>,
    error?: any,
    parentId?: number,
}

export function getCardsByParentId(parentId: number): QuestionAction {
    return { 
        type: Types.GET_CARDS_BY_PARENT_ID, 
        parentId: parentId,
    };
}
export function getCardsByParentIdSuccess(cards: Array<Question>): QuestionAction {
    return { 
        type: Types.GET_CARDS_BY_PARENT_ID_SUCCESS, 
        data: cards,
    };
}
export function getCardsByParentIdFailure(error: any) {
    return { 
        type: Types.GET_CARDS_BY_PARENT_ID_FAILURE, 
        error: error,
    };
}

export function getCardsByIds(ids: Array<number>) {
    return { 
        type: Types.GET_CARDS_BY_IDS, 
        cardIds: ids,
    };
}
export function getCardsByIdsSuccess(cards: Array<Question>) {
    return { 
        type: Types.GET_CARDS_BY_IDS_SUCCESS, 
        data: cards,
    };
}
export function getCardsByIdsFailure(error: any) {
    return { 
        type: Types.GET_CARDS_BY_IDS_FAILURE, 
        error: error,
    };
}