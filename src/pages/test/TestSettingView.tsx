import { Button, Checkbox, FormControl, IconButton, Input, ListItemText, MenuItem, Modal, Select, TextField } from '@material-ui/core';
import { Clear as CloseIcon } from '@material-ui/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LoadingWidget } from '../../components/Widgets';
import Config from '../../config';
import AppInfo from '../../models/AppInfo';
import TestSetting from '../../models/TestSetting';
import Topic from '../../models/Topic';
import { endTest, getTopicsByParentId, loadTestSettingByTopicId } from '../../redux/actions';
import { AppState } from '../../redux/appstate';
import { TopicState } from '../../redux/reducers/topic';
import '../../resources/scss/main.scss';
import '../../resources/scss/test.scss';
import { StateInfoState } from '../../redux/reducers/stateInfo';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const CustomTestView: FunctionComponent<({
    testSetting: TestSetting,
    topicState: TopicState,
    appInfo: AppInfo,
    topicId: number,
    endTest: any,
    startNewTest: any,
    loadTestSetting: any,
    getTopicsByParentId: any,
    showButtonContinue: boolean,
    onContinueTest: any,
    stateInfoState: StateInfoState
    })> = ({
    testSetting,
    topicState,
    appInfo,
    topicId,
    startNewTest,
    endTest,
    loadTestSetting,
    getTopicsByParentId,
    showButtonContinue,
    onContinueTest,
    stateInfoState
    }) => {
    const [openModal, setOpenModal] = useState(false);
    let appId = appInfo.id;
    let parentId = appId;
    // console.log("stateInfoState", stateInfoState);
    if(appInfo && appInfo.hasState && stateInfoState.mapCurrentStateInfo[appId]){
        parentId = stateInfoState.mapCurrentStateInfo[appId].id;
        topicId = parentId;
    }
    // console.log("parentIdparentIdparentIdparentIdparentIdparentIdparentId", parentId, 'appId', appId)
    useEffect(() => {
        if(!appInfo.hasState || (appInfo.hasState && parentId != appId)){
            getTopicsByParentId(parentId);
        }
    }, [getTopicsByParentId, appInfo, parentId, appId]);
    let mainTopics = new Array<Topic>();
    let topicIds = new Array<number>();
    // console.log("11111111 topicState", topicState);
    if(!topicState.loading)  {
        let topics: Array<Topic> = Object.values(topicState.data);
        topics.forEach((topic: Topic) => {
            if(topic.parentId === parentId){
                mainTopics.push(topic);
                topicIds.push(topic.id);
            }
        });
    }
    if(topicId !== appId && !appInfo.hasState){
        topicIds.push(topicId);
    }
    useEffect(() => {
        // console.log("XXXX topicIds", topicIds, 'appId', appId, 'topicId', topicId, 'testSetting', testSetting);
        if(topicIds && topicIds.length > 0 && (!testSetting || (testSetting && (testSetting.appId != appId && testSetting.topicId != topicId)))){
            // console.log("load test setting", topicIds);
            loadTestSetting(appId, topicId, topicIds);
        }
        
    }, [loadTestSetting, appId, topicId, topicIds, testSetting]);
    // console.log("CustomTestView xxxxxxxxxxxxxxxxxxx testSetting", testSetting);
    if(!testSetting) return <LoadingWidget />;
    return (
        <div className="custom-test-view">
            <p>You are about to take the simulator test. If you pass this test at least 5 times, congratulations! You are ready for your real test</p>
            <ul>
                <li>As close as it gets to the actual test.</li>
                <li>{testSetting.totalQuestion} questions.</li>
                <li>{testSetting.allowMistake} mistakes allowed.</li>
                <li>New questions every time you re-take.</li>
                <li>Stop as soon as you have reached the failing score.</li>
            </ul>

           {showButtonContinue ? <div className="buttons-panel">
                <Button variant="contained" color="primary" className="custom-test-button" onClick={() => onContinueTest()}>
                    Continue
                </Button>
            </div> : ''}
            <div className="buttons-panel">
                <Button variant="contained" color="primary" className="custom-test-button" onClick={() => setOpenModal(true)}>
                    Custom Test
                </Button>
            </div>
            <div className="buttons-panel">
                <Button variant="contained" color="secondary" className="end-test-button" onClick={() => {
                    endTest(appId, topicId, Config.TEST_GAME, testSetting);
                }}>
                    End Test
                </Button>
            </div>

            <Modal
                className="my-modal"
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <div>
                    <CustomTestModal
                        appId={appId}
                        topicId={topicId}
                        mainTopics={mainTopics}
                        onClose={() => setOpenModal(false)}
                        onChange={(testSetting: TestSetting) => {
                            if (startNewTest) startNewTest(testSetting);
                            setOpenModal(false);
                        }}
                        testSetting={testSetting}
                    />
                </div>
            </Modal>
        </div>
    );
}
const CustomTestModalUI: FunctionComponent<({
    mainTopics: Array<Topic>,
    onClose: Function,
    onChange: Function,
    testSetting: TestSetting,
    appId: number,
    topicId: number
    })> = ({
    mainTopics, 
    onClose, 
    onChange, 
    testSetting,
    appId,
    topicId,
    }) => {
    // console.log("CustomTestModal props ", testSetting);
    const [instanceFeedback, setInstanceFeedback] = useState(testSetting.instanceFeedback ?? false);
    const [totalQuestion, setTotalQuestion] = useState(testSetting.totalQuestion ?? 0);
    const [allowMistake, setAllowMistake] = useState(testSetting.allowMistake ?? 0);
    const [contentTest, setContentTest] = useState(testSetting.contentTest ?? []);
    return (
        <div className="my-modal-content custom-test-content-dialog-panel">
            <div className="my-modal-header">
                Custom Test
                <IconButton aria-label="delete" className="close-icon-button" onClick={() => onClose()}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
            <div className="my-modal-body">
                <div className="custom-test-content-panel">
                    <div className="item">
                        <label>Questions number for test</label>
                        <TextField
                            id="text-box-question-number"
                            defaultValue={!totalQuestion || isNaN(totalQuestion) ? 0 : totalQuestion}
                            variant="outlined"
                            // size="small"
                            type="number"
                            className="field-content"
                            onChange={(event) => {
                                let value = event.target.value;
                                let total = 0;
                                try {
                                    total = parseInt(value, 10);
                                } catch(e) {}
                                setTotalQuestion(total);
                            }}
                        />
                    </div>
                    <div className="item">
                        <label>Max allowed questions mistake</label>
                        <TextField
                            id="text-box-allowed-mistakes"
                            defaultValue={!allowMistake || isNaN(allowMistake) ? 0 : allowMistake}
                            variant="outlined"
                            // size="small"
                            type="number"
                            className="field-content"
                            onChange={(event) => {
                                let value = event.target.value;
                                let total = 0;
                                try {
                                    total = parseInt(value, 10);
                                } catch(e) {}
                                setAllowMistake(total);
                            }}
                        />
                    </div>
                    {
                        mainTopics.length > 0 ? <div className="item">
                            <label>Content test</label>
                            <MultipleSelectBox
                            valuesDefault={contentTest} 
                            mainTopics={mainTopics} 
                            className="field-content" 
                            onChange={(values: any) => {
                                setContentTest(values)
                            }} 
                            />
                        </div> : ''
                    }
                    <div className="item">
                        <label>Instance feedback</label>
                        <FormControl variant="outlined" className="select-instance-feedback field-content">
                            <Select
                                id="select-instance-feedback"
                                value={instanceFeedback ? 1 : 0}
                                onChange={(event) => {
                                    console.log("event.target.value", event.target.value);
                                    setInstanceFeedback(!!event.target.value)
                                }}

                            >
                                <MenuItem value={0} >Off</MenuItem>
                                <MenuItem value={1}>On</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="start-test-button-panel">
                    <Button variant="contained" color="primary" className="start-test-button" onClick={() => {
                        onChange({
                            instanceFeedback: instanceFeedback,
                            totalQuestion: totalQuestion,
                            allowMistake: allowMistake,
                            contentTest: contentTest,
                            appId: appId,
                            topicId: topicId
                        })
                    }}>
                        Start Test
                    </Button>
                </div>
            </div>
        </div>
    );
}

