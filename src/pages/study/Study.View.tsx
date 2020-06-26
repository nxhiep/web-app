import { Button, Fab, Grid, IconButton, Tooltip } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowBack as ArrowBackIcon, ArrowRightAlt as ArrowRightAltIcon, Assignment as AssignmentIcon, Check as CheckIcon, Close as CloseIcon, Done as DoneIcon, DoneAll as DoneAllIcon, Lock as LockIcon, LockOpen as UnLockIcon, ViewList as ViewListIcon } from '@material-ui/icons';
import React, { Component, FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AlertDialogSlide, DialogInfo, ShowImage } from '../../components/Dialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import Config from '../../config';
import AppInfo from '../../models/AppInfo';
import Question from '../../models/QuestionX';
import Topic from '../../models/Topic';
import TopicProgress from '../../models/TopicProgress';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo, resetTopicProgress, updateTopicsProgress } from '../../redux/actions';
import { getCardsByParentId } from '../../redux/actions/card';
import { onContinue } from '../../redux/actions/game';
import { getTopicById, getTopicsByParentId } from '../../redux/actions/topic';
import { AppState } from '../../redux/appstate';
import { AppInfoState } from '../../redux/reducers/appInfo';
import { GameState } from '../../redux/reducers/game';
import { TopicState } from '../../redux/reducers/topic';
import '../../resources/scss/game.scss';
import '../../resources/scss/main.scss';
import '../../resources/scss/study.scss';
import Routes from '../../routes';
import { isObjEmpty, stringReplaceUrl } from '../../utils';
import { QuestionsPanelTS } from '../game/Game.ViewTS';
import ReactGA from 'react-ga';

const questionsX = new Map<number, Array<Question>>();

const StudyViewScreen: FunctionComponent<({ 
    getAppInfo: any,
    appInfoState: AppInfoState
    })> = ({
    getAppInfo,
    appInfoState
    }) => {
    let { appNameId, screen } = useParams();
    let topicId: number = -1;
    if(screen){
        let offset = screen.lastIndexOf('-') + 1;
        topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    }
    appNameId = appNameId ?? '';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        getAppInfo(appNameId);
        if(isMobile){
            scrollToTop();
        }
    }, [getAppInfo, appNameId, isMobile]);
    let appInfo = appInfoState.data[appNameId];
    useEffect(() => {
        if(appInfo){
            setSEOContent({
                title: 'Study - ' + appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.avatar
            });
            ReactGA.pageview('/studypage/' + appInfo.title);
        }
    }, [appInfo]);
    if(!appInfo){
        return <LoadingWidget />
    }
    return (
        <StudyView appInfo={appInfo} topicId={topicId} isMobile={isMobile} />
    );
}

