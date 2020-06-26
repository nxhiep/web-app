interface UserRateEntity {
    id: number;
    userId: string;
    userName: string;
    appId: number;
    createDate: number;
    lastUpdate: number;
    content: string;
    avatar: string;
    rateValue: number
}

class UserRate {
    public id: number;
    public userId: string;
    public userName: string;
    public appId: number;
    public createDate: number;
    public lastUpdate: number;
    public content: string;
    public avatar: string;
    public rateValue: number;

    constructor(props: UserRateEntity) {
        let { id, userId, userName, appId, createDate, lastUpdate, content, avatar, rateValue } = props;
        this.id = id ?? -1;
        this.userId = userId ?? '';
        this.userName = userName ?? '';
        this.appId = appId ?? -1;
        this.createDate = createDate ?? -1;
        this.lastUpdate = lastUpdate ?? -1;
        this.content = content ?? '';
        this.avatar = avatar ?? '';
        this.rateValue = rateValue ?? 0;
    }

    public static fromJS(userRateEntity: UserRateEntity | string | Object): UserRate {
        if (typeof userRateEntity === 'string') {
            return new UserRate(JSON.parse(userRateEntity));
        } else {
            let obj = Object.create(UserRate.prototype);
            return new UserRate(Object.assign(obj, userRateEntity));
        }
    }
}

export default UserRate;