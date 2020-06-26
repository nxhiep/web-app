import { Collapse, Grid, Button } from '@material-ui/core';
import { Favorite as HeartIcon, FavoriteBorder as UnHeartIcon } from '@material-ui/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import QuestionContentPanel, { TextContentType } from '../../components/QuestionContentPanel';
import { LoadingWidget } from '../../components/Widgets';
import Config from '../../config';
import Choice from '../../models/Choice';
import Progress from '../../models/Progress';
import Question from '../../models/QuestionX';
import TestSetting from '../../models/TestSetting';
import { onBookmark } from '../../redux/actions';
import { loadGame, onSelectedChoice } from '../../redux/actions/game';
import { AppState, TestSettingState } from '../../redux/appstate';
import { GameState } from '../../redux/reducers/game';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ParamsLoadGame {
    appId: number,
    topicId: number;
    gameType: number;
    setting: TestSetting;
}
var arrayIndex = new Array<number>();
const TestQuestionPanelUI: FunctionComponent<{
    initial?: number,
    questionProgress?: any,
    className?: string,
    appId: number,
    topicId: number,
    loadGame?: (params: ParamsLoadGame) => void,
    gameState?: GameState,
    gameType?: number,
    index?: number,
    onBookmark: any,
    testSetting: TestSetting,
}> = ({
    initial = 0,
    questionProgress = {},
    className = "",
    loadGame = () => {
        // console.log("vkl");
    },
    gameType = Config.TEST_GAME,
    gameState = GameState.init(),
    appId,
    topicId,
    index = 0,
    onBookmark,
    testSetting
}) => {
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
            return <LoadingWidget color={null} />;
        }
        let questions = [currentQuestion];
        // console.log("TEST game state ", gameState);
        if (gameState.isFinish) {
            questions = gameState.questions.sort((a, b) => a.index - b.index);
        }
        if (questions.length === 0) {
            return (
                <div>
                    Empty!
            </div>
            );
        }
        if (gameState.questions.length > 0 && arrayIndex.length == 0) {
            for (let i = 0; i < gameState.questions.length; i++) {
                arrayIndex.concat(i);
                index = i;
            }
        }
        return (
            <div 
                className={"questions-panel" + (className ? " " + className : "") + (gameState.isFinish ? " end-game" : "")} 
                style={gameState.isFinish && !isMobile ? { maxHeight: 500 } : {}}>
                {
                    questions.map((question) => {
                        if (questionProgress[question.id]) {
                            question.progress = questionProgress[question.id];
                        }
                        // if (!question.progress) {
                        //     question.progress = {};
                        // }
                        return <QuestionItem 
                                question={question} 
                                key={'question-item-' + question.id} 
                                index={question.index} 
                                onBookmark={onBookmark}/>;
                    })
                }
            </div>
        );
    }


const QuestionItem: FunctionComponent<({ 
    question: Question, index?: number, onBookmark: any,
    })> = ({ question = new Question(), index = 0, onBookmark }) => {
    // question.answers.forEach(element => {
    //     mapAnswerResult[element] = true;
    // });
    const listAnswer = question.choices;
    const [openCollapse, setOpenCollapse] = useState(false);
    useEffect(() => {
        setOpenCollapse(false);
    }, [question]);
    return (
        <div className="question-item-panel">
            <Grid
                container
                direction="row"
                alignItems="center"
                className="question-header-panel"
            >
                <span className="q-title">Question {index + 1}:</span>
                <span style={{ 'marginLeft': 'auto' }} onClick={() => {
                    onBookmark(question);
                }}>{question.progress.bookmark ? <HeartIcon style={{ 'color': '#aaa' }} /> : <UnHeartIcon style={{ 'color': '#aaa' }} />}</span>
            </Grid>
            <div className="question-content">
                <QuestionContentPanel content={question.question} image={question.image} type={TextContentType.question} />
            </div>
            {
                question.paragraphId && question.paragraphId > -1 && question.paragraphContent ? 
                <div className="question-paragraph">
                    <Button 
                        style={{marginBottom: "10px"}}
                        variant="outlined" 
                        color="primary"
                        onClick={() => {
                        setOpenCollapse(!openCollapse);
                    }}>{openCollapse ? "Hidden" : "Read more"}</Button>
                    <Collapse style={{color: '#555', paddingBottom: "10px"}} in={openCollapse}>
                        <QuestionContentPanel content={question.paragraphContent} type={TextContentType.explanation} />
                    </Collapse>
                </div> : ''
            }
            <ChoicesPanel
                listAnswer={listAnswer} 
                questionId={question.id}
                questionStatus={question.questionStatus}
                explanation={question.explanation}
                />
        </div>
    );
}