class StudyViewScreenUI extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            id: props.topicId,
            appInfo: props.appInfo,
            topics: null,
            currentTopic: null,
            currentIndex: 0,
            showGame: false,
            showAlertName: '',
            isMobile: props.isMobile
        }
        this.props.getTopicsByParentId(this.state.id);
    }

    checkLoaded(prevState: TopicState, nextState: TopicState) {
        return (prevState.loading === true && nextState.loading === false && nextState.data) || 
        (prevState.loading === false && !isObjEmpty(prevState.data) && nextState.loading === false && !isObjEmpty(nextState.data));
    }

    componentWillReceiveProps(nextProps: AppState) {
        console.log('componentWillReceiveProps nextProps', Object.assign({}, this.props), Object.assign({}, nextProps));
        let topicState: TopicState = nextProps.topicReducer;
        if(this.checkLoaded(this.props.topicReducer, topicState)){
            // console.log('componentWillReceiveProps nextProps', Object.values(topicState.data));
            let temp: Array<Topic> = Object.values(topicState.data);
            let parts: Array<Topic> = new Array<Topic>();
            let playingIndex: number = -1;
            temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach((topic: Topic) => {
                if(topic.parentId === this.state.id){
                    if(topic.progress.playing === true){
                        playingIndex = parts.length;
                    }
                    parts.push(topic);
                }
            });
            console.log('parts', parts, 'playingIndex', playingIndex);
            if(parts.length > 0){
                if(playingIndex < 0){
                    playingIndex = 0;
                }
                parts[playingIndex].progress.lock = false;
                parts[playingIndex].progress.playing = true;
                // console.log("3333333 updateTopicsProgress ", parts[playingIndex].progress);
                this.props.updateTopicsProgress([parts[playingIndex].progress]);
                this.setState({
                    topics: parts,
                    currentIndex: playingIndex,
                    currentTopic: parts[playingIndex],
                });
            } else {
                console.log("END GAME");
            }
        }
        // console.log("nextProps.topicReducer xxxx ", nextProps.topicReducer, " ------------------ nextProps.gameState", nextProps.gameState);
        // TODO: check next topic 
        if(nextProps.gameState?.isFinish === true){
            this.setState({
                showGame: nextProps.gameState.isFinish,
            })
        //     // alert("done");
        //     console.log("finish currentIndex", this.state.currentIndex, 'topics', this.state.topics);
        //     let newIndex = this.state.currentIndex + 1;
        //     if(newIndex < this.state.topics.length){
        //         let currentTopic: Topic = this.state.topics[newIndex];
        //         this.activeTopic(currentTopic, newIndex);
        //     } else {
        //         console.log("END GAME");
        //     }
        }
    }

    activeTopic(currentTopic: Topic, index: number) {
        let mapTopicProgress: any = {};
        this.state.topics.forEach((topic: Topic) => {
            if(topic.progress.playing === true){
                topic.progress.playing = false;
                mapTopicProgress[topic.id] = topic.progress;
            }
        });
        
        currentTopic.progress.lock = false;
        currentTopic.progress.playing = true;
        mapTopicProgress[currentTopic.id] = currentTopic.progress;
        let listP: Array<TopicProgress> = Object.values(mapTopicProgress);
        this.props.updateTopicsProgress(listP);
        this.setState({
            currentIndex: index,
            currentTopic: currentTopic,
            showGame: true
        });
    }

    componentDidUpdate() {
        // Check open next topic part
        let currentTopic: Topic = this.state.currentTopic;
        let topics: Array<Topic> = this.state.topics;
        // console.log("this.state.currentTopic", currentTopic && topics ? topics.length : null, currentTopic, 'getPercentComplete', currentTopic ? currentTopic.getPercentComplete() : null, 'current index', this.state.currentIndex);
        if(currentTopic && topics && topics.length > (this.state.currentIndex + 1)
            && currentTopic.getPercentComplete() >= Config.NEXT_PART_PROGRESS && topics[this.state.currentIndex + 1].progress.lock === true){
            // console.log("OK", topics[this.state.currentIndex + 1]);
            let i = this.state.currentIndex + 1;
            topics[i].progress.lock = false;
            this.setState({
                topics: topics
            });
            // console.log("22222222 updateTopicsProgress ", topics[i].progress);
            this.props.updateTopicsProgress([topics[i].progress]);
        }
    }

    render() {
        const { onContinue } = this.props;
        const currentTopic = this.state.currentTopic;
        let currentQuestionIndex = 0;
        let gameState: GameState = this.props.gameState;
        console.log("currentTopic", currentTopic);
        if(gameState){
            let topicId = gameState.id ?? -1;
            if (!questionsX.has(topicId) || questionsX.get(topicId)?.length === 0) {
                // console.log("gameState.questions topicId", topicId, 'questions', gameState.questions);
                questionsX.set(topicId, gameState.questions.map((item: Question) => Object.assign({}, item)));
            }
            // console.log("SIZE ", questionsX.size);
            if (questionsX.size > 0) {
                // console.log("ngao ngao ngao");
                let currentQuestionId: number = gameState.currentQuestion?.id ?? -1;
                // console.log("currentQuestionId ", currentQuestionId);
                if(currentQuestionId){
                    let listQ: Array<Question> = questionsX.get(topicId) ?? new Array<Question>();
                    currentQuestionIndex = listQ ? listQ.findIndex((q: Question) => q.id === currentQuestionId) : 0;
                }
            }
        }
        let congratulationTopic = (!!gameState.isFinish);
        // console.log("congratulationTopiccongratulationTopiccongratulationTopic", gameState);
        return (
            <MainWidget className={(this.state.isMobile ? " mobile" : "")}>
                {/* <MyAlert /> */}
                <Header />
                <FixedContainer className="study-game-panel">
                    {!!this.state.showAlertName ? 
                    <CongratulationAlert topicName={this.state.showAlertName} onClose={() => this.setState({ showAlertName: '' })} />
                    : null }
                    <Grid
                        container
                        direction="row"
                        spacing={this.state.isMobile ? 0 : 3}
                    >
                        <Grid item xs={12} sm={12} md={5} lg={4} className="left-panel" style={this.state.isMobile ? {display: (this.state.showGame ? 'none' : '')} : {}}>
                            <TopicInfoPanel 
                                topicId={currentTopic ? currentTopic.parentId : -1} 
                                appInfo={this.state.appInfo}
                                isMobile={this.state.isMobile} />
                            <TopicTreePanel 
                                parentId={this.state.id} 
                                currentQuestionId={currentTopic ? currentTopic.id : null} 
                                onChangeTopic={(topic: Topic, index: number) => {
                                    this.activeTopic(topic, index);
                                    this.setState({
                                        showGame: true
                                    })
                                }}
                                openAlert={(topic: Topic) => {
                                    this.setState({
                                        showAlertName: topic.name
                                    })
                                }}
                                />
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={8} className="right-panel" style={this.state.isMobile ? {display: (this.state.showGame ? '' : 'none')} : {}}>
                            {this.state.isMobile && this.state.showGame ? 
                                <Grid 
                                    style={{borderBottom: '1px solid #ddd'}} 
                                    container alignItems="center" >
                                    <IconButton onClick={() => {
                                        this.setState({
                                            showGame: false
                                        })
                                    }}><ArrowBackIcon /></IconButton>
                                    <span>{currentTopic ? currentTopic.name : ''}</span>
                                </Grid> : ''
                            }
                            { this.renderRightContentPanel(currentTopic, currentQuestionIndex, congratulationTopic, this.state.appInfo) }
                            <Grid
                                container
                                alignItems="center"
                                justify="center"
                                >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="next-part-button"
                                    onClick={() => {
                                        // console.log("XXXX congratulationTopic ", congratulationTopic);
                                        if(congratulationTopic){
                                            this.onNextPart();
                                        } else {
                                            onContinue();
                                        }
                                    }}
                                >
                                    {congratulationTopic ? 'Next part' : 'Next Question'}    <ArrowRightAltIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </FixedContainer>
                {!this.state.isMobile || !this.state.showGame ? <FloatingButtonTest currentTopic={this.state.currentTopic} /> : ''}
                <Footer />
                <ShowImage />
            </MainWidget>
        );
    }

    onNextPart() {
        // let gameState: GameState = this.props.gameState;
        // if(gameState && gameState.isFinish === true){
            // console.log("finish currentIndex", this.state.currentIndex, 'topics', this.state.topics);
            let newIndex = this.state.currentIndex + 1;
            if(newIndex < this.state.topics.length){
                let currentTopic: Topic = this.state.topics[newIndex];
                this.activeTopic(currentTopic, newIndex);
            } else {
                console.log("END GAME");
            }
        // }
    }

    renderRightContentPanel(currentTopic: Topic, currentQuestionIndex: number, congratulationTopic: boolean, appInfo: AppInfo) {
        // console.log("renderRightContentPanel", currentTopic ? currentTopic.getPercentComplete() : null);
        return (
            <div>
                <div style={congratulationTopic ? {display: 'none'} : {}}>
                    <QuestionProgressPanel topic={currentTopic} />
                    {
                        currentTopic ?
                        <QuestionsPanelTS
                            appInfo={appInfo}
                            className="question-view-study-game"
                            topicId={currentTopic.id}
                            gameType={Config.STUDY_GAME}
                            currentIndex={currentQuestionIndex}
                        /> : <LoadingWidget />
                    }
                </div>
                <div className="topic-congratulations-panel" style={congratulationTopic ? {} : {display: 'none'}}>
                    <h1>Congratulations!</h1>
                    <p>You have passed {currentTopic ? currentTopic.name : ''} with excellent performance</p>
                    <div></div>
                </div>
            </div>
        );
    }
}

