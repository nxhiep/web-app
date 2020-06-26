import Config from "../config";
import QuestionProgress from "./QuestionProgress";

interface ReviewProgressEntity {
    total: number;
    boxMap: Map<number, Array<number>>;
    mapQuestionProgress: Map<number, QuestionProgress>;
    allQuestionIds: Array<number>;
    weakQuestionIds: Array<number>;
    mediumQuestionIds: Array<number>;
    strongQuestionIds: Array<number>;
    yourFavoriteQuestionIds: Array<number>;
}

export default class ReviewProgress {
    total: number;
    boxMap: Map<number, Array<number>>;
    mapQuestionProgress: Map<number, QuestionProgress>;
    allQuestionIds: Array<number>;
    weakQuestionIds: Array<number>;
    mediumQuestionIds: Array<number>;
    strongQuestionIds: Array<number>;
    yourFavoriteQuestionIds: Array<number>;

    constructor(questionsProgress: Array<QuestionProgress>) {
        this.total = 0;
        this.boxMap = new Map<number, Array<number>>();
        this.mapQuestionProgress = new Map<number, QuestionProgress>();

        //TODO: test
        this.allQuestionIds = new Array<number>();
        this.weakQuestionIds = new Array<number>();
        this.mediumQuestionIds = new Array<number>();
        this.strongQuestionIds = new Array<number>();
        this.yourFavoriteQuestionIds = new Array<number>();
        
        if(questionsProgress){
            this.total = questionsProgress.length;
            questionsProgress.forEach((progress: QuestionProgress) => {
                progress = QuestionProgress.fromJs(progress);
                let questionId: number = progress.questionId;
                this.mapQuestionProgress.set(questionId, progress);
                if(questionId){
                    let boxNum = progress.boxNum;
                    if (boxNum > 2) {
                        boxNum = 2;
                    }
                    if(!this.boxMap.has(boxNum)){
                        this.boxMap.set(boxNum, new Array<number>());
                    }
                    this.boxMap.get(boxNum)?.push(questionId);
                    this.allQuestionIds.push(questionId);
                    if(progress.getPercentCorrect() < 0.5) {
                        this.weakQuestionIds.push(questionId);
                    }
                    if(progress.getPercentCorrect() >= 0.5 && progress.getPercentCorrect() < 0.8) {
                        this.mediumQuestionIds.push(questionId);
                    }
                    if(progress.getPercentCorrect() > 0.8) {
                        this.strongQuestionIds.push(questionId);
                    }
                    if(progress.bookmark === true) {
                        this.yourFavoriteQuestionIds.push(questionId);
                    }
                }
            });
        } else {
            console.log('questions empty!')
        }
    }

    notSeenNumber() {
        let list: Array<number> = this.boxMap.get(0) ?? new Array<number>();
        return list.length;
    }

    familiarNumber() {
        let list: Array<number> = this.boxMap.get(1) ?? new Array<number>();
        return list.length;
    }

    masteredNumber() {
        let list: Array<number> = this.boxMap.get(2) ?? new Array<number>();
        return list.length;
    }

    getPercentComplete() {
        return (this.familiarNumber() * 0.5 + this.masteredNumber() * 1) / this.total;
    }

    getTotalQuestionByLevelId(id: number) : number {
        return this.getQuestionsIdsByLevelId(id).length;
    }

    getQuestionsIdsByLevelId(id: number): Array<number> {
        switch(id) {
            case Config.WEAK_QUESTION.id: return this.weakQuestionIds;
            case Config.MEDIUM_QUESTION.id: return this.mediumQuestionIds;
            case Config.STRONG_QUESTION.id: return this.strongQuestionIds;
            case Config.ALL_FAMILIAR_QUESTION.id: return this.allQuestionIds;
            case Config.YOUR_FAVORITE_QUESTION.id: return this.yourFavoriteQuestionIds;
            default: return [];
        }
    }

    getCurrentSelectedId() {
        if(this.weakQuestionIds.length > 0){
            return Config.WEAK_QUESTION.id;
        } else if(this.mediumQuestionIds.length > 0){
            return Config.MEDIUM_QUESTION.id;
        } else if(this.strongQuestionIds.length > 0){
            return Config.STRONG_QUESTION.id;
        } else if(this.allQuestionIds.length > 0) {
            return Config.ALL_FAMILIAR_QUESTION.id;
        } else if(this.yourFavoriteQuestionIds.length > 0){
            return Config.YOUR_FAVORITE_QUESTION.id;
        }
        return Config.WEAK_QUESTION.id;
    }
}