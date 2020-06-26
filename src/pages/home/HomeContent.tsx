import { Button, Grid } from "@material-ui/core";
import React, { FunctionComponent, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { FixedContainer, LineProgress, LoadingWidget } from '../../components/Widgets';
import AppInfo from "../../models/AppInfo";
import Topic from "../../models/Topic";
import { stringToHtml } from "../../models/Utils";
import { getTopicsByParentId } from "../../redux/actions";
import { AppState } from "../../redux/appstate";
import { TopicState } from "../../redux/reducers/topic";
import { stringReplaceUrl } from "../../utils";

const HomeContentUI: FunctionComponent<({
    parentId: number,
    appInfo: AppInfo,
    appNameId: string,
    topicState: TopicState,
    getTopicsByParentId: any,
    hasState: boolean,
    onChangeState: any,
    })> = ({
    parentId,
    appInfo,
    appNameId,
    topicState,
    getTopicsByParentId,
    hasState,
    onChangeState
    }) => {
    // console.log("HomeContentUI parentId", parentId);
    useEffect(() => {
        getTopicsByParentId(parentId);
    }, [parentId]);
    // console.log("topicState", topicState);
    if(!topicState || topicState.loading === true || !topicState.data){
        return <LoadingWidget color={null} />;
    }
    let topics: Array<Topic> = [];
    let temp: Array<Topic> = Object.values(topicState.data);
    temp.forEach((topic: Topic) => {
        if(parentId == topic.parentId){
            topics.push(topic);
        }
    });
    return (
        <div style={{'backgroundColor': 'var(--main-background-color)'}} className="content-home-page">
            <FixedContainer>
                <h3 className="main-title">
                    <span>All categories { appInfo ? "of " + appInfo.appName : ""}</span>
                    {hasState ? <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => {
                            onChangeState();
                        }}>Change State</Button> : ''}
                </h3>
                <hr />
                <div>
                    <Grid 
                        className="content-panel" 
                        container
                        direction="row"
                        >
                        {
                            topics.map((t) => {
                                let topic: Topic = new Topic(t);
                                return <TopicItem topic={topic} appNameId={appNameId} key={'home-topic-item-' + topic.id} />;
                            })
                        }
                    </Grid>
                </div>
            </FixedContainer>
        </div>
    );
}

const TopicItem: FunctionComponent<({ topic?: Topic, appNameId: string })> = ({topic, appNameId}) => {
    const history = useHistory();
    // console.log("TopicItem topic", topic);
    if(!topic){
        return null;
    }
    let description = topic.description;
    let progress = topic?.progress?.progress;
    if(!progress || isNaN(progress) || progress < 0){
        progress = 0;
    }
    let link: string = '/' + appNameId + '/' + stringReplaceUrl(topic.name) + '-' + topic.id;
    return (
        <Grid item className="topic-item-panel" onClick={() => history.push(link)}>
            <a href={link} onClick={(event) => event.preventDefault()}>
                <label>{topic.name}</label>
                <div>{stringToHtml(description)}</div>
                <LineProgress percent={progress} size={'15px'} />
            </a>
        </Grid>
    );
}

const mapStateToProps = (state: AppState, ownProps: any) => ({
    topicState: state.topicReducer,
    ...ownProps
});

const mapDispatchToProps= (dispatch: any) => ({
    getTopicsByParentId: (parentId: number) => dispatch(getTopicsByParentId(parentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContentUI);