import Config from "../config.js";
interface QuestionProgressEntity {
    id: string,
    progress: Array<number>,
    testProgress: Array<number>,
    testId: number,
    boxNum: number,
    index: number,
    bookmark: boolean,
    status: number,
    userId: string,
    questionId: number,
    parentId: number,
}
export default class QuestionProgress {
    id: string;
    progress: Array<number>;
    testProgress: Array<number>;
    testId: number;
    boxNum: number;
    index: number;
    bookmark: boolean;
    status: number;
    userId: string;
    questionId: number;
    parentId: number;

    constructor(props: QuestionProgressEntity | any = {}) {
        const { id, progress, testProgress, testId, boxNum, index, bookmark, status, userId, questionId, parentId } = props;
        this.id = id ?? questionId + '-' + userId;
        this.progress = progress ?? new Array<number>();
        this.testProgress = testProgress ?? new Array<number>();
        this.testId = testId ?? -1;
        this.boxNum = boxNum ?? 0;
        this.index = index ?? -1;
        this.bookmark = bookmark ?? false;
        this.status = status ?? Config.QUESTION_NOT_ANSWERED;
        this.userId = userId ?? "";
        this.questionId = questionId ?? -1;
        this.parentId = parentId ?? -1;
    }

    static fromJs(questionProgressJS: QuestionProgressEntity | string): QuestionProgress {
        if (typeof questionProgressJS === 'string') {
            return new QuestionProgress(JSON.parse(questionProgressJS));
        } else {
            let question = Object.create(QuestionProgress.prototype);
            return new QuestionProgress(Object.assign(question, questionProgressJS));
        }
    }

    static init(parentId: number, questionId: number, userId: string): QuestionProgress {
        return this.fromJs(JSON.stringify({ id: questionId + '-' + userId, questionId: questionId, parentId: parentId, userId: userId }));
    }

    updateProgress(isCorrect: boolean) {
        this.progress.push(isCorrect === true ? 1 : 0);
        if (isCorrect === true) {
            this.boxNum += 1;
        }
    }

    updateTestProgress(isCorrect: boolean) {
        this.testProgress.push(isCorrect ? 1 : 0);
    }

    updateBookMark() {
        this.bookmark = !this.bookmark;
    }

    getPercentCorrect(): number {
        let total = this.progress.length;
        let numberOfCorrect = 0;
        for (let i = 0; i < total; i++) {
            if (this.progress[i] === 1) {
                numberOfCorrect++;
            }
        }
        return numberOfCorrect / total;
    }

    reset() {
        this.progress = new Array<number>();
        this.boxNum = 0;
        this.status = Config.QUESTION_NOT_ANSWERED;
    }
}