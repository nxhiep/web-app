import { Collapse, Grid, Button } from '@material-ui/core';
import { Clear as UnCheckIcon, Done as CheckIcon, Favorite as HeartIcon, FavoriteBorder as UnHeartIcon } from '@material-ui/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import QuestionContentPanel, { TextContentType } from '../../components/QuestionContentPanel';
import { LoadingWidget } from '../../components/Widgets';
import Config from '../../config';
import AppInfo from '../../models/AppInfo';
import Choice from '../../models/Choice';
import QuestionProgress from '../../models/QuestionProgress';
import Question from '../../models/QuestionX';
import { onBookmark } from '../../redux/actions';
import { loadGame, onSelectedChoice } from '../../redux/actions/game';
import { AppState } from '../../redux/appstate';
import { QuestionProgressState } from '../../redux/reducers/cardProgress';
import { GameState } from '../../redux/reducers/game';
import ReactHtmlParser from 'react-html-parser';

const mapStateToProps = (state: AppState, ownProps: any) => ({
       gameState: state.gameState,
       cardProgressReducer: state.cardProgressReducer,
       ...ownProps
    // user: state.user
})
const mapDispatchToProps = {
    loadGame: (props: {appId: number, topicId: number, gameType: number, questionIds: Array<number> }) => loadGame(props),
    onBookmark: (question: Question) => onBookmark(question),
}
const mapDispatchReviewQuestionToProps = {
    onBookmark: (question: Question) => onBookmark(question)
}
const mapDispatchChoiceToProps = {
    onChoiceSelected: (choice: Choice) => onSelectedChoice(choice)
}

const ReviewQuestionPanelUI: FunctionComponent<(
    { 
        questions: Array<Question>, 
        questionProgress: Map<number, QuestionProgress>, 
        onBookmark: any,
        appInfo: AppInfo,
    })> = 
    ({ 
        questions, 
        questionProgress, 
        onBookmark,
        appInfo
    }) => {
        if (!questionProgress) {
        questionProgress = new Map<number, QuestionProgress>();
    }
    return (
        <div className='questions-panel'>
            {
            questions.map((question: Question, index: number) => {
                if (questionProgress.has(question.id)) {
                    question.progress = questionProgress.get(question.id) ?? new QuestionProgress();
                }
                return <QuestionItemTS question={question} key={'question-item-' + question.id} index={index} onBookmark={onBookmark} />;
            })
            }
        </div>
    );
}

const QuestionsPanelx: FunctionComponent<(
    { questionProgress: Map<number, QuestionProgress>, 
        className: string, 
        topicId: number, 
        loadGame: Function, 
        gameState: GameState,
        gameType: number, 
        currentIndex: number, 
        onBookmark: any, 
        cardProgressReducer: QuestionProgressState, 
        questionIds: Array<number>,
        appInfo: AppInfo,
    })> = ({ 
        questionProgress, 
        className, 
        topicId, 
        loadGame, 
        gameState, 
        gameType, 
        currentIndex, 
        onBookmark, 
        cardProgressReducer, 
        questionIds,
        appInfo    
    }) => {
    // console.log("QuestionsPanelx QuestionsPanelx QuestionsPanelx cards", Object.assign({}, questionIds));
    useEffect(() => {
        loadGame({ appId: appInfo.id, topicId: topicId, gameType: gameType, questionIds: questionIds });
    }, [loadGame, appInfo, topicId, gameType, questionIds]);
    console.log("************** ", gameState.isLoading);
    if(gameState.isLoading == 1 || gameState.isLoading == 2) {
        return <LoadingWidget color={null} />;
    }

    if(gameType === Config.REVIEW_GAME){
        let questions = gameState.questions;
        if(!questions){
            return <LoadingWidget color={null} />;
        }
        // console.log("RENDER OK ", questions);
        return (
            <div className={"questions-panel" + (className ? " " + className : "")}>
                {
                    questions.map((question, index) => {
                        return <QuestionItemTS 
                                question={question} 
                                key={'question-item-' + question.id} 
                                index={index} 
                                onBookmark={onBookmark} />;
                    })
                }
            </div>
        );
    }
    let currentQuestion = gameState.currentQuestion;
    if (!questionProgress) {
        questionProgress = new Map<number, QuestionProgress>();
    }
    // console.log("check check check ", gameState);
    if (!currentQuestion) {
        return <LoadingWidget color={null} />;
    }
    if(!currentIndex){
        currentIndex = 0;
    }
    let questions = [currentQuestion];
    return (
        <div className={"questions-panel" + (className ? " " + className : "")}>
            {
                questions.map((question, index) => {
                    if (questionProgress.has(question.id)) {
                        question.progress = questionProgress.get(question.id) ?? new QuestionProgress();
                    }
                    return <QuestionItemTS 
                            question={question} 
                            key={'question-item-' + question.id} 
                            index={currentIndex} 
                            onBookmark={onBookmark} />;
                })
            }
        </div>
    );
}

