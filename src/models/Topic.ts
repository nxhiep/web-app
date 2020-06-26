import TopicProgress from "./TopicProgress";
import Config from "../config";

interface TopicEntity {
    instanceFeedback: boolean;
    totalQuestion: number;
    allowMistake: boolean;
    contentTest: Array<number>;
    topicId: number;
    id: number;
    parentId: number
    status: number;
    rootTopicId: number;
    shortId: number;
    name: string;
    description: string;
    orderIndex: number;
    allowMistakes: number;
    lastUpdate: number;
    childrentType: number;
    level: number;
    cardShortIds: Array<number>;
    decks: Array<number>;
    // cards: Array<Card>;
    // this.states = [];
    // this.quizs = [];
    // this.topicQuestions = [];
    progress: TopicProgress;
}
export default class Topic {
    public instanceFeedback: boolean;
    public totalQuestion: number;
    public contentTest: Array<number>;
    public topicId: number;
    public id: number;
    public parentId: number
    public status: number;
    public rootTopicId: number;
    public shortId: number;
    public name: string;
    public description: string;
    public orderIndex: number;
    public allowMistakes: number;
    public lastUpdate: number;
    public childrentType: number;
    public level: number;
    public cardShortIds: Array<number>;
    public decks: Array<number>;
    public progress: TopicProgress | any;

    static getArguments(): Array<string> {
        return [
            'instanceFeedback', 'totalQuestion', 'contentTest', 
            'topicId', 'id', 'parentId', 'status', 'rootTopicId', 
            'shortId', 'name', 'description', 'orderIndex', 'allowMistakes', 
            'lastUpdate', 'childrentType', 'level', 'cardShortIds', 'decks', 'progress'
        ];
    }

    constructor(props: any = {}) {
        let { instanceFeedback, totalQuestion, 
            contentTest, topicId, id, parentId, status, rootTopicId, 
            shortId, name, description, orderIndex, allowMistakes, 
            lastUpdate, childrentType, level, cardShortIds, decks, progress } = props;
        this.instanceFeedback = instanceFeedback ?? false;
        this.totalQuestion = totalQuestion ?? 0;
        this.contentTest = contentTest ?? [];
        this.topicId = topicId ?? -1;
        this.id = id ?? -1;
        this.parentId = parentId ?? -1;
        this.status = status ?? -1;
        this.rootTopicId = rootTopicId ?? -1;
        this.shortId = shortId ?? -1;
        this.name = name ?? '';
        this.description = description ?? '';
        this.orderIndex = orderIndex ?? -1;
        this.allowMistakes = allowMistakes ?? -1;
        this.lastUpdate = lastUpdate ?? -1;
        this.childrentType = childrentType ?? -1;
        this.level = level ?? -1;
        this.cardShortIds = cardShortIds ?? [];
        this.decks = decks ?? [];
        // console.log("2222222222222222222222222222222222", id, progress);
        if(progress){
            this.progress = TopicProgress.fromJS(progress);
        } else {
            this.progress = TopicProgress.init(this.id, Config.USER_ID);
        }
    }

    public static fromJS(topicEntity: TopicEntity | string | Object): Topic {
        // console.log("topic fromJS ", typeof topicEntity);
        if (typeof topicEntity === 'string') {
            // return JSON.parse(topicEntity, Topic.reviver);
            return new Topic(JSON.parse(topicEntity, Topic.reviver));
        } else if(typeof topicEntity === 'object') {
            let convert: any = {};
            let keysOfChoiceJS = Object.keys(topicEntity);
            let valuesOfChoiceJS = Object.values(topicEntity);
            for (let i = 0; i < keysOfChoiceJS.length; i++) {
                const item = keysOfChoiceJS[i];
                if(Topic.getArguments().indexOf(item) > -1) {
                    convert[item] = valuesOfChoiceJS[i];
                }
            }
            return new Topic(convert);
        } else if(topicEntity) {
            let choice = Object.create(Topic.prototype);
            return new Topic(Object.assign(choice, topicEntity));
        }
        return new Topic(topicEntity);
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Topic.fromJS(value) : value;
    }

    getPercentComplete() {
        if(this.progress){
            if(this.totalQuestion == 0){
                return 0;
            }
            let p = (this.progress.familiar * 0.5 + this.progress.mastered * 1) / this.totalQuestion;
            return Math.round(p * 100);
        }
        return 0;
    }
}