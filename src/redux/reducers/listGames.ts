import { Reducer } from "redux";
import { REHYDRATE } from 'redux-persist';
import Config from '../../config.js';
import { GameActions } from "../actions/game";
import * as Types from '../actions/types.js';
import { QuestionProgressState } from "./cardProgress";
import { GameEntity, GameState } from "./game";

export interface ListGameEntitty {
    listGames: Map<number, Array<GameEntity>>, // topicId - list game
    games: Array<GameState>
}
export class ListGamesState implements ListGameEntitty{
    listGames: Map<number, Array<GameEntity>>;
    games: Array<GameState>;
    constructor(props?: ListGameEntitty) {
        this.listGames = new Map<number, Array<GameEntity>>();
        this.games = new Array<GameEntity>();
        if(props) {
            for (let i = 0; i < props.games.length; i++) {
                const element: GameEntity = props.games[i];
                let xxx: GameState = GameState.cloneGameState(element);
                this.games.push(xxx);
            }
            
        }
    }
    static init() {
        return new ListGamesState();
    }
    static updateListGame(beforeState: ListGamesState, topicId: number, gameState: GameState): ListGamesState {
        let currentListGame: Array<GameEntity> = beforeState.listGames.get(topicId) ?? new Array<GameEntity>();
        currentListGame = currentListGame.filter((item: GameEntity) => item.id !== gameState.id) ?? [];
        currentListGame.push(gameState);
        beforeState.listGames.set(topicId, currentListGame);
        return beforeState;
    }
    static removeGame(beforeState: ListGamesState, topicId: number): ListGamesState {
        // let currentListGame: Array<GameState> = this.listGames.get(examId) ?? new Array<GameState>();
        // currentListGame = currentListGame.filter((item: GameState) => item.topicId !== gameState.topicId) ?? [];
        // this.listGames.set(examId, currentListGame);
        // remove for test
        beforeState.listGames.delete(topicId);
        return beforeState;
    }
}
const listGamesReducer: Reducer<ListGameEntitty> = (state: ListGameEntitty = ListGamesState.init(), action: GameActions ): ListGameEntitty => {
    switch (action.type) {
        case REHYDRATE: 
           if(action.payload) {
            let localList: ListGameEntitty = action.payload['listGameState'];
            return new ListGamesState(localList);
           } else return state;
        case Types.GAME_UPDATE_LIST_GAME:
            let gameReducer: GameEntity = action.payload;
            let temp = new ListGamesState(state);
            if(gameReducer.gameType !== Config.REVIEW_GAME){
                let topicIdx: number = action.topicId;
                temp = ListGamesState.updateListGame(temp, topicIdx, gameReducer);
                temp.games = temp.games.filter((item: GameEntity) => (item.id != gameReducer.id));
                temp.games.push(gameReducer);
                if(gameReducer.gameType === Config.STUDY_GAME){
                    if (action.questionProgressState) {
                        let questionProgressState: QuestionProgressState = action.questionProgressState;
                        if(!questionProgressState.data){
                            questionProgressState.data = {};
                        }
                        // console.log("3434343434343434343434343433433434343", gameReducer.currentQuestion, 'questionProgressState', questionProgressState)
                        if(gameReducer.currentQuestion){
                            questionProgressState.data[gameReducer.currentQuestion.id] = gameReducer.currentQuestion?.progress;
                        }
                    }
                }
            }
            // state.listGames.set(examIdx,[gameReducer]);
            return temp;
        case Types.REMOVE_GAME:
            let topicId = action.topicId;
            let gameType = action.gameType;
            state.games = state.games.filter((item: GameEntity) => (item.id != topicId && item.gameType != gameType));
            return state ;
        default: return state;
    }
}
export default listGamesReducer;