const CongratulationAlert: FunctionComponent<({ topicName: string, onClose: any })> = ({ topicName = "", onClose = () => {} }) => {
    useEffect(() => {
        let time = setTimeout(() => {
            onClose();
        }, 5000);
        return () => {
            clearTimeout(time);
        };
    }, [topicName]);
    return (
        <Grid container alignItems="center" justify="space-between" className="congratulation-alert-panel">
            <div></div>
            <div className="title">
                <UnLockIcon width="100px" fontSize="large" />
                <span>You must complete previous topic <strong>{topicName}</strong>!</span>
            </div>
            <IconButton onClick={() => onClose()}><CloseIcon /></IconButton>
        </Grid>
    );
}

const FloatingButtonTest: FunctionComponent<({ currentTopic: Topic })> = ({ currentTopic }) => {
    let history = useHistory();
    if(!currentTopic){
        return null;
    }
    let name = stringReplaceUrl(currentTopic.name);
    return (
        <Fab color="secondary" variant="extended" className="floating-button-test" 
        onClick={() => {
            // history.push(id > -1 ? Routes.TEST_SCREEN + "?appId="+getAppId()+"&id=" + id : Routes.TEST_SCREEN);
            history.push(Routes.TEST_SCREEN + '-' + name + '-' + currentTopic.id);
        }}>
            <AssignmentIcon /> Test
        </Fab>
    );
}

