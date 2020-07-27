class AppInfo {
    constructor(props) {
        let { id, appName, title, description, content, keywords, avatar, urlAndroid, urlIos, iconAndroid, iconIos, hasState, bucket, appNameId } = props;
        this.id = id !== null && id !== void 0 ? id : -1;
        this.appName = appName !== null && appName !== void 0 ? appName : '';
        this.title = title !== null && title !== void 0 ? title : '';
        this.description = description !== null && description !== void 0 ? description : '';
        this.content = content !== null && content !== void 0 ? content : '';
        this.keywords = keywords !== null && keywords !== void 0 ? keywords : '';
        this.avatar = avatar !== null && avatar !== void 0 ? avatar : '';
        this.urlAndroid = urlAndroid !== null && urlAndroid !== void 0 ? urlAndroid : '';
        this.urlIos = urlIos !== null && urlIos !== void 0 ? urlIos : '';
        this.iconAndroid = iconAndroid !== null && iconAndroid !== void 0 ? iconAndroid : '';
        this.iconIos = iconIos !== null && iconIos !== void 0 ? iconIos : '';
        this.hasState = hasState !== null && hasState !== void 0 ? hasState : false;
        this.bucket = bucket !== null && bucket !== void 0 ? bucket : '';
        this.appNameId = appNameId !== null && appNameId !== void 0 ? appNameId : '';
    }
    static fromJS(appInfo) {
        if (typeof appInfo === 'string') {
            return new AppInfo(JSON.parse(appInfo));
        }
        else {
            let obj = Object.create(AppInfo.prototype);
            return new AppInfo(Object.assign(obj, appInfo));
        }
    }
}
export default AppInfo;