const QuestionItemTS: FunctionComponent<({ question: Question, index: number, onBookmark: any })> = ({ question, index, onBookmark }) => {
    // question.answers.forEach(element => {
    //     mapAnswerResult[element] = true;
    // });
    // console.log(111, question);
    const listAnswer: Array<Choice> = question.choices;
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
                <ProgressQuestionTS progress={question.progress.progress} questionId={question.id} />
                <span style={{ 'marginLeft': 'auto' }} onClick={() => {
                    onBookmark(question);
                }}>
                    {question.progress.bookmark ? <HeartIcon style={{ 'color': '#aaa' }} /> : <UnHeartIcon style={{ 'color': '#aaa' }} />}
                </span>
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
            {
                question.correctNums > 1 ? <div className="select-multiple-question-title">
                    Selected: {question.getNumberChoiceSelected()}/{question.correctNums}
                </div> : null
            }
            <ChoicesPanelTS
                listAnswer={listAnswer} questionId={question.id}
                questionStatus ={question.questionStatus}
                explanation={question.explanation} />
        </div>
    );
}

const ChoicesPanelTS: FunctionComponent<({ questionId: number, listAnswer: Array<Choice>, questionStatus: number, explanation: string })> = 
    ({ questionId, listAnswer, questionStatus, explanation }) => {
    return (
        <div className="choices-panel">
            {
                listAnswer.map((choice, index) => {
                    return <AnswerButtonTS
                        index={index}
                        answer={choice.content}
                        key={'answer-item-' + questionId + '-' + index}
                        showResult={(questionStatus === Config.QUESTION_NOT_ANSWERED) ? false : true}
                        explanation={explanation}
                        result={choice.isCorrect}
                        selected={choice.selected}
                        choice={choice}
                    />;
                })
            }
        </div>
    );
}

const AnswerButton2: FunctionComponent<(
    { 
        index:number, 
        answer: string, 
        explanation: string,
        result: boolean,
        selected: boolean,
        choice: Choice,
        onChoiceSelected: any,
        showResult: boolean
    }
    )> = ({ index, answer, explanation, result, selected, choice, onChoiceSelected, showResult }) => {
    let showCss = "";
    // console.log(")))))))))))))))) showResult", showResult, 'selected', selected, 'result', result);
    if(showResult) {
        if(selected) {
            showCss = (result ? " correct" : " wrong");
        } else {
            showCss = (result ? " correct" : "");
        }
    }
    return (
        <button className={"answer-button" + (!showResult && selected ? " selected" : "") + showCss + (Config.TEST_MODE && result ? " test-true" : "")} onClick={() => {
            if(showResult){
                return;
            }
            onChoiceSelected(choice);
        }}>
            <div className="answered-content">
                <div className='answer-button-title'>{String.fromCharCode(65 + index)}</div>
                <div className='answer-button-content'><QuestionContentPanel content={answer} type={TextContentType.answer} /></div>
            </div>
            <Collapse className="explanation" in={showResult && result}>
                <p>Explanation:</p>
                <QuestionContentPanel content={explanation} type={TextContentType.explanation} />
            </Collapse>
        </button>
    );
}

const ProgressQuestionTS: FunctionComponent<({ progress: Array<number>, questionId: number })> = ({ progress, questionId }) => {
    if (!progress) {
        return <div></div>;
    }
    return (
        <span>
            {
                progress.map((item: number, index: number) => {
                    return (
                        <span key={'ProgressQuestion-item-' + questionId + '-' + index}>
                            {item === 1 ?
                                <CheckIcon style={{ 'color': 'green', 'fontSize': '16px' }} />
                                : <UnCheckIcon style={{ 'color': 'red', 'fontSize': '16px' }} />}
                        </span>
                    );
                })
            }
        </span>
    );
}
const AnswerButtonTS = connect(null,mapDispatchChoiceToProps)(AnswerButton2);
const QuestionsPanelTS = connect(mapStateToProps, mapDispatchToProps)(QuestionsPanelx);
const ReviewQuestionPanel = connect(null, mapDispatchReviewQuestionToProps)(ReviewQuestionPanelUI);
export { ReviewQuestionPanel, QuestionsPanelTS, QuestionItemTS, ChoicesPanelTS, AnswerButtonTS, ProgressQuestionTS };