const QuestionProgressPanelUI = (props: any) => {
    // const theme = useTheme();
    // console.log("QuestionProgressPanelUI props", props, 'theme', theme);
    let topic: Topic = props?.topic;
    let gameState: GameState = props?.gameState;
    console.log("topic", topic, 'gameState', gameState);
    if (!gameState || !gameState?.isLoaded) {
        return <LoadingWidget />
    }
    let topicId = gameState.id ?? -1;
    let currentQuestion: Question = gameState.currentQuestion ?? new Question();
    let listQuestion: Array<Question> = questionsX.get(topicId) ?? new Array<Question>();
    let loading = gameState.isLoading == 1 || gameState.isLoading == 2;
    return (
        <div className="question-progress-panel">
            <div className="topic-name"><ViewListIcon /> <span>{topic ? topic.name : 'Topic name'}</span></div>
            <div className="scroll-panel function-scroll-panel">
                <div className="list-question-panel">
                    { loading ? <LoadingWidget /> : 
                        (listQuestion.map((item: Question, index: number) => {
                            return <QuestionItemProgress
                                    index={index}
                                    key={'question-item-right-' + item.id}
                                    question={item}
                                    currentQuestion={currentQuestion}
                                    />;
                        }))
                    }
                </div>
            </div>
        </div>
    );
}

const QuestionItemProgress: FunctionComponent<({ 
        index: number, 
        question: Question,
        currentQuestion: Question
    })> = ({ 
        index, 
        question,
        currentQuestion
    }) => {
        if (question.id === currentQuestion.id && currentQuestion.questionStatus !== Config.QUESTION_NOT_ANSWERED) {
            question.questionStatus = currentQuestion.questionStatus;
            question.progress.boxNum = currentQuestion.progress.boxNum
        }
        let progress = question.progress;
        let statusStr = '';
        let borderCurrent = "";
        if (question.id === currentQuestion.id) {
            borderCurrent = " border-current-question"
        }
        if (question.questionStatus === Config.QUESTION_ANSWERED_CORRECT) {
            statusStr = ' correct';
        } else if (question.questionStatus === Config.QUESTION_ANSWERED_INCORRECT) {
            statusStr = ' incorrect';
        }
        let icon;
        if (progress.boxNum === 1) {
            icon = <DoneIcon className="icon" />;
        } else if (progress.boxNum > 1) {
            icon = <DoneAllIcon className="icon" />;
        }
        useEffect(() => {
            if (question.id === currentQuestion.id) {
                onScrollHoz('function-scroll-panel', index);
            }
        }, [question, currentQuestion]);
    return (
        <div className={"question-item" + statusStr + borderCurrent}>
            <span >{index + 1}</span>
        {icon}
    </div>
    );
}

export function onScrollHoz(parentClass: string, index: number) {
    let parentsElement = document.getElementsByClassName(parentClass);
    let scrollLeft = index * 60;
    console.log('onScrollHoz ', scrollLeft, parentsElement.length);
    for(let index = 0; index < parentsElement.length; index ++) {
        let parentElement = parentsElement[index];
        parentElement.scrollTo({ left: scrollLeft });
    }
}

const TopicInfoPanelUI: FunctionComponent<({ 
    topicId: string,
    getTopicById: any,
    topicState: TopicState,
    appInfo: AppInfo,
    isMobile: boolean
    })> = ({ 
    topicId = -1,
    getTopicById,
    topicState,
    appInfo,
    isMobile
    }) => {
    useEffect(() => {
        getTopicById(topicId);
    }, [topicId]);
    let history = useHistory();
    if(topicState.loading === true || !topicState.data || isObjEmpty(topicState.data)){
        return <LoadingWidget />
    }
    let topic: Topic = topicState.data[topicId];
    if(!topic){
        return <div></div>;
    }
    if(isMobile){
        return (
            <Grid container alignItems="center" >
                <IconButton onClick={() => {
                    history.push("/" + appInfo.appNameId);
                }}><ArrowBackIcon /></IconButton>
                <span>{topic.name}</span>
            </Grid>
        );
    }
    return (
        <div className="topic-info-panel">
            {topic.name}
        </div>
    );
}

