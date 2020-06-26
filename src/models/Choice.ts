import Config from "../config.js";


interface ChoiceJS {
    id: string;
    content: string;
    questionId: number;
    isCorrect: boolean;
    selected: boolean;
}
class Choice {
    public id: number = -1;
    public content: string = Config.NULL_STRING;
    public questionId: number = -1;
    public isCorrect: boolean = false;
    public selected: boolean = false;
    constructor(choice : any = {}) {
        let {id, content, questionId, isCorrect, selected} = choice;
        this.id = id ?? -1;
        this.content = content ?? Config.NULL_STRING;
        this.isCorrect = isCorrect ?? false;
        this.questionId = questionId ?? Config.NULL_STRING;
        this.selected = selected ?? false;
    }

    public static fromJS(choiceJS: ChoiceJS | string | Object): Choice {
        if (typeof choiceJS === 'string') {
            return JSON.parse(choiceJS, Choice.reviver);

        } else if(typeof choiceJS === 'object') {
            let convert: any = {};
            let keysOfChoiceJS = Object.keys(choiceJS);
            let valuesOfChoiceJS = Object.values(choiceJS);
            for (let i = 0; i < keysOfChoiceJS.length; i++) {
                const item = keysOfChoiceJS[i];
                if( item === "id" || item === "content" || item === "questionId" || item === "isCorrect" || item === "selected") {
                    convert[item] = valuesOfChoiceJS[i];
                }
            }
            return new Choice(convert);
        } else {
            let choice = Object.create(Choice.prototype);
            return Object.assign(choice, choiceJS);
        }
    }
    static reviver(key: string, value: any): any {
        return key === "" ? Choice.fromJS(value) : value;
    }
}

export default Choice;