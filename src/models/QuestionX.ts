import Config from "../config.js";
import { shuffle } from "../utils.js";
import Choice from "./Choice";
import QuestionProgress from "./QuestionProgress";
interface QuestionEntity {
    question: string,
    hint: string,
    image: string,
    sound: string,
    explanation: string,
    answers: Array<string>,
    choices: Array<string>,
    lastUpdate: number,
    userId: string,
    _id: number,
    rootTopicId: number,
    parentId: number,
    categoryId: number,
    questionStatus: number,
    id: number,
    progress: QuestionProgress,
    index: number,
    topicQuestion: any,
    paragraphId: number,
    paragraphContent: string;
    quiz: string;
}
class Question {
    public correctNums: number;
    public question: string;
    public hint: string;
    public image: string;
    public sound: string;
    public explanation: string;
    public choices: Array<Choice>;
    public lastUpdate: number;
    public userId: string;
    public rootTopicId: number;
    public parentId: number;
    public categoryId: number;
    public questionStatus: number;
    public id: number;
    public progress: QuestionProgress;
    public index: number;
    public topicQuestion: any;
    public paragraphId: number;
    public paragraphContent: string;
    public quiz: any;

    constructor(questionJS: any = {}) {
        // console.log("ggggggggg questionJS", questionJS)
        const { question, hint, image, sound, explanation, 
            answers, choices, lastUpdate, userId, _id, parentId, 
            categoryId, questionStatus, id, progress, index, 
            topicQuestion, listChoices, paragraphId, quiz } = questionJS;
        this.question = question ?? "";
        this.hint = hint ?? "";
        this.image = image ?? "";
        this.sound = sound ?? "";
        this.explanation = explanation ?? "";
        this.quiz = quiz;
        this.paragraphContent = quiz && quiz.description ? quiz.description : '';
        this.paragraphId = paragraphId ?? -1;
        // this.choices = choices ?? "";
        this.lastUpdate = lastUpdate ?? new Date().getTime();
        this.userId = userId ?? "";
        // this._id = _id ?? "";
        this.categoryId = categoryId ?? -1;
        this.questionStatus = questionStatus ?? Config.QUESTION_NOT_ANSWERED;
        this.id = id ?? (_id ?? -1);
        this.lastUpdate = new Date().getTime();
        this.choices = this.getListChoices(answers, choices, this.id);
        if(!(this.choices && this.choices.length > 0) && listChoices && listChoices.length > 0){
            this.choices = [];
            listChoices.forEach((choice: any) => {
                this.choices.push(Choice.fromJS({
                    content: choice.choice,
                    isCorrect: choice.isCorrect,
                    id: choice.id,
                    questionId: this.id,
                    selected: choice.selected
                }));
            });
        }
        this.correctNums = this.getCorrectNum();
        this.rootTopicId = parentId;
        this.parentId = -1;
        this.topicQuestion = topicQuestion;
        if(topicQuestion && topicQuestion.parentId){
            this.parentId = topicQuestion.parentId;
        }
        if(progress) {
            this.progress = QuestionProgress.fromJs(progress);
        } else {
            this.progress = QuestionProgress.init(this.parentId, id, Config.USER_ID);
        }
        this.index = index;
    }
    getListChoices(answers: Array<any>, choices: Array<any>, questionId: number): Array<Choice> {
        let listChoices: Array<Choice> = new Array<Choice>();
        if (answers && choices) {
            for (let i = 0; i < answers.length; i++) {
                let correctChoice = Choice.fromJS(Object.assign({}, {
                    content: answers[i],
                    isCorrect: true,
                    questionId: questionId,
                    id: listChoices.length,
                }))
                listChoices.push(correctChoice);
            }
            for (let i = 0; i < choices.length; i++) {
                let wrongChoice = Choice.fromJS(Object.assign({}, {
                    content: choices[i],
                    isCorrect: false,
                    questionId: questionId,
                    id: listChoices.length,
                }))
                listChoices.push(wrongChoice);
            }
        } else if(choices) {
            for (let i = 0; i < choices.length; i++) {
                let wrongChoice = Choice.fromJS(Object.assign({}, {
                    content: choices[i]['content'],
                    isCorrect: choices[i]['isCorrect'],
                    questionId: choices[i]['questionId'],
                    selected: !!choices[i]['selected'],
                    id: choices[i]['id'] ?? i
                }))
                listChoices.push(wrongChoice);
            }
        } else {
            console.error("answers && choices = null", answers, choices);
        }
        return shuffle(listChoices);
    }
    getCorrectNum(): number {
        this.correctNums = 0;
        for (let i = 0; i < this.choices.length; i++) {
            if (this.choices[i].isCorrect) this.correctNums++;
        }
        return this.correctNums;
    }
    static fromJs(questionJS: QuestionEntity | string): Question {
        if (typeof questionJS === 'string') {
            return new Question(JSON.parse(questionJS, Question.reviver));
        } else {
            let question = Object.create(Question.prototype);
            return new Question(Object.assign(question, questionJS));
        }

    }

    getNumberChoiceSelected() {
        let num = 0;
        for (let i = 0; i < this.choices.length; i++) {
            if (this.choices[i].selected) num++;
        }
        return num;
    }

    updateQuestionProgress(listChoiceSelected: Array<Choice>) {
        this.lastUpdate = new Date().getTime();
        let correctNum = 0;
        for (let i = 0; i < listChoiceSelected.length; i++) {
            let choiceUpdate = listChoiceSelected[i];
            if (choiceUpdate.isCorrect) correctNum++;
        }
        this.questionStatus = (correctNum === this.correctNums) ? Config.QUESTION_ANSWERED_CORRECT : Config.QUESTION_ANSWERED_INCORRECT;
        this.progress.updateProgress(correctNum === this.correctNums);
        this.progress.status = this.questionStatus;
    }
    reset() {
        this.questionStatus = Config.QUESTION_NOT_ANSWERED;
        this.progress.status = Config.QUESTION_NOT_ANSWERED;
        for (let index = 0; index < this.choices.length; index++) {
            this.choices[index].selected = false;
        }
    }
    static reviver(key: string, value: any): any {
        return key === "" ? Choice.fromJS(value) : value;
    }

    updateTestProgress(listChoiceSelected: Array<Choice>) {
        let correctNum = 0;
        for (let i = 0; i < listChoiceSelected.length; i++) {
            let choiceUpdate = listChoiceSelected[i];
            if (choiceUpdate.isCorrect) correctNum++;
        }
        this.questionStatus = (correctNum === this.correctNums) ? Config.QUESTION_ANSWERED_CORRECT : Config.QUESTION_ANSWERED_INCORRECT;
        this.progress.updateTestProgress(correctNum === this.correctNums);
        this.progress.status = this.questionStatus;
    }
}
export default Question;