import Config from "../config";

export interface TestSettingEntity {
    appId: number;
    topicId: number;
    instanceFeedback: boolean;
    totalQuestion: number;
    allowMistake: boolean;
    contentTest: Array<number>; // topicIds
}

class TestSetting {
    public appId: number;
    public topicId: number;
    public instanceFeedback: boolean;
    public totalQuestion: number;
    public allowMistake: number;
    public contentTest: Array<number>; // topicIds

    constructor(props: any = {}) {
        let { appId, topicId, instanceFeedback, totalQuestion, allowMistake, contentTest } = props;
        this.appId = appId ?? -1;
        this.topicId = topicId ?? -1;
        this.instanceFeedback = instanceFeedback ??  false;
        this.totalQuestion = totalQuestion ?? Config.TEST_TOTAL_QUESTION;
        this.allowMistake = allowMistake ?? Config.TEST_ALLOW_MISTAKE;
        this.contentTest = contentTest ?? []
    }
    static init(appId: number, topicId: number, contentTest: Array<number>) {
        return  TestSetting.fromJS({ appId: appId, topicId: topicId, contentTest: contentTest });
    }

    toJS() {
        return {
            appId: this.appId,
            topicId: this.topicId,
            instanceFeedback: this.instanceFeedback,
            questionsNumber: this.totalQuestion,
            mistakesNumber: this.allowMistake,
            contentTest: this.contentTest
        }
    }
   

    public static fromJS(testSettingEntity: TestSettingEntity | string | Object): TestSetting {
        if (typeof testSettingEntity === 'string') {
            return new TestSetting(JSON.parse(testSettingEntity));
        } else {
            let obj = Object.create(TestSetting.prototype);
            return new TestSetting(Object.assign(obj, testSettingEntity));
        }
    }
}

export default TestSetting;