const TopicTreePanelUI: FunctionComponent<(
    { 
        topicState: TopicState, 
        parentId: number, 
        currentQuestionId: number,
        onChangeTopic: Function,
        resetTopicProgress: any,
        openAlert: Function
    })> = ({ topicState, parentId, currentQuestionId, onChangeTopic, resetTopicProgress, openAlert }) => {
        const [dialogInfo, setDialogInfo] = useState(DialogInfo.init());
    // console.log("TopicTreePanelUI props", Object.assign({}, props));
    if (!topicState || topicState.loading === true || !topicState.data) {
        return <LoadingWidget />
    }
    let topics: Array<Topic> = [];
    let temp: Array<Topic> = Object.values(topicState.data);
    temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach((topic: Topic) => {
        if(parentId === topic.parentId){
            topics.push(topic);
        }
    });
    let widgets = [], childs: any[] = [];
    let count = 0;
    let totalQuestion = 0, familiar = 0, mastered = 0;
    let lastTopicUnLock = 0;
    console.log("topics", topics);
    // let mapTopicProgress: any = topicProgressReducer.data;
    topics.forEach((topic, index) => {
        let progress: TopicProgress = topic.progress;
        if (progress.lock === false) {
            lastTopicUnLock = index;
        }
        familiar += progress.familiar;
        mastered += progress.mastered;
    });

    const onClickTopic = (topic: Topic, index: number,  type: number) => {
        console.log("onClickTopic topic ", topic, 'type', type);
        if(type === 1){ // completed
            setDialogInfo(new DialogInfo({ title: 'Play again', msg: 'Do you want to reset all progress of this part!', okText: '', cancelText: '',
                onConfirm: (result: boolean) => {
                if(result){
                    //TODO: reset topic
                    topic.progress.reset();
                    resetTopicProgress(topic.progress);
                    onChangeTopic(topic, index);
                }
            } }));
        } else if(type === 2) { // locked
            // setDialogInfo(new DialogInfo({ title:'Notice', msg: 'Completed previous topic!', okText: ''}));
            openAlert(topic);
        } else if(type === 3) { // click topic
            onChangeTopic(topic, index);
        }
    }

    topics.forEach((topic, index) => {
        totalQuestion += topic.totalQuestion;
        let active = currentQuestionId === topic.id;
        if (count % 2 === 0) {
            childs.push(<TopicItem 
                topic={topic} 
                key={'topic-item-' + parentId + '-' + topic.id} 
                index={index} 
                active={active} 
                onClickTopic={onClickTopic} />);
            if (childs.length === 3) {
                count++;
                childs.splice(1, 0, <div key={"topic-row-1-l-r-" + parentId + '-' + topic.id} className={"topic-line topic-row-1-l-r" + (lastTopicUnLock < index ? " active" : "")}></div>);
                childs.splice(3, 0, <div key={"topic-row-2-l-r-" + parentId + '-' + topic.id} className="topic-line topic-row-2-l-r"></div>);
                childs.push(<div key={"topic-row-3-l-r-c-" + parentId + '-' + topic.id} className="topic-line topic-row-3-l-r-c"></div>);
                let row = <div className="parent-topics-row" key={'topic-row-' + parentId + '-' + count + '-' + topic.id}><div className="topics-row">{[...childs]}</div></div>;
                widgets.push(row);
                childs = [];
            }
        } else {
            childs.unshift(<TopicItem 
                topic={topic} 
                key={'topic-item-' + parentId + '-' + topic.id} 
                active={active}
                onClickTopic={onClickTopic} />);
            if (childs.length === 2) {
                count++;
                childs.splice(1, 0, <div key={"topic-row-1-r-l-" + parentId + '-' + topic.id} className="topic-line topic-row-1-r-l"></div>);
                childs.unshift(<div key={"topic-row-2-r-l-" + parentId + '-' + topic.id} className="topic-line topic-row-2-r-l-c"></div>);
                let row = <div className="parent-topics-row" key={'topic-row-' + parentId + '-' + count + '-' + topic.id}><div className="topics-row">{[...childs]}</div></div>;
                widgets.push(row);
                childs = [];
            }
        }
    });

    if (childs.length > 0) {
        if (count % 2 === 0) {
            let row = <div className="parent-topics-row" key={'topic-row-' + parentId + '-' + count}><div className="topics-row">{[...childs]}</div></div>;
            widgets.push(row);
        } else {
            let row = <div className="parent-topics-row" key={'topic-row-' + parentId + '-' + count}><div className="topics-row">{[...childs]}</div></div>;
            widgets.push(row);
        }
    }

    return (
        <div className="parent-topic-tree-panel">
            {dialogInfo ? <AlertDialogSlide dialogInfo={dialogInfo} /> : ''}
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-around"
                className="question-result-info"
            >
                <div className="item">
                    <label>Not seen</label>
                    <div>{totalQuestion - familiar - mastered}</div>
                </div>
                <div className="item-line"></div>
                <div className="item">
                    <label>Familiar</label>
                    <div>{familiar} <DoneIcon /></div>
                </div>
                <div className="item-line"></div>
                <div className="item">
                    <label>Mastered</label>
                    <div>{mastered} <DoneAllIcon /></div>
                </div>
            </Grid>
            <div className="box-topic-tree-panel">
                <div className="topic-tree-panel">
                    {widgets}
                </div>
            </div>
        </div>
    );
}

