import { Button, Fab, Grid, IconButton, Tooltip } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowBack as ArrowBackIcon, ArrowRightAlt as ArrowRightAltIcon, Assignment as AssignmentIcon, Check as CheckIcon, Close as CloseIcon, Done as DoneIcon, DoneAll as DoneAllIcon, Lock as LockIcon, LockOpen as UnLockIcon, ViewList as ViewListIcon } from '@material-ui/icons';
import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AlertDialogSlide, DialogInfo, ShowImage } from '../../components/Dialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import Config from '../../config';
import Question from '../../models/QuestionX';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo, resetTopicProgress, updateTopicsProgress } from '../../redux/actions';
import { getCardsByParentId } from '../../redux/actions/card';
import { onContinue } from '../../redux/actions/game';
import { getTopicById, getTopicsByParentId } from '../../redux/actions/topic';
import '../../resources/scss/game.scss';
import '../../resources/scss/main.scss';
import '../../resources/scss/study.scss';
import Routes from '../../routes';
import { isObjEmpty, stringReplaceUrl } from '../../utils';
import { QuestionsPanelTS } from '../game/Game.ViewTS';
import ReactGA from 'react-ga';
const questionsX = new Map();
const StudyViewScreen = ({ getAppInfo, appInfoState }) => {
    let { appNameId, screen } = useParams();
    let topicId = -1;
    if (screen) {
        let offset = screen.lastIndexOf('-') + 1;
        topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    }
    appNameId = appNameId !== null && appNameId !== void 0 ? appNameId : '';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        getAppInfo(appNameId);
        if (isMobile) {
            scrollToTop();
        }
    }, [getAppInfo, appNameId, isMobile]);
    let appInfo = appInfoState.data[appNameId];
    useEffect(() => {
        if (appInfo) {
            setSEOContent({
                title: 'Study - ' + appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.avatar
            });
            ReactGA.pageview('/studypage/' + appInfo.title);
        }
    }, [appInfo]);
    if (!appInfo) {
        return React.createElement(LoadingWidget, null);
    }
    return (React.createElement(StudyView, { appInfo: appInfo, topicId: topicId, isMobile: isMobile }));
};
class StudyViewScreenUI extends Component {
    constructor(props) {
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
        };
        this.props.getTopicsByParentId(this.state.id);
    }
    checkLoaded(prevState, nextState) {
        return (prevState.loading === true && nextState.loading === false && nextState.data) ||
            (prevState.loading === false && !isObjEmpty(prevState.data) && nextState.loading === false && !isObjEmpty(nextState.data));
    }
    componentWillReceiveProps(nextProps) {
        var _a;
        console.log('componentWillReceiveProps nextProps', Object.assign({}, this.props), Object.assign({}, nextProps));
        let topicState = nextProps.topicReducer;
        if (this.checkLoaded(this.props.topicReducer, topicState)) {
            // console.log('componentWillReceiveProps nextProps', Object.values(topicState.data));
            let temp = Object.values(topicState.data);
            let parts = new Array();
            let playingIndex = -1;
            temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach((topic) => {
                if (topic.parentId === this.state.id) {
                    if (topic.progress.playing === true) {
                        playingIndex = parts.length;
                    }
                    parts.push(topic);
                }
            });
            console.log('parts', parts, 'playingIndex', playingIndex);
            if (parts.length > 0) {
                if (playingIndex < 0) {
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
            }
            else {
                console.log("END GAME");
            }
        }
        // console.log("nextProps.topicReducer xxxx ", nextProps.topicReducer, " ------------------ nextProps.gameState", nextProps.gameState);
        // TODO: check next topic 
        if (((_a = nextProps.gameState) === null || _a === void 0 ? void 0 : _a.isFinish) === true) {
            this.setState({
                showGame: nextProps.gameState.isFinish,
            });
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
    activeTopic(currentTopic, index) {
        let mapTopicProgress = {};
        this.state.topics.forEach((topic) => {
            if (topic.progress.playing === true) {
                topic.progress.playing = false;
                mapTopicProgress[topic.id] = topic.progress;
            }
        });
        currentTopic.progress.lock = false;
        currentTopic.progress.playing = true;
        mapTopicProgress[currentTopic.id] = currentTopic.progress;
        let listP = Object.values(mapTopicProgress);
        this.props.updateTopicsProgress(listP);
        this.setState({
            currentIndex: index,
            currentTopic: currentTopic,
            showGame: true
        });
    }
    componentDidUpdate() {
        // Check open next topic part
        let currentTopic = this.state.currentTopic;
        let topics = this.state.topics;
        // console.log("this.state.currentTopic", currentTopic && topics ? topics.length : null, currentTopic, 'getPercentComplete', currentTopic ? currentTopic.getPercentComplete() : null, 'current index', this.state.currentIndex);
        if (currentTopic && topics && topics.length > (this.state.currentIndex + 1)
            && currentTopic.getPercentComplete() >= Config.NEXT_PART_PROGRESS && topics[this.state.currentIndex + 1].progress.lock === true) {
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
        var _a, _b, _c, _d, _e;
        const { onContinue } = this.props;
        const currentTopic = this.state.currentTopic;
        let currentQuestionIndex = 0;
        let gameState = this.props.gameState;
        console.log("currentTopic", currentTopic);
        if (gameState) {
            let topicId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;
            if (!questionsX.has(topicId) || ((_b = questionsX.get(topicId)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                // console.log("gameState.questions topicId", topicId, 'questions', gameState.questions);
                questionsX.set(topicId, gameState.questions.map((item) => Object.assign({}, item)));
            }
            // console.log("SIZE ", questionsX.size);
            if (questionsX.size > 0) {
                // console.log("ngao ngao ngao");
                let currentQuestionId = (_d = (_c = gameState.currentQuestion) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : -1;
                // console.log("currentQuestionId ", currentQuestionId);
                if (currentQuestionId) {
                    let listQ = (_e = questionsX.get(topicId)) !== null && _e !== void 0 ? _e : new Array();
                    currentQuestionIndex = listQ ? listQ.findIndex((q) => q.id === currentQuestionId) : 0;
                }
            }
        }
        let congratulationTopic = (!!gameState.isFinish);
        // console.log("congratulationTopiccongratulationTopiccongratulationTopic", gameState);
        return (React.createElement(MainWidget, { className: (this.state.isMobile ? " mobile" : "") },
            React.createElement(Header, null),
            React.createElement(FixedContainer, { className: "study-game-panel" },
                !!this.state.showAlertName ?
                    React.createElement(CongratulationAlert, { topicName: this.state.showAlertName, onClose: () => this.setState({ showAlertName: '' }) })
                    : null,
                React.createElement(Grid, { container: true, direction: "row", spacing: this.state.isMobile ? 0 : 3 },
                    React.createElement(Grid, { item: true, xs: 12, sm: 12, md: 5, lg: 4, className: "left-panel", style: this.state.isMobile ? { display: (this.state.showGame ? 'none' : '') } : {} },
                        React.createElement(TopicInfoPanel, { topicId: currentTopic ? currentTopic.parentId : -1, appInfo: this.state.appInfo, isMobile: this.state.isMobile }),
                        React.createElement(TopicTreePanel, {
                            parentId: this.state.id, currentQuestionId: currentTopic ? currentTopic.id : null, onChangeTopic: (topic, index) => {
                                this.activeTopic(topic, index);
                                this.setState({
                                    showGame: true
                                });
                            }, openAlert: (topic) => {
                                this.setState({
                                    showAlertName: topic.name
                                });
                            }
                        })),
                    React.createElement(Grid, { item: true, xs: 12, sm: 12, md: 7, lg: 8, className: "right-panel", style: this.state.isMobile ? { display: (this.state.showGame ? '' : 'none') } : {} },
                        this.state.isMobile && this.state.showGame ?
                            React.createElement(Grid, { style: { borderBottom: '1px solid #ddd' }, container: true, alignItems: "center" },
                                React.createElement(IconButton, {
                                    onClick: () => {
                                        this.setState({
                                            showGame: false
                                        });
                                    }
                                },
                                    React.createElement(ArrowBackIcon, null)),
                                React.createElement("span", null, currentTopic ? currentTopic.name : '')) : '',
                        this.renderRightContentPanel(currentTopic, currentQuestionIndex, congratulationTopic, this.state.appInfo),
                        React.createElement(Grid, { container: true, alignItems: "center", justify: "center" },
                            React.createElement(Button, {
                                variant: "contained", color: "primary", className: "next-part-button", onClick: () => {
                                    // console.log("XXXX congratulationTopic ", congratulationTopic);
                                    if (congratulationTopic) {
                                        this.onNextPart();
                                    }
                                    else {
                                        onContinue();
                                    }
                                }
                            },
                                congratulationTopic ? 'Next part' : 'Next Question',
                                "    ",
                                React.createElement(ArrowRightAltIcon, null)))))),
            !this.state.isMobile || !this.state.showGame ? React.createElement(FloatingButtonTest, { currentTopic: this.state.currentTopic }) : '',
            React.createElement(Footer, null),
            React.createElement(ShowImage, null)));
    }
    onNextPart() {
        // let gameState: GameState = this.props.gameState;
        // if(gameState && gameState.isFinish === true){
        // console.log("finish currentIndex", this.state.currentIndex, 'topics', this.state.topics);
        let newIndex = this.state.currentIndex + 1;
        if (newIndex < this.state.topics.length) {
            let currentTopic = this.state.topics[newIndex];
            this.activeTopic(currentTopic, newIndex);
        }
        else {
            console.log("END GAME");
        }
        // }
    }
    renderRightContentPanel(currentTopic, currentQuestionIndex, congratulationTopic, appInfo) {
        // console.log("renderRightContentPanel", currentTopic ? currentTopic.getPercentComplete() : null);
        return (React.createElement("div", null,
            React.createElement("div", { style: congratulationTopic ? { display: 'none' } : {} },
                React.createElement(QuestionProgressPanel, { topic: currentTopic }),
                currentTopic ?
                    React.createElement(QuestionsPanelTS, { appInfo: appInfo, className: "question-view-study-game", topicId: currentTopic.id, gameType: Config.STUDY_GAME, currentIndex: currentQuestionIndex }) : React.createElement(LoadingWidget, null)),
            React.createElement("div", { className: "topic-congratulations-panel", style: congratulationTopic ? {} : { display: 'none' } },
                React.createElement("h1", null, "Congratulations!"),
                React.createElement("p", null,
                    "You have passed ",
                    currentTopic ? currentTopic.name : '',
                    " with excellent performance"),
                React.createElement("div", null))));
    }
}
const CongratulationAlert = ({ topicName = "", onClose = () => { } }) => {
    useEffect(() => {
        let time = setTimeout(() => {
            onClose();
        }, 5000);
        return () => {
            clearTimeout(time);
        };
    }, [topicName]);
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "space-between", className: "congratulation-alert-panel" },
        React.createElement("div", null),
        React.createElement("div", { className: "title" },
            React.createElement(UnLockIcon, { width: "100px", fontSize: "large" }),
            React.createElement("span", null,
                "You must complete previous topic ",
                React.createElement("strong", null, topicName),
                "!")),
        React.createElement(IconButton, { onClick: () => onClose() },
            React.createElement(CloseIcon, null))));
};
const FloatingButtonTest = ({ currentTopic }) => {
    let history = useHistory();
    if (!currentTopic) {
        return null;
    }
    let name = stringReplaceUrl(currentTopic.name);
    return (React.createElement(Fab, {
        color: "secondary", variant: "extended", className: "floating-button-test", onClick: () => {
            // history.push(id > -1 ? Routes.TEST_SCREEN + "?appId="+getAppId()+"&id=" + id : Routes.TEST_SCREEN);
            history.push(Routes.TEST_SCREEN + '-' + name + '-' + currentTopic.id);
        }
    },
        React.createElement(AssignmentIcon, null),
        " Test"));
};
const QuestionProgressPanelUI = (props) => {
    var _a, _b, _c;
    // const theme = useTheme();
    // console.log("QuestionProgressPanelUI props", props, 'theme', theme);
    let topic = props === null || props === void 0 ? void 0 : props.topic;
    let gameState = props === null || props === void 0 ? void 0 : props.gameState;
    console.log("topic", topic, 'gameState', gameState);
    if (!gameState || !(gameState === null || gameState === void 0 ? void 0 : gameState.isLoaded)) {
        return React.createElement(LoadingWidget, null);
    }
    let topicId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;
    let currentQuestion = (_b = gameState.currentQuestion) !== null && _b !== void 0 ? _b : new Question();
    let listQuestion = (_c = questionsX.get(topicId)) !== null && _c !== void 0 ? _c : new Array();
    let loading = gameState.isLoading == 1 || gameState.isLoading == 2;
    return (React.createElement("div", { className: "question-progress-panel" },
        React.createElement("div", { className: "topic-name" },
            React.createElement(ViewListIcon, null),
            " ",
            React.createElement("span", null, topic ? topic.name : 'Topic name')),
        React.createElement("div", { className: "scroll-panel function-scroll-panel" },
            React.createElement("div", { className: "list-question-panel" }, loading ? React.createElement(LoadingWidget, null) :
                (listQuestion.map((item, index) => {
                    return React.createElement(QuestionItemProgress, { index: index, key: 'question-item-right-' + item.id, question: item, currentQuestion: currentQuestion });
                }))))));
};
const QuestionItemProgress = ({ index, question, currentQuestion }) => {
    if (question.id === currentQuestion.id && currentQuestion.questionStatus !== Config.QUESTION_NOT_ANSWERED) {
        question.questionStatus = currentQuestion.questionStatus;
        question.progress.boxNum = currentQuestion.progress.boxNum;
    }
    let progress = question.progress;
    let statusStr = '';
    let borderCurrent = "";
    if (question.id === currentQuestion.id) {
        borderCurrent = " border-current-question";
    }
    if (question.questionStatus === Config.QUESTION_ANSWERED_CORRECT) {
        statusStr = ' correct';
    }
    else if (question.questionStatus === Config.QUESTION_ANSWERED_INCORRECT) {
        statusStr = ' incorrect';
    }
    let icon;
    if (progress.boxNum === 1) {
        icon = React.createElement(DoneIcon, { className: "icon" });
    }
    else if (progress.boxNum > 1) {
        icon = React.createElement(DoneAllIcon, { className: "icon" });
    }
    useEffect(() => {
        if (question.id === currentQuestion.id) {
            onScrollHoz('function-scroll-panel', index);
        }
    }, [question, currentQuestion]);
    return (React.createElement("div", { className: "question-item" + statusStr + borderCurrent },
        React.createElement("span", null, index + 1),
        icon));
};
export function onScrollHoz(parentClass, index) {
    let parentsElement = document.getElementsByClassName(parentClass);
    let scrollLeft = index * 60;
    console.log('onScrollHoz ', scrollLeft, parentsElement.length);
    for (let index = 0; index < parentsElement.length; index++) {
        let parentElement = parentsElement[index];
        parentElement.scrollTo({ left: scrollLeft });
    }
}
const TopicInfoPanelUI = ({ topicId = -1, getTopicById, topicState, appInfo, isMobile }) => {
    useEffect(() => {
        getTopicById(topicId);
    }, [topicId]);
    let history = useHistory();
    if (topicState.loading === true || !topicState.data || isObjEmpty(topicState.data)) {
        return React.createElement(LoadingWidget, null);
    }
    let topic = topicState.data[topicId];
    if (!topic) {
        return React.createElement("div", null);
    }
    if (isMobile) {
        return (React.createElement(Grid, { container: true, alignItems: "center" },
            React.createElement(IconButton, {
                onClick: () => {
                    history.push("/" + appInfo.appNameId);
                }
            },
                React.createElement(ArrowBackIcon, null)),
            React.createElement("span", null, topic.name)));
    }
    return (React.createElement("div", { className: "topic-info-panel" }, topic.name));
};
const TopicTreePanelUI = ({ topicState, parentId, currentQuestionId, onChangeTopic, resetTopicProgress, openAlert }) => {
    const [dialogInfo, setDialogInfo] = useState(DialogInfo.init());
    // console.log("TopicTreePanelUI props", Object.assign({}, props));
    if (!topicState || topicState.loading === true || !topicState.data) {
        return React.createElement(LoadingWidget, null);
    }
    let topics = [];
    let temp = Object.values(topicState.data);
    temp.sort((a, b) => a.orderIndex - b.orderIndex).forEach((topic) => {
        if (parentId === topic.parentId) {
            topics.push(topic);
        }
    });
    let widgets = [], childs = [];
    let count = 0;
    let totalQuestion = 0, familiar = 0, mastered = 0;
    let lastTopicUnLock = 0;
    console.log("topics", topics);
    // let mapTopicProgress: any = topicProgressReducer.data;
    topics.forEach((topic, index) => {
        let progress = topic.progress;
        if (progress.lock === false) {
            lastTopicUnLock = index;
        }
        familiar += progress.familiar;
        mastered += progress.mastered;
    });
    const onClickTopic = (topic, index, type) => {
        console.log("onClickTopic topic ", topic, 'type', type);
        if (type === 1) { // completed
            setDialogInfo(new DialogInfo({
                title: 'Play again', msg: 'Do you want to reset all progress of this part!', okText: '', cancelText: '', onConfirm: (result) => {
                    if (result) {
                        //TODO: reset topic
                        topic.progress.reset();
                        resetTopicProgress(topic.progress);
                        onChangeTopic(topic, index);
                    }
                }
            }));
        }
        else if (type === 2) { // locked
            // setDialogInfo(new DialogInfo({ title:'Notice', msg: 'Completed previous topic!', okText: ''}));
            openAlert(topic);
        }
        else if (type === 3) { // click topic
            onChangeTopic(topic, index);
        }
    };
    topics.forEach((topic, index) => {
        totalQuestion += topic.totalQuestion;
        let active = currentQuestionId === topic.id;
        if (count % 2 === 0) {
            childs.push(React.createElement(TopicItem, { topic: topic, key: 'topic-item-' + parentId + '-' + topic.id, index: index, active: active, onClickTopic: onClickTopic }));
            if (childs.length === 3) {
                count++;
                childs.splice(1, 0, React.createElement("div", { key: "topic-row-1-l-r-" + parentId + '-' + topic.id, className: "topic-line topic-row-1-l-r" + (lastTopicUnLock < index ? " active" : "") }));
                childs.splice(3, 0, React.createElement("div", { key: "topic-row-2-l-r-" + parentId + '-' + topic.id, className: "topic-line topic-row-2-l-r" }));
                childs.push(React.createElement("div", { key: "topic-row-3-l-r-c-" + parentId + '-' + topic.id, className: "topic-line topic-row-3-l-r-c" }));
                let row = React.createElement("div", { className: "parent-topics-row", key: 'topic-row-' + parentId + '-' + count + '-' + topic.id },
                    React.createElement("div", { className: "topics-row" }, [...childs]));
                widgets.push(row);
                childs = [];
            }
        }
        else {
            childs.unshift(React.createElement(TopicItem, { topic: topic, key: 'topic-item-' + parentId + '-' + topic.id, active: active, onClickTopic: onClickTopic }));
            if (childs.length === 2) {
                count++;
                childs.splice(1, 0, React.createElement("div", { key: "topic-row-1-r-l-" + parentId + '-' + topic.id, className: "topic-line topic-row-1-r-l" }));
                childs.unshift(React.createElement("div", { key: "topic-row-2-r-l-" + parentId + '-' + topic.id, className: "topic-line topic-row-2-r-l-c" }));
                let row = React.createElement("div", { className: "parent-topics-row", key: 'topic-row-' + parentId + '-' + count + '-' + topic.id },
                    React.createElement("div", { className: "topics-row" }, [...childs]));
                widgets.push(row);
                childs = [];
            }
        }
    });
    if (childs.length > 0) {
        if (count % 2 === 0) {
            let row = React.createElement("div", { className: "parent-topics-row", key: 'topic-row-' + parentId + '-' + count },
                React.createElement("div", { className: "topics-row" }, [...childs]));
            widgets.push(row);
        }
        else {
            let row = React.createElement("div", { className: "parent-topics-row", key: 'topic-row-' + parentId + '-' + count },
                React.createElement("div", { className: "topics-row" }, [...childs]));
            widgets.push(row);
        }
    }
    return (React.createElement("div", { className: "parent-topic-tree-panel" },
        dialogInfo ? React.createElement(AlertDialogSlide, { dialogInfo: dialogInfo }) : '',
        React.createElement(Grid, { container: true, direction: "row", alignItems: "center", justify: "space-around", className: "question-result-info" },
            React.createElement("div", { className: "item" },
                React.createElement("label", null, "Not seen"),
                React.createElement("div", null, totalQuestion - familiar - mastered)),
            React.createElement("div", { className: "item-line" }),
            React.createElement("div", { className: "item" },
                React.createElement("label", null, "Familiar"),
                React.createElement("div", null,
                    familiar,
                    " ",
                    React.createElement(DoneIcon, null))),
            React.createElement("div", { className: "item-line" }),
            React.createElement("div", { className: "item" },
                React.createElement("label", null, "Mastered"),
                React.createElement("div", null,
                    mastered,
                    " ",
                    React.createElement(DoneAllIcon, null)))),
        React.createElement("div", { className: "box-topic-tree-panel" },
            React.createElement("div", { className: "topic-tree-panel" }, widgets))));
};
const TopicItem = ({ topic, active = false, index = 0, onClickTopic }) => {
    let progress = topic.progress;
    // console.log("TopicItem topic", topic.getPercentComplete());
    if (topic.getPercentComplete() === 100) {
        return (React.createElement("div", { className: "topic-item completed" + (active ? ' active' : ''), onClick: () => onClickTopic(topic, index, 1) },
            React.createElement("div", { className: "lds-ripple" },
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", null)),
            React.createElement("div", { className: "topic-content" },
                React.createElement(CheckIcon, null)),
            React.createElement("div", { className: "topic-name", "data-id": topic.id, "data-index": topic.orderIndex }, topic.name)));
    }
    if (progress.lock === true) {
        return (React.createElement(Tooltip, { title: "Completed previous topic!" },
            React.createElement("div", { className: "topic-item locked", onClick: () => onClickTopic(topic, index, 2) },
                React.createElement("div", { className: "topic-content" },
                    React.createElement(LockIcon, null)),
                React.createElement("div", { className: "topic-name", "data-id": topic.id, "data-index": topic.orderIndex }, topic.name))));
    }
    return (React.createElement("div", { className: "topic-item" + (active ? ' active' : ''), onClick: () => onClickTopic(topic, index, 3) },
        React.createElement("div", { className: "lds-ripple" },
            React.createElement("div", null),
            React.createElement("div", null),
            React.createElement("div", null)),
        React.createElement("div", { className: "topic-content" },
            topic.getPercentComplete(),
            "%"),
        React.createElement("div", { className: "topic-name", "data-id": topic.id, "data-index": topic.orderIndex }, topic.name)));
};
const mapStateToProps = (state, ownProps) => {
    return Object.assign({ topicReducer: state.topicReducer, cardReducer: state.cardReducer, gameState: state.gameState, appValueState: state.appValueState }, ownProps);
};
const mapDispatchToProps = (dispatch) => ({
    getCardsByParentId: (parentId) => dispatch(getCardsByParentId(parentId)),
    onContinue: () => dispatch(onContinue()),
    getTopicsByParentId: (parentId) => dispatch(getTopicsByParentId(parentId)),
    updateTopicsProgress: (topicsProgress) => dispatch(updateTopicsProgress(topicsProgress)),
});
const mapDispatchTopicTreeToProps = (dispatch) => ({
    resetTopicProgress: (topicProgress) => dispatch(resetTopicProgress(topicProgress))
});
const TopicTreePanel = connect((state, ownProps) => {
    // console.log("LOL", Object.assign({}, state));
    return Object.assign({ topicState: state.topicReducer, gameState: state.gameState, topicProgressReducer: state.topicProgressReducer }, ownProps);
}, mapDispatchTopicTreeToProps)(TopicTreePanelUI); // TODO: add action
const QuestionProgressPanel = connect((state, ownProps) => {
    return Object.assign({ gameState: state.gameState }, ownProps);
}, null)(QuestionProgressPanelUI); // TODO: add action
const TopicInfoPanel = connect((state, ownProps) => {
    return Object.assign({ topicState: state.topicReducer }, ownProps);
}, (dispatch) => ({
    getTopicById: (topicId) => dispatch(getTopicById(topicId))
}))(TopicInfoPanelUI); // TODO: add action
const StudyView = connect(mapStateToProps, mapDispatchToProps)(StudyViewScreenUI);
const mapStateToPropsMain = (state, ownProps) => {
    return Object.assign({ appInfoState: state.appInfoState }, ownProps);
};
const mapDispatchToPropsMain = (dispatch) => ({
    getAppInfo: (appNameId) => dispatch(getAppInfo(appNameId))
});
export default connect(mapStateToPropsMain, mapDispatchToPropsMain)(StudyViewScreen);
