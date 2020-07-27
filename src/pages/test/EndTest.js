import { Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import Config from '../../config';
import TestSetting from '../../models/TestSetting';
import { startNewExamTest } from '../../redux/actions';
import '../../resources/scss/test.scss';
const EndTestView = ({ testSetting, startNewTest, gameState }) => {
    var _a, _b, _c;
    let examId = (_a = gameState.id) !== null && _a !== void 0 ? _a : -1;
    let gameType = (_b = gameState.gameType) !== null && _b !== void 0 ? _b : Config.TEST_GAME;
    let gameStatus = (_c = gameState.status) !== null && _c !== void 0 ? _c : Config.GAME_STATUS_TESTING;
    let progress = gameState.progress;
    // console.log("End test gameState ", gameState, examId);
    let testFailed = gameStatus == Config.GAME_STATUS_FAILED;
    let data = [];
    if (testFailed) {
        data = [progress.correct, progress.mistake];
    }
    else {
        data = [progress.correct, progress.mistake];
    }
    return (React.createElement("div", { className: "end-test-view" + (testFailed ? " test-failed" : " test-passed") },
        React.createElement(Grid, { container: true, justify: "space-between", className: "title" },
            React.createElement(Button, { onClick: () => startNewTest({
                    examId,
                    gameType,
                    setting: TestSetting.fromJS(testSetting)
                }) },
                React.createElement(ArrowBackIcon, { style: { color: 'white' } })),
            React.createElement("div", null, testFailed ? "Your have failed!" : "You have passed!"),
            React.createElement("div", { style: { width: '50px' } })),
        React.createElement("div", { className: "chart-panel" },
            React.createElement(PieChart, { data: data, labels: ['Correct', 'Mistake'] })),
        React.createElement("div", { className: "description" },
            React.createElement("div", { className: "content" }, !testFailed ? "Congratulations! You have passed this test, you need to pass this test as least 5 times to get ready for your real test."
                : "You incorrectly answered the number of sentences allowed, please learn more to pass the test.")),
        React.createElement(Grid, { container: true },
            React.createElement(Button, { variant: "contained", color: "primary", className: "try-again-test-button", onClick: () => startNewTest({
                    examId,
                    gameType,
                    setting: TestSetting.fromJS(testSetting)
                }) }, "Try Again"))));
};
const PieChart = ({ data = [1, 2], labels = ['One', "Two"], colors = ['green', 'red'] }) => {
    return React.createElement(Pie, { data: {
            datasets: [{
                    backgroundColor: colors,
                    data: data
                }],
            labels: labels,
        }, options: {
            legend: {
                position: "bottom"
            }
        } });
};
const mapStateToProps = (state, ownProps) => (Object.assign({ testSetting: state.testSettingState.currentSetting, gameState: state.gameState }, ownProps));
const mapDispatchToProps = {
    startNewTest: (x) => startNewExamTest(x)
};
export default connect(mapStateToProps, mapDispatchToProps)(EndTestView);
// export default EndTestView;