const ChoicesPanelUI: FunctionComponent<({ 
    questionId?: number, 
    listAnswer?: Array<Choice>, 
    questionStatus?: number, 
    explanation?: string, 
    testSettingState?: TestSettingState,
    isFinish?: boolean
    })> = ({ 
    questionId = -1, 
    listAnswer = [], 
    questionStatus = 0, 
    explanation = "", 
    testSettingState,
    isFinish = false,
    }) => {
    let testSetting: TestSetting | undefined = testSettingState?.currentSetting;
    let showResult = isFinish 
    || (!(questionStatus === Config.QUESTION_NOT_ANSWERED) && testSetting && testSetting.instanceFeedback);
    // console.log("ChoicesPanel XXXXXXXXXXXx showResult", showResult, 'testSetting instanceFeedback', testSetting.instanceFeedback, 'listAnswer', listAnswer);
    return (
        <div className="choices-panel">
            {
                listAnswer.map((choice: Choice, index: number) => {
                    return <AnswerButton
                        index={index}
                        key={'answer-item-' + questionId + '-' + index}
                        showResult={showResult}
                        explanation={explanation}
                        choice={{...choice}}
                    />;
                })
            }
        </div>
    );
}

const AnswerButtonUI: FunctionComponent<({
    index?: number,
    explanation?: string,
    choice?: Choice,
    onChoiceSelected?: (choice: Choice) => void,
    showResult?: boolean,
})> = ({
    index = 0,
    showResult = false,
    choice = new Choice(),
    explanation = "",
    onChoiceSelected = () => {

    }
}) => {
    // console.log("55555555555555", choice);
    // useEffect(() => {
    //     console.log("choice ccccccc ", choice);
    // }, [choice])
        let showCss = "";
        if (showResult) {
            if (choice.selected) {
                showCss = (choice.isCorrect ? " correct" : " wrong");
            } else {
                showCss = (choice.isCorrect ? " correct" : "");
            }
        }
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&", showResult, choice.isCorrect, 111, choice.selected);
        return (
            <button className={"answer-button" + (!showResult && choice.selected ? " selected" : "") + showCss + (Config.TEST_MODE && choice.isCorrect ? " test-true" : "")} 
                onClick={() => {
                if (showResult) {
                    return;
                }
                onChoiceSelected(choice);
            }}>
                <div className="answered-content">
                    <div className='answer-button-title'>{String.fromCharCode(65 + index)}</div>
                    <div className='answer-button-content'>
                        <QuestionContentPanel content={choice.content} type={TextContentType.answer} />
                    </div>
                </div>
                <Collapse className="explanation" in={(!!showResult && !!choice.isCorrect)}>
                    <p>Explanation:</p>
                    <div><QuestionContentPanel content={explanation} type={TextContentType.explanation} /></div>
                </Collapse>
            </button>
        );
    }

const TestProgressPanelUI: FunctionComponent<
({ gameState: GameState})> = 
({ gameState }) => {
    let progress: Progress = gameState.progress;
    let size = (progress.done / progress.total) * 100;
    let loading = gameState.isLoading == 1 || gameState.isLoading == 2;
    if(loading){
        return <LoadingWidget color={null} />;
    }
    return (
        <div className="test-progress-panel">
            <div className="progress-panel">
                <div className="content-line-progress" style={{left: 'calc('+size+'% - 25px)'}}>{progress.done} / {progress.total}</div>
                <div style={{visibility: 'hidden'}}>X</div>
                <div className="parent-content-panel">
                    <div className="content-progress" style={{width: size + '%'}}></div>
                    <div style={{visibility: 'hidden'}}>X</div>
                </div>
            </div>
        </div>
    );
}

const mapTestSettingStateToProps = (state: AppState) => {
    // console.log("mapTestSettingStateToProps ", Object.assign({}, state.gameState));
    return {
        testSettingState: state.testSettingState,
        isFinish: state.gameState.isFinish
    }
}
// const mapTestSettingStateToProps = (state: AppState) => ({
//     testSettingState: state.testSettingState,
//     isFinish: state.gameState.isFinish
// })

const mapStateToProps = (state: AppState, ownProps: any) => ({
    gameState: state.gameState,
    cardProgressReducer: state.cardProgressReducer,
    ...ownProps
    // user: state.user
})
const mapDispatchToProps = {
    loadGame: (params: ParamsLoadGame) => loadGame(params),
    onChoiceSelected: (choice: Choice) => onSelectedChoice(choice),
    onBookmark: (question: Question) => onBookmark(question)
}
const AnswerButton = connect(null, mapDispatchToProps)(AnswerButtonUI);
const TestQuestionPanel = connect(mapStateToProps, mapDispatchToProps)(TestQuestionPanelUI);
const ChoicesPanel = connect(mapTestSettingStateToProps, null)(ChoicesPanelUI);
const TestProgressPanel = connect(mapStateToProps, null)(TestProgressPanelUI);
export { TestQuestionPanel, TestProgressPanel };

