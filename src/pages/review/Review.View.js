import { Grid, IconButton } from '@material-ui/core';
import {  withTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShowImage } from '../../components/Dialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Image from '../../components/Image';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import Config from '../../config';
import ReviewProgress from '../../models/ReviewProgress';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo } from '../../redux/actions';
import { getAllCardProgress } from '../../redux/actions/cardProgress';
import '../../resources/scss/game.scss';
import '../../resources/scss/main.scss';
import '../../resources/scss/review.scss';
import { checkLoadedReceiveProps } from '../../utils';
import { QuestionsPanelTS } from '../game/Game.ViewTS';
import ReactGA from 'react-ga';
const ReviewViewScreen = ({ getAppInfo, appInfoState , theme}) => {
    let { appNameId, screen } = useParams();
    let topicId = -1;
    if (screen) {
        let offset = screen.lastIndexOf('-') + 1;
        topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    }
    appNameId = appNameId !== null && appNameId !== void 0 ? appNameId : '';
    // const theme = useTheme();
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
                title: appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.icon
            });
            ReactGA.pageview('/reviewpage/' + appInfo.title);
        }
    }, [appInfo]);
    if (!appInfo) {
        return React.createElement(LoadingWidget, null);
    }
    return (React.createElement(ReviewView, { appInfo: appInfo, topicId: topicId, isMobile: isMobile }));
};
class ReviewViewScreenUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appInfo: props.appInfo,
            levelId: -1,
            questionIds: null,
            showReview: false,
            isMobile: props.isMobile
        };
    }
    componentDidMount() {
        this.props.getAllCardProgress();
    }
    componentWillReceiveProps(nextProps) {
        if (!checkLoadedReceiveProps(this.props.cardProgressReducer, nextProps.cardProgressReducer)) {
            let reviewProgress = getReviewProgress(this.props.cardProgressReducer);
            if (this.state.levelId == -1) {
                let levelIdSelected = reviewProgress.getCurrentSelectedId();
                this.setState({
                    levelId: levelIdSelected,
                    questionIds: reviewProgress.getQuestionsIdsByLevelId(levelIdSelected)
                });
            }
        }
    }
    render() {
        let reviewProgress = getReviewProgress(this.props.cardProgressReducer);
        if (!reviewProgress) {
            return React.createElement(LoadingWidget, { color: null });
        }
        let levelIdSelected = -1;
        let questionIds = new Array();
        if (this.state.levelId == -1) {
            levelIdSelected = reviewProgress.getCurrentSelectedId();
            questionIds = reviewProgress.getQuestionsIdsByLevelId(levelIdSelected);
            // this.state.levelId = levelIdSelected;
            // this.state.questionIds = questionIds;
            // this.setState({
            //     levelId: levelIdSelected,
            //     questionIds: questionIds
            // })
        }
        else {
            levelIdSelected = this.state.levelId;
            questionIds = this.state.questionIds;
        }
        console.log("levelSelected ", levelIdSelected, 'questionIds', questionIds);
        return (React.createElement(MainWidget, { className: 'review-page' },
            React.createElement(Header, null),
            React.createElement(FixedContainer, { className: 'review-page-content' + (this.state.isMobile && this.state.showReview ? ' show-review' : '') },
                React.createElement(Grid, { container: true, direction: "row", spacing: this.state.isMobile ? 0 : 3 },
                    React.createElement(Grid, { className: "left-panel", item: true, xs: 12, sm: 12, md: 4, style: this.state.isMobile ? { display: this.state.showReview ? 'none' : 'block' } : {} },
                        React.createElement(LevelQuestionPanel, { activeId: levelIdSelected, gameProgress: reviewProgress, onSelected: (item) => {
                                this.setState({
                                    levelId: item.id,
                                    questionIds: reviewProgress.getQuestionsIdsByLevelId(item.id),
                                    showReview: true
                                });
                            } })),
                    React.createElement(Grid, { className: "right-panel", item: true, xs: 12, sm: 12, md: 8, style: this.state.isMobile ? { display: !this.state.showReview ? 'none' : 'block' } : {} },
                        this.state.isMobile && this.state.showReview ? React.createElement(Grid, { container: true, alignItems: "center" },
                            React.createElement(IconButton, { onClick: () => {
                                    this.setState({
                                        showReview: false
                                    });
                                } },
                                React.createElement(ArrowBackIcon, null)),
                            React.createElement("span", null, Config.LEVEL_QUESTION.map((item) => {
                                if (this.state.levelId === item.id) {
                                    return item.name;
                                }
                                return '';
                            }))) : '',
                        questionIds.length > 0 ? React.createElement(QuestionsPanelTS, { appInfo: this.state.appInfo, className: "question-view-study-game", examId: -1, gameType: Config.REVIEW_GAME, questionIds: questionIds }) : React.createElement("div", { className: "empty-question-panel" }, "Empty question!")
                    // <ReviewQuestionPanel questions={questions} questionProgress={questionProgress} />
                    ))),
            React.createElement(Footer, null),
            React.createElement(ShowImage, null)));
    }
}
const LevelQuestionPanelUI = (props) => {
    var _a;
    // const [gameProgress, setGameProgress] = useState(props?.gameProgress);
    // useEffect(() => {
    //     let gameProgress = new GameProgress(Object.values(props.cardProgressReducer.data));
    //     setGameProgress(gameProgress);
    //     console.log("LevelQuestionPanelUI props.cardProgressReducer", gameProgress);
    // }, [props.cardProgressReducer]);
    let gameProgress = props === null || props === void 0 ? void 0 : props.gameProgress;
    let onSelected = (_a = props.onSelected) !== null && _a !== void 0 ? _a : function () { console.error("onSelected null"); };
    // console.log("LevelQuestionPanel gameProgress", gameProgress);
    return (React.createElement("div", { className: "level-question-panel" }, Config.LEVEL_QUESTION.map((item) => {
        let totalQuestion = gameProgress ? gameProgress.getTotalQuestionByLevelId(item.id) : 0;
        return React.createElement(LevelQuestionItem, { active: props.activeId === item.id, item: item, totalQuestion: totalQuestion, key: 'level-question-item-' + item.id, onSelected: onSelected });
    })));
};
const LevelQuestionItem = ({ item, totalQuestion, active, onSelected }) => {
    totalQuestion = totalQuestion ? totalQuestion : 0;
    return (React.createElement("div", { className: "level-question-item" + (active ? " active" : ""), onClick: () => onSelected(item) },
        React.createElement(Grid, { container: true, direction: "row", alignItems: "center" },
            React.createElement("div", { style: { 'width': 'calc(100% - 40px)' } },
                React.createElement("label", null, item.name),
                React.createElement("div", { className: "question-num" },
                    totalQuestion,
                    " questions")),
            React.createElement("div", { style: { 'width': '40px' } },
                React.createElement(Image, { src: item.image, width: '25px', height: "25px" })))));
};
function getReviewProgress(cardProgressState) {
    if (cardProgressState && cardProgressState.data) {
        return new ReviewProgress(Object.values(cardProgressState.data));
    }
    return null;
}
const mapStateToProps = (state, ownProps) => {
    console.log("CHANGE CHANGE CHANGE ", Object.assign({}, state));
    return Object.assign({ cardReducer: state.cardReducer, cardProgressReducer: state.cardProgressReducer }, ownProps);
};
const mapDispatchToProps = (dispatch) => ({
    getAllCardProgress: () => dispatch(getAllCardProgress()),
});
const LevelQuestionPanel = connect(mapStateToProps, null)(LevelQuestionPanelUI);
const ReviewView = connect(mapStateToProps, mapDispatchToProps)(ReviewViewScreenUI);
const mapStateToPropsMain = (state, ownProps) => {
    return Object.assign({ appInfoState: state.appInfoState }, ownProps);
};
const mapDispatchToPropsMain = (dispatch) => ({
    getAppInfo: (appNameId) => dispatch(getAppInfo(appNameId))
});
export default connect(mapStateToPropsMain, mapDispatchToPropsMain)(withTheme(ReviewViewScreen));
