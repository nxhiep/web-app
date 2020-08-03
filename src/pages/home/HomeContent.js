import { Button, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { FixedContainer, LineProgress, LoadingWidget } from '../../components/Widgets';
import Topic from "../../models/Topic";
import { stringToHtml } from "../../models/Utils";
import { getTopicsByParentId } from "../../redux/actions";
import { stringReplaceUrl } from "../../utils";
const HomeContentUI = ({ parentId, appInfo, appNameId, topicState, getTopicsByParentId, hasState, onChangeState }) => {
    console.log(parentId)
    useEffect(() => {
        getTopicsByParentId(parentId);
    }, [parentId]);
    // console.log("topicState", topicState);
    // if (!topicState || topicState.loading === true || !topicState.data) {
    //     return React.createElement(LoadingWidget, { color: null });
    // }
    let topics = [];
    let temp = Object.values(topicState.data);
    temp.forEach((topic) => {
        if (parentId == topic.parentId) {
            topics.push(topic);
        }
    });
    return (React.createElement("div", { style: { 'backgroundColor': 'var(--main-background-color)' }, className: "content-home-page" },
        React.createElement(FixedContainer, null,
            React.createElement("h3", { className: "main-title" },
                React.createElement("span", null,
                    "All categories ",
                    appInfo ? "of " + appInfo.appName : ""),
                hasState ? React.createElement(Button, {
                    variant: "outlined", color: "primary", onClick: () => {
                        onChangeState();
                    }
                }, "Change State") : ''),
            React.createElement("hr", null),
            React.createElement("div", null,
                React.createElement(Grid, { className: "content-panel", container: true, direction: "row" }, topics.map((t) => {
                    let topic = new Topic(t);
                    return React.createElement(TopicItem, { topic: topic, appNameId: appNameId, key: 'home-topic-item-' + topic.id });
                }))))));
};
const TopicItem = ({ topic, appNameId }) => {
    var _a;
    const history = useHistory();
    // console.log("TopicItem topic", topic);
    if (!topic) {
        return null;
    }
    let description = topic.description;
    let progress = (_a = topic === null || topic === void 0 ? void 0 : topic.progress) === null || _a === void 0 ? void 0 : _a.progress;
    if (!progress || isNaN(progress) || progress < 0) {
        progress = 0;
    }
    let link = '/' + appNameId + '/' + stringReplaceUrl(topic.name) + '-' + topic.id;
    return (React.createElement(Grid, { item: true, className: "topic-item-panel", onClick: () => history.push(link) },
        React.createElement("a", { href: link, onClick: (event) => event.preventDefault() },
            React.createElement("label", null, topic.name),
            React.createElement("div", null, stringToHtml(description)),
            React.createElement(LineProgress, { percent: progress, size: '15px' }))));
};
const mapStateToProps = (state, ownProps) => (Object.assign({ topicState: state.topicReducer }, ownProps));
const mapDispatchToProps = (dispatch) => ({
    getTopicsByParentId: (parentId) => dispatch(getTopicsByParentId(parentId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeContentUI);