const TopicItem: FunctionComponent<({ 
        topic: Topic, 
        active?: boolean, 
        index?: number,
        onClickTopic: Function
    })> = ({ 
        topic, 
        active = false, 
        index = 0,
        onClickTopic
    }) => {
    let progress: TopicProgress = topic.progress;
    // console.log("TopicItem topic", topic.getPercentComplete());
    if (topic.getPercentComplete() === 100) {
        return (
            <div className={"topic-item completed" + (active ? ' active' : '')} onClick={() => onClickTopic(topic, index, 1)}>
                <div className="lds-ripple"><div></div><div></div><div></div></div>
                <div className="topic-content"><CheckIcon /></div>
                <div className="topic-name" data-id={topic.id} data-index={topic.orderIndex}>{topic.name}</div>
            </div>
        );
    }
    if (progress.lock === true) {
        return (
            <Tooltip title="Completed previous topic!">
                <div className="topic-item locked" onClick={() => onClickTopic(topic, index, 2)}>
                    <div className="topic-content"><LockIcon /></div>
                    <div className="topic-name" data-id={topic.id} data-index={topic.orderIndex}>{topic.name}</div>
                </div>
            </Tooltip>
        );
    }
    return (
        <div className={"topic-item" + (active ? ' active' : '')} onClick={() => onClickTopic(topic, index, 3)}>
            <div className="lds-ripple"><div></div><div></div><div></div></div>
            <div className="topic-content">{topic.getPercentComplete()}%</div>
            <div className="topic-name" data-id={topic.id} data-index={topic.orderIndex}>{topic.name}</div>
        </div>
    );
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        topicReducer: state.topicReducer,
        cardReducer: state.cardReducer,
        gameState: state.gameState,
        appValueState: state.appValueState,
        ...ownProps
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    getCardsByParentId: (parentId: number) => dispatch(getCardsByParentId(parentId)),
    onContinue: () => dispatch(onContinue()),
    getTopicsByParentId: (parentId: number) => dispatch(getTopicsByParentId(parentId)),
    updateTopicsProgress: (topicsProgress: Array<TopicProgress>) => dispatch(updateTopicsProgress(topicsProgress)),
});

const mapDispatchTopicTreeToProps = (dispatch: any) => ({
    resetTopicProgress: (topicProgress: TopicProgress) => dispatch(resetTopicProgress(topicProgress))
});

const TopicTreePanel = connect((state: AppState, ownProps: any) => {
    // console.log("LOL", Object.assign({}, state));
    return {
        topicState: state.topicReducer,
        gameState: state.gameState,
        topicProgressReducer: state.topicProgressReducer,
        ...ownProps
    }
}, mapDispatchTopicTreeToProps)(TopicTreePanelUI); // TODO: add action

const QuestionProgressPanel = connect((state: AppState, ownProps: any) => {
    return { 
        gameState: state.gameState, 
        ...ownProps 
    };
}, null)(QuestionProgressPanelUI); // TODO: add action

const TopicInfoPanel = connect((state: AppState, ownProps: any) => {
    return { 
        topicState: state.topicReducer, 
        ...ownProps 
    };
}, 
(dispatch: any) => ({
    getTopicById: (topicId: number) => dispatch(getTopicById(topicId))
})
)(TopicInfoPanelUI); // TODO: add action

const StudyView = connect(mapStateToProps, mapDispatchToProps)(StudyViewScreenUI);

const mapStateToPropsMain = (state: AppState, ownProps: any) => {
    return {
        appInfoState: state.appInfoState,
        ...ownProps
    };
}

const mapDispatchToPropsMain = (dispatch: any) => ({
    getAppInfo: (appNameId: string) => dispatch(getAppInfo(appNameId))
});

export default connect(mapStateToPropsMain, mapDispatchToPropsMain)(StudyViewScreen);