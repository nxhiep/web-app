import { Collapse, Grid, Button } from '@material-ui/core';
import { Clear as UnCheckIcon, Done as CheckIcon, Favorite as HeartIcon, FavoriteBorder as UnHeartIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import QuestionContentPanel, { TextContentType } from '../../components/QuestionContentPanel';
import { LoadingWidget } from '../../components/Widgets';
import Config from '../../config';
import QuestionProgress from '../../models/QuestionProgress';
import { onBookmark } from '../../redux/actions';
import { loadGame, onSelectedChoice } from '../../redux/actions/game';
const mapStateToProps = (state, ownProps) => (Object.assign({ gameState: state.gameState, cardProgressReducer: state.cardProgressReducer }, ownProps
// user: state.user
));
const mapDispatchToProps = {
    loadGame: (props) => loadGame(props),
    onBookmark: (question) => onBookmark(question),
};
const mapDispatchReviewQuestionToProps = {
    onBookmark: (question) => onBookmark(question)
};
const mapDispatchChoiceToProps = {
    onChoiceSelected: (choice) => onSelectedChoice(choice)
};
const ReviewQuestionPanelUI = ({ questions, questionProgress, onBookmark, appInfo }) => {
    if (!questionProgress) {
        questionProgress = new Map();
    }
    return (React.createElement("div", { className: 'questions-panel' }, questions.map((question, index) => {
        var _a;
        if (questionProgress.has(question.id)) {
            question.progress = (_a = questionProgress.get(question.id)) !== null && _a !== void 0 ? _a : new QuestionProgress();
        }
        return React.createElement(QuestionItemTS, { question: question, key: 'question-item-' + question.id, index: index, onBookmark: onBookmark });
    })));
};
const QuestionsPanelx = ({ questionProgress, className, topicId, loadGame, gameState, gameType, currentIndex, onBookmark, cardProgressReducer, questionIds, appInfo }) => {
    // console.log("QuestionsPanelx QuestionsPanelx QuestionsPanelx cards", Object.assign({}, questionIds));
    useEffect(() => {
        loadGame({ appId: appInfo.id, topicId: topicId, gameType: gameType, questionIds: questionIds });
    }, [loadGame, appInfo, topicId, gameType, questionIds]);
    console.log("************** ", gameState.isLoading);
    if (gameState.isLoading == 1 || gameState.isLoading == 2) {
        return React.createElement(LoadingWidget, { color: null });
    }
    if (gameType === Config.REVIEW_GAME) {
        let questions = gameState.questions;
        if (!questions) {
            return React.createElement(LoadingWidget, { color: null });
        }
        // console.log("RENDER OK ", questions);
        return (React.createElement("div", { className: "questions-panel" + (className ? " " + className : "") }, questions.map((question, index) => {
            return React.createElement(QuestionItemTS, { question: question, key: 'question-item-' + question.id, index: index, onBookmark: onBookmark });
        })));
    }
    let currentQuestion = gameState.currentQuestion;
    if (!questionProgress) {
        questionProgress = new Map();
    }
    // console.log("check check check ", gameState);
    if (!currentQuestion) {
        return React.createElement(LoadingWidget, { color: null });
    }
    if (!currentIndex) {
        currentIndex = 0;
    }
    let questions = [currentQuestion];
    return (React.createElement("div", { className: "questions-panel" + (className ? " " + className : "") }, questions.map((question, index) => {
        var _a;
        if (questionProgress.has(question.id)) {
            question.progress = (_a = questionProgress.get(question.id)) !== null && _a !== void 0 ? _a : new QuestionProgress();
        }
        return React.createElement(QuestionItemTS, { question: question, key: 'question-item-' + question.id, index: currentIndex, onBookmark: onBookmark });
    })));
};
const QuestionItemTS = ({ question, index, onBookmark }) => {
    // question.answers.forEach(element => {
    //     mapAnswerResult[element] = true;
    // });
    // console.log(111, question);
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
            React.createElement(ProgressQuestionTS, { progress: question.progress.progress, questionId: question.id }),
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
        question.correctNums > 1 ? React.createElement("div", { className: "select-multiple-question-title" },
            "Selected: ",
            question.getNumberChoiceSelected(),
            "/",
            question.correctNums) : null,
        React.createElement(ChoicesPanelTS, { listAnswer: listAnswer, questionId: question.id, questionStatus: question.questionStatus, explanation: question.explanation })));
};
const ChoicesPanelTS = ({ questionId, listAnswer, questionStatus, explanation }) => {
    return (React.createElement("div", { className: "choices-panel" }, listAnswer.map((choice, index) => {
        return React.createElement(AnswerButtonTS, { index: index, answer: choice.content, key: 'answer-item-' + questionId + '-' + index, showResult: (questionStatus === Config.QUESTION_NOT_ANSWERED) ? false : true, explanation: explanation, result: choice.isCorrect, selected: choice.selected, choice: choice });
    })));
};
const AnswerButton2 = ({ index, answer, explanation, result, selected, choice, onChoiceSelected, showResult }) => {
    let showCss = "";
    // console.log(")))))))))))))))) showResult", showResult, 'selected', selected, 'result', result);
    if (showResult) {
        if (selected) {
            showCss = (result ? " correct" : " wrong");
        }
        else {
            showCss = (result ? " correct" : "");
        }
    }
    return (React.createElement("button", { className: "answer-button" + (!showResult && selected ? " selected" : "") + showCss + (Config.TEST_MODE && result ? " test-true" : ""), onClick: () => {
            if (showResult) {
                return;
            }
            onChoiceSelected(choice);
        } },
        React.createElement("div", { className: "answered-content" },
            React.createElement("div", { className: 'answer-button-title' }, String.fromCharCode(65 + index)),
            React.createElement("div", { className: 'answer-button-content' },
                React.createElement(QuestionContentPanel, { content: answer, type: TextContentType.answer }))),
        React.createElement(Collapse, { className: "explanation", in: showResult && result },
            React.createElement("p", null, "Explanation:"),
            React.createElement(QuestionContentPanel, { content: explanation, type: TextContentType.explanation }))));
};
const ProgressQuestionTS = ({ progress, questionId }) => {
    if (!progress) {
        return React.createElement("div", null);
    }
    return (React.createElement("span", null, progress.map((item, index) => {
        return (React.createElement("span", { key: 'ProgressQuestion-item-' + questionId + '-' + index }, item === 1 ?
            React.createElement(CheckIcon, { style: { 'color': 'green', 'fontSize': '16px' } })
            : React.createElement(UnCheckIcon, { style: { 'color': 'red', 'fontSize': '16px' } })));
    })));
};
const AnswerButtonTS = connect(null, mapDispatchChoiceToProps)(AnswerButton2);
const QuestionsPanelTS = connect(mapStateToProps, mapDispatchToProps)(QuestionsPanelx);
const ReviewQuestionPanel = connect(null, mapDispatchReviewQuestionToProps)(ReviewQuestionPanelUI);
export { ReviewQuestionPanel, QuestionsPanelTS, QuestionItemTS, ChoicesPanelTS, AnswerButtonTS, ProgressQuestionTS };
