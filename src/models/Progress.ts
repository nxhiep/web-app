import Config from '../config.js';
import Question from './QuestionX';
interface ProgressEntity {
    done: number;
    notDone: number;
    correct: number;
    mistake: number;
    skipped: number;
    mapBoxNum: Map<number, Array<Question>>;
    total: number;
}
class Progress {
    done: number;
    notDone: number;
    correct: number;
    mistake: number;
    skipped: number;
    mapBoxNum: Map<number, Array<Question>>;
    total: number;
    constructor(props: ProgressEntity) {
        this.done = props.done ?? 0;
        this.notDone = props.notDone ?? 0;
        this.mistake = props.mistake ?? 0;
        this.skipped = props.skipped ?? 0;
        this.correct = props.correct ?? 0 ;
        this.mapBoxNum = props.mapBoxNum ?? new Map<number, any>();
        this.total = props.total ?? 0;
    }
    static init() {
        return new Progress({
            done: 0,
            notDone: 0,
            correct: 0,
            mistake: 0,
            skipped: 0,
            mapBoxNum: new Map<number, Array<Question>>(),
            total: 0,
        })
    }
    static calcProgress(questions: Array<Question>): Progress {
        let mapBoxNum = new Map<number, any>();
        let total = questions.length;
        let done = 0, notDone = 0, mistake = 0, skipped = 0, correct = 0;
        for (let i = 0; i < total; i++) {
            const question = questions[i];
            const progress = question.progress;
            let boxNum = progress.boxNum;
            if(boxNum > 2){
                boxNum = 2;
            }
            if (!mapBoxNum.has(boxNum)) {
                mapBoxNum.set(boxNum,new Array<Question>());
            }
            // let array: Array<Question> = mapBoxNum.get(boxNum);
            // console.log("arrayz", array);
            // array.push(question);
            mapBoxNum.get(boxNum).push(question);
            if (question.questionStatus === Config.QUESTION_NOT_ANSWERED) {
                notDone++;
            } else {
                if (question.questionStatus === Config.QUESTION_ANSWERED_SKIP) skipped++;
                done++;
                if (question.questionStatus === Config.QUESTION_ANSWERED_CORRECT) {
                    correct++;
                } else {
                    mistake++;
                }
            }
        }
        return new Progress({ done, notDone, correct, mistake, skipped, mapBoxNum, total });
    }

    getNotSeenNumber(): number {
        return   this.mapBoxNum.get(0)?.length ?? 0;
    }

    getFamiliarNumber(): number {
        return this.mapBoxNum.get(1)?.length ?? 0;
    }

    getMasteredNumber(): number {
        return this.mapBoxNum.get(2)?.length ?? 0;
    }

    getPercentComplete(): number {
        if (!this.total) {
            alert('getPercentComplete in game.js: this.total == 0');
        }
        return (this.getFamiliarNumber() * 0.5 + this.getMasteredNumber() * 1) / this.total;
    }
}

export default Progress;