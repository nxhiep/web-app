interface TopicProgressEntity {
    id: string;
    topicId: number;
    status: number;
    lock: boolean;
    lastUpdate: number;
    userId: string;
    progress: number;
    notSeen: number;
    familiar: number;
    mastered: number;
    playing: boolean
}

export default class TopicProgress {
    public id: string;
    public topicId: number;
    public status: number;
    public lock: boolean;
    public lastUpdate: number;
    public userId: string;
    public progress: number;
    public notSeen: number;
    public familiar: number;
    public mastered: number;
    public playing: boolean;
 
    static getArguments(): Array<string> {
        return [
            'id', 'topicId', 'status', 'lock', 'lastUpdate', 
            'userId', 'progress', 'notSeen', 'familiar', 'mastered', 'playing'
        ];
    }

    constructor(props: any = {}){
        const { id, topicId, status, lock, lastUpdate, userId, progress, notSeen, familiar, mastered, playing } = props;
        this.id = id ?? topicId + '-' + userId;
        this.topicId = topicId ?? -1;
        this.status = status ?? -1;
        this.lock = lock ?? true;
        this.lastUpdate = lastUpdate ?? -1;
        this.userId = userId ?? '';
        this.progress = progress ?? 0;
        this.notSeen = notSeen ?? 0;
        this.familiar = familiar ?? 0;
        this.mastered = mastered ?? 0;
        this.playing = playing ?? false;
    }

    public static fromJS(topicProgressEntity: TopicProgressEntity | string | Object): TopicProgress {
        // console.log("topic progress", topicProgressEntity, (typeof topicProgressEntity));
        if(typeof topicProgressEntity === 'string') {
            return new TopicProgress(JSON.parse(topicProgressEntity, TopicProgress.reviver));
        } else if(typeof topicProgressEntity === 'object') {
            let convert: any = {};
            let keysOfChoiceJS = Object.keys(topicProgressEntity);
            let valuesOfChoiceJS = Object.values(topicProgressEntity);
            for (let i = 0; i < keysOfChoiceJS.length; i++) {
                const item = keysOfChoiceJS[i];
                if(TopicProgress.getArguments().indexOf(item) > -1) {
                    convert[item] = valuesOfChoiceJS[i];
                }
            }
            return new TopicProgress(convert);
        } else if(topicProgressEntity) {
            return new TopicProgress(Object.assign({}, topicProgressEntity));
        }
        alert("topicProgressEntity null")
        return new TopicProgress(topicProgressEntity);
    }

    public static init(topicId: number, userId: string): TopicProgress {
        return this.fromJS(JSON.stringify({ id: topicId + '-' + userId, userId: userId, topicId: topicId }));
    }

    static reviver(key: string, value: any): any {
        return key === "" ? TopicProgress.fromJS(value) : value;
    }

    reset() {
        this.familiar = 0;
        this.mastered = 0;
        this.progress = 0;
    }
}