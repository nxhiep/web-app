import { Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { FunctionComponent } from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import Config from '../../config';
import Progress from '../../models/Progress';
import TestSetting from '../../models/TestSetting';
import { startNewExamTest } from '../../redux/actions';
import { AppState } from '../../redux/appstate';
import { GameState } from '../../redux/reducers/game';
import '../../resources/scss/test.scss';

const EndTestView: FunctionComponent<({
    testSetting: TestSetting,
    startNewTest: any,
    gameState: GameState
    })> = ({
    testSetting, 
    startNewTest,
    gameState
    })  => {
    let examId: number = gameState.id ?? -1;
    let gameType: number = gameState.gameType ?? Config.TEST_GAME;
    let gameStatus: number = gameState.status ?? Config.GAME_STATUS_TESTING;
    let progress: Progress = gameState.progress;
    // console.log("End test gameState ", gameState, examId);
    let testFailed: boolean = gameStatus == Config.GAME_STATUS_FAILED;
    let data: Array<number> = [];
    if(testFailed){
        data = [progress.correct, progress.mistake];
    } else {
        data = [progress.correct, progress.mistake];
    }

    return (
        <div className={"end-test-view" + (testFailed ? " test-failed" : " test-passed")}>
            <Grid container justify="space-between" className="title">
                <Button
                onClick={() => startNewTest({
                    examId,
                    gameType,
                    setting: TestSetting.fromJS(testSetting)
                })}
                >
                    <ArrowBackIcon style={{color: 'white'}} />
                </Button>
                <div>{testFailed ? "Your have failed!" : "You have passed!"}</div>
                <div style={{width: '50px'}}></div>
            </Grid>
            <div className="chart-panel">
                <PieChart data={data} labels={['Correct', 'Mistake']} />
            </div>
            <div className="description">
                <div className="content">
                    {!testFailed ? "Congratulations! You have passed this test, you need to pass this test as least 5 times to get ready for your real test."
                            : "You incorrectly answered the number of sentences allowed, please learn more to pass the test."}
                </div>
            </div>
            <Grid container>
                <Button 
                variant="contained" 
                color="primary" 
                className="try-again-test-button"
                onClick={() => startNewTest({
                    examId,
                    gameType,
                    setting: TestSetting.fromJS(testSetting)
                })}
                >Try Again</Button>
            </Grid>
        </div>
    );
}
const PieChart: FunctionComponent<({ data: Array<number>, labels: Array<string>, colors?: Array<string> })> = 
    ({ data = [1, 2], labels = ['One', "Two"], colors = ['green', 'red'] }) => {
    return <Pie 
            data={{
                datasets: [{
                    backgroundColor: colors,
                    data: data
                }],
                labels: labels,
            }}
            options={{
                legend: {
                    position: "bottom"
                }
            }}
    />
}

const mapStateToProps = (state: AppState, ownProps: any) => ({
    testSetting: state.testSettingState.currentSetting,
    gameState: state.gameState,
    ...ownProps
})
const mapDispatchToProps = {
    startNewTest: (x: any) => startNewExamTest(x)
}
export default connect(mapStateToProps, mapDispatchToProps)(EndTestView);
// export default EndTestView;