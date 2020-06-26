import { Button, Grid, IconButton } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { Component, FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShowImage } from '../../components/Dialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SelectStatePopup from '../../components/SelectStatePopup';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import Config from '../../config';
import AppInfo from '../../models/AppInfo';
import TestSetting from '../../models/TestSetting';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo } from '../../redux/actions';
import { onContinue, startNewExamTest } from '../../redux/actions/game';
import { AppState } from '../../redux/appstate';
import { AppInfoState } from '../../redux/reducers/appInfo';
import '../../resources/scss/main.scss';
import '../../resources/scss/test.scss';
import EndTestView from './EndTest';
import { TestProgressPanel, TestQuestionPanel } from './TestComponent';
import CustomTestView from './TestSettingView';
import ReactGA from 'react-ga';

const TestViewScreen: FunctionComponent<({ 
    getAppInfo: any,
    appInfoState: AppInfoState,
    topicId?: number,
    })> = ({
    getAppInfo,
    appInfoState,
    topicId = -1
    }) => {
    let { appNameId } = useParams();
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
                title: 'Test - ' + appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.avatar
            });
            ReactGA.pageview('/testpage/' + appInfo.title);
        }
    }, [appInfo]);
    if(!appInfo){
        return <LoadingWidget />
    }
    return (
        <TestView appInfo={appInfo} topicId={topicId > -1 ? topicId : appInfo.id} isMobile={isMobile} />
    );
}

class TestViewUI extends Component<any, any> {
    constructor(props: any) {
        super(props);
        let appInfo: AppInfo = props.appInfo;
        this.state = {
            topicId: props.topicId,
            appInfo: appInfo,
            showGame: false,
            isMobile: props.isMobile
        }
    }

    componentWillReceiveProps(nextProps: any) {
        // auto show test
        if(this.state.isMobile && this.props.gameState.isLoaded === false && nextProps.gameState.isLoaded === true) {
            this.setState({
                showGame: nextProps.gameState.isLoading == 3 || nextProps.gameState.isLoading == 4 // new game || resume game
            })
        }
    }

    renderTest = () => {
        const { gameState, onContinue, testSetting } = this.props;
        const appInfo: AppInfo = this.state.appInfo;
        if(!testSetting || !testSetting.currentSetting || testSetting.currentSetting.appId != appInfo.id){
            return <LoadingWidget />;
        }
        let currentQuestion = gameState.currentQuestion;
        let isSkip = currentQuestion && currentQuestion.questionStatus == Config.QUESTION_NOT_ANSWERED;
        return (
            <Grid item sm={12} md={8} className="right-panel" 
                style={this.state.isMobile ? {display: this.state.showGame ? '' : 'none'} : {}}>
                <div className="box-question-panel">
                    { !gameState.isFinish ? <TestProgressPanel /> : ''}
                    <TestQuestionPanel
                        className="question-view-study-game"
                        appId={appInfo.id}
                        topicId={this.state.topicId}
                        gameType={Config.TEST_GAME}
                        testSetting={testSetting.currentSetting}
                    />
                </div>
                { !gameState.isFinish ? <Grid container justify="center" className="button-game-panel">

                    <Button
                        className={isSkip ? "skip-button" : "continue-button"}
                        onClick={() => {
                            onContinue(testSetting.currentSetting);
                        }}
                    >
                        { isSkip ? "Skip" : "Continue" }
                    </Button>
                </Grid> : ''}
            </Grid>
        );
    }
    render() {
        const { startNewTest, gameState, stateInfoState } = this.props;
        const appInfo: AppInfo = this.state.appInfo;
        // contentTest Setting
        let loading: boolean = this.state.isMobile && gameState && gameState.isLoading == 2;
        return (
            <MainWidget>
                <Header />
                <FixedContainer className="test-game-panel">
                    <Grid
                        container
                        direction="row"
                        spacing={this.state.isMobile ? 0 : 3}
                    >
                        { loading ? <LoadingWidget fixed={true} /> : '' }
                        <Grid item sm={12} md={4} className="left-panel" 
                            style={this.state.isMobile ? {display: this.state.showGame && !gameState.isFinish ? 'none' : ''} : {}}>
                            {
                            gameState.isFinish ?
                                <EndTestView /> : <CustomTestView 
                                    topicId={this.state.topicId}
                                    appInfo={appInfo}
                                    startNewTest={(testSetting: TestSetting) => {
                                        // console.log("Custom Testxxxxx", testSetting);
                                        let appId = appInfo.id;
                                        let topicId = this.state.topicId;
                                        if(appInfo.hasState && stateInfoState.mapCurrentStateInfo[appId]){
                                            topicId = stateInfoState.mapCurrentStateInfo[appId].id;
                                        }
                                        console.log("appIdappIdappIdappId", appId, 'topicId', topicId, 'testSetting', testSetting);
                                        startNewTest(appId, topicId, testSetting);
                                    }}
                                    showButtonContinue={this.state.isMobile && !this.state.showGame}
                                    onContinueTest={() => {
                                        this.setState({
                                            showGame: true
                                        })
                                    }}
                                />}
                        </Grid>
                        {this.state.isMobile && this.state.showGame && !gameState.isFinish ? 
                        <Grid container alignItems="center" >
                            <IconButton onClick={() => {
                                this.setState({
                                    showGame: false
                                })
                            }}><ArrowBackIcon /></IconButton>
                        </Grid> : ''}
                        {
                            this.renderTest()
                        }
                    </Grid>
                </FixedContainer>
                <Footer />
                <ShowImage />
                {appInfo.hasState ? <SelectStatePopup
                    appInfo={appInfo}
                    openPopupChangeState={false}
                /> : ''}
            </MainWidget>
        );
    }
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        topicReducer: state.topicReducer,
        gameState: state.gameState,
        testSetting: state.testSettingState,
        stateInfoState: state.stateInfoState,
        ...ownProps
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    startNewTest: (appId: number, topicId: number, testSetting: TestSetting) => dispatch(startNewExamTest({ 
        appId: appId, 
        topicId: topicId,
        setting: testSetting,
        gameType: Config.TEST_GAME, 
    })),
    onContinue: (testSetting: TestSetting) => dispatch(onContinue(testSetting)),
});

const mapStateToPropsMain = (state: AppState, ownProps: any) => {
    return {
        appInfoState: state.appInfoState,
        ...ownProps
    };
}

const mapDispatchToPropsMain = (dispatch: any) => ({
    getAppInfo: (appNameId: string) => dispatch(getAppInfo(appNameId))
});

const TestView = connect(mapStateToProps, mapDispatchToProps)(TestViewUI);
export default connect(mapStateToPropsMain, mapDispatchToPropsMain)(TestViewScreen);