const MultipleSelectBox = (props: { mainTopics: Array<Topic>, onChange: Function, className: string, valuesDefault: any }) => {
    const { mainTopics, onChange, className, valuesDefault } = props;
    const [topicIds, setTopicIds] = useState(valuesDefault ? valuesDefault : new Array<number>());
    let mapTopicId = new Map<number, Topic>();
    mainTopics.forEach((item: Topic) => {
        mapTopicId.set(item.id, item);
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    let width;
    if(isMobile){
        width = window.innerWidth - 60;
    }
    return (
        <FormControl style={width ? { maxWidth: width } : {}} className={"select-content-test" + (className ? " " + className : "")} variant="outlined">
            <Select
                id="select-content-test"
                multiple
                value={topicIds}
                onChange={event => {
                    const values = event.target.value;
                    // console.log("values", values);
                    onChange(values);
                    setTopicIds(values);
                }}
                input={<Input />}
                renderValue={(selected: any) => {
                    let result = new Array<string>();
                    selected.forEach((id: number) => {
                        let item: Topic | undefined= mapTopicId.get(id);
                        if(item) result.push(item.name);
                        
                    });
                    return result.join(', ');
                }}
            >
                {
                    mainTopics.map((item) => {
                        return (
                            <MenuItem value={item.id} key={'menu-select-item-' + item.id}>
                                <Checkbox checked={topicIds.indexOf(item.id) > -1} />
                                <ListItemText primary={item.name} />
                            </MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        topicState: state.topicReducer,
        testSetting: state.testSettingState.currentSetting,
        stateInfoState: state.stateInfoState,
        ...ownProps
    };
}

const mapDispatchToProps = {
    getTopicsByParentId: (parentId: number) => getTopicsByParentId(parentId),
    loadTestSetting: (appId: number, topicId: number, topicIds: Array<number>) => loadTestSettingByTopicId({
        appId: appId,
        topicId: topicId,
        topicIds: topicIds
    }),
    endTest: (appId: number, topicId: number, gameType: number, setting: TestSetting) => endTest({ 
        appId: appId, 
        topicId: topicId,
        gameType: gameType, 
        setting: setting 
    }),
};

const mapStateToPropsModal = (state: AppState, ownProps: any) => {
    return {
        topicState: state.topicReducer,
        testSetting: state.testSettingState.currentSetting,
        ...ownProps
    };
}
const CustomTestModal = connect(mapStateToPropsModal, null)(CustomTestModalUI);
export default connect(mapStateToProps, mapDispatchToProps)(CustomTestView);