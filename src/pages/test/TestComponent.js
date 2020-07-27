import { Collapse, Grid, Button } from '@material-ui/core';
import { Favorite as HeartIcon, FavoriteBorder as UnHeartIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import QuestionContentPanel, { TextContentType } from '../../components/QuestionContentPanel';
import { LoadingWidget } from '../../components/Widgets';
import Config from '../../config';
import Choice from '../../models/Choice';
import Question from '../../models/QuestionX';
import { onBookmark } from '../../redux/actions';
import { loadGame, onSelectedChoice } from '../../redux/actions/game';
import { GameState } from '../../redux/reducers/game';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
var arrayIndex = new Array();
const TestQuestionPanelUI = ({ initial = 0, questionProgress = {}, className = "", loadGame = () => {
    // console.log("vkl");
}, gameType = Config.TEST_GAME, gameState = GameState.init(), appId, topicId, index = 0, onBookmark, testSetting }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTEST GAME GameState ", gameState, 'testSetting', testSetting);
    useEffect(() => {
        // console.log("FIRST LOAD", appId, topicId, gameType, loadGame);
        loadGame({ appId: appId, topicId: topicId, gameType: gameType, setting: testSetting });
    }, [loadGame, appId, topicId, gameType, testSetting]);
    let currentQuestion = gameState.currentQuestion;
    if (!questionProgress) {
        questionProgress = {};
    }
    let loading = gameState.isLoading == 1 || gameState.isLoading == 2;
    if (!currentQuestion || loading) {
        return React.createElement(LoadingWidget, { color: null });
    }
    let questions = [currentQuestion];
    // console.log("TEST game state ", gameState);
    if (gameState.isFinish) {
        questions = gameState.questions.sort((a, b) => a.index - b.index);
    }
    if (questions.length === 0) {
        return (React.createElement("div", null, "Empty!"));
    }
    if (gameState.questions.length > 0 && arrayIndex.length == 0) {
        for (let i = 0; i < gameState.questions.length; i++) {
            arrayIndex.concat(i);
            index = i;
        }
    }
    return (React.createElement("div", { className: "questions-panel" + (className ? " " + className : "") + (gameState.isFinish ? " end-game" : ""), style: gameState.isFinish && !isMobile ? { maxHeight: 500 } : {} }, questions.map((question) => {
        if (questionProgress[question.id]) {
            question.progress = questionProgress[question.id];
        }
        // if (!question.progress) {
        //     question.progress = {};
        // }
        return React.createElement(QuestionItem, { question: question, key: 'question-item-' + question.id, index: question.index, onBookmark: onBookmark });
    })));
};
const QuestionItem = ({ question = new Question(), index = 0, onBookmark }) => {
    // question.answers.forEach(element => {
    //     mapAnswerResult[element] = true;
    // });
    const listAnswer = question.choices;
    const [openCollapse, setOpenCollapse] = useState(false);
    useEffect(() => {
        setOpenCollapse(false);
    }, [question]);
    return (React.createElement("div", { className: "question-item-panel" },
        React.createElement(Grid, { container: true, direction: "row", alignItems: "center", className: "question-header-panel" },
            React.createElement("span", { className: "q-title" },
                "Question ",
                index + 1,
                ":"),
            React.createElement("span", { style: { 'marginLeft': 'auto' }, onClick: () => {
                    onBookmark(question);
                } }, question.progress.bookmark ? React.createElement(HeartIcon, { style: { 'color': '#aaa' } }) : React.createElement(UnHeartIcon, { style: { 'color': '#aaa' } }))),
        React.createElement("div", { className: "question-content" },
            React.createElement(QuestionContentPanel, { content: question.question, image: question.image, type: TextContentType.question })),
        question.paragraphId && question.paragraphId > -1 && question.paragraphContent ?
            React.createElement("div", { className: "question-paragraph" },
                React.createElement(Button, { style: { marginBottom: "10px" }, variant: "outlined", color: "primary", onClick: () => {
                        setOpenCollapse(!openCollapse);
                    } }, openCollapse ? "Hidden" : "Read more"),
                React.createElement(Collapse, { style: { color: '#555', paddingBottom: "10px" }, in: openCollapse },
                    React.createElement(QuestionContentPanel, { content: question.paragraphContent, type: TextContentType.explanation }))) : '',
        React.createElement(ChoicesPanel, { listAnswer: listAnswer, questionId: question.id, questionStatus: question.questionStatus, explanation: question.explanation })));
};
const ChoicesPanelUI = ({ questionId = -1, listAnswer = [], questionStatus = 0, explanation = "", testSettingState, isFinish = false, }) => {
    let testSetting = testSettingState === null || testSettingState === void 0 ? void 0 : testSettingState.currentSetting;
    let showResult = isFinish
        || (!(questionStatus === Config.QUESTION_NOT_ANSWERED) && testSetting && testSetting.instanceFeedback);
    // console.log("ChoicesPanel XXXXXXXXXXXx showResult", showResult, 'testSetting instanceFeedback', testSetting.instanceFeedback, 'listAnswer', listAnswer);
    return (React.createElement("div", { className: "choices-panel" }, listAnswer.map((choice, index) => {
        return React.createElement(AnswerButton, { index: index, key: 'answer-item-' + questionId + '-' + index, showResult: showResult, explanation: explanation, choice: Object.assign({}, choice) });
    })));
};
const AnswerButtonUI = ({ index = 0, showResult = false, choice = new Choice(), explanation = "", onChoiceSelected = () => {
} }) => {
    // console.log("55555555555555", choice);
    // useEffect(() => {
    //     console.log("choice ccccccc ", choice);
    // }, [choice])
    let showCss = "";
    if (showResult) {
        if (choice.selected) {
            showCss = (choice.isCorrect ? " correct" : " wrong");
        }
        else {
            showCss = (choice.isCorrect ? " correct" : "");
        }
    }
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&", showResult, choice.isCorrect, 111, choice.selected);
    return (React.createElement("button", { className: "answer-button" + (!showResult && choice.selected ? " selected" : "") + showCss + (Config.TEST_MODE && choice.isCorrect ? " test-true" : ""), onClick: () => {
            if (showResult) {
                return;
            }
            onChoiceSelected(choice);
        } },
        React.createElement("div", { className: "answered-content" },
            React.createElement("div", { className: 'answer-button-title' }, String.fromCharCode(65 + index)),
            React.createElement("div", { className: 'answer-button-content' },
                React.createElement(QuestionContentPanel, { content: choice.content, type: TextContentType.answer }))),
        React.createElement(Collapse, { className: "explanation", in: (!!showResult && !!choice.isCorrect) },
            React.createElement("p", null, "Explanation:"),
            React.createElement("div", null,
                React.createElement(QuestionContentPanel, { content: explanation, type: TextContentType.explanation })))));
};
const TestProgressPanelUI = ({ gameState }) => {
    let progress = gameState.progress;
    let size = (progress.done / progress.total) * 100;
    let loading = gameState.isLoading == 1 || gameState.isLoading == 2;
    if (loading) {
        return React.createElement(LoadingWidget, { color: null });
    }
    return (React.createElement("div", { className: "test-progress-panel" },
        React.createElement("div", { className: "progress-panel" },
            React.createElement("div", { className: "content-line-progress", style: { left: 'calc(' + size + '% - 25px)' } },
                progress.done,
                " / ",
                progress.total),
            React.createElement("div", { style: { visibility: 'hidden' } }, "X"),
            React.createElement("div", { className: "parent-content-panel" },
                React.createElement("div", { className: "content-progress", style: { width: size + '%' } }),
                React.createElement("div", { style: { visibility: 'hidden' } }, "X")))));
};
const mapTestSettingStateToProps = (state) => {
    // console.log("mapTestSettingStateToProps ", Object.assign({}, state.gameState));
    return {
        testSettingState: state.testSettingState,
        isFinish: state.gameState.isFinish
    };
};
// const mapTestSettingStateToProps = (state: AppState) => ({
//     testSettingState: state.testSettingState,
//     isFinish: state.gameState.isFinish
// })
const mapStateToProps = (state, ownProps) => (Object.assign({ gameState: state.gameState, cardProgressReducer: state.cardProgressReducer }, ownProps
// user: state.user
));
const mapDispatchToProps = {
    loadGame: (params) => loadGame(params),
    onChoiceSelected: (choice) => onSelectedChoice(choice),
    onBookmark: (question) => onBookmark(question)
};
const AnswerButton = connect(null, mapDispatchToProps)(AnswerButtonUI);
const TestQuestionPanel = connect(mapStateToProps, mapDispatchToProps)(TestQuestionPanelUI);
const ChoicesPanel = connect(mapTestSettingStateToProps, null)(ChoicesPanelUI);
const TestProgressPanel = connect(mapStateToProps, null)(TestProgressPanelUI);
export { TestQuestionPanel, TestProgressPanel };
