export interface StateInfoEntity {
    id: number;
    shortId: number;
    parentId: number;
    name: string;
    shortName: string;
    governmentAgency: string
}

export class StateInfo {
    public id: number;
    public shortId: number;
    public parentId: number;
    public name: string;
    public shortName: string;
    public governmentAgency: string;

    constructor(props: StateInfoEntity | any) {
        let { id, shortId, parentId, name, shortName, governmentAgency } = props;
        this.id = id ?? -1;
        this.shortId = shortId ?? -1;
        this.parentId = parentId ?? -1;
        this.name = name ?? '';
        this.shortName = shortName ?? '';
        this.governmentAgency = governmentAgency ?? '';
    }

    static init() {
        return new StateInfo({});
    }
    
    public static fromJS(stateEntity: StateInfoEntity | string | Object): StateInfo {
        if (typeof stateEntity === 'string') {
            return new StateInfo(JSON.parse(stateEntity));
        } else {
            let obj = Object.create(StateInfo.prototype);
            return new StateInfo(Object.assign(obj, stateEntity));
        }
    }
}