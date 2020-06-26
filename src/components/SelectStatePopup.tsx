import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import AppInfo from "../models/AppInfo";
import { StateInfo } from "../models/StateInfo";
import { getStateInfo, setCurrentStateInfo } from "../redux/actions";
import { AppState } from "../redux/appstate";
import { StateInfoState } from "../redux/reducers/stateInfo";
import { LoadingWidget } from "./Widgets";
import { onScrollElementAtParentElement } from "../models/Utils";

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SelectStatePopup: FunctionComponent<({
    stateInfoState: StateInfoState
    getStateInfo: any,
    setCurrentStateInfo: any,
    appInfo: AppInfo,
    openPopupChangeState: boolean,
    onHidden?: any
    })> = ({
    stateInfoState,
    getStateInfo,
    setCurrentStateInfo,
    appInfo,
    openPopupChangeState,
    onHidden
    }) => {
    console.log("SelectStatePopup stateInfoState", stateInfoState);
    const [open, setOpen] = useState(!stateInfoState.mapCurrentStateInfo[appInfo.id]);
    useEffect(() => {
        if(appInfo.hasState){
            getStateInfo(appInfo.id);
        }
    }, [getStateInfo, appInfo]);
    useEffect(() => {
        if(appInfo.hasState && openPopupChangeState){
            setOpen(true);
            onScrollElementAtParentElement('.state-item.active', '.select-state-popup .MuiDialog-scrollPaper');
        }
        // TODO
        // let x = document.querySelector('[role="none presentation"]');
        // console.log('none-presentation', x);
        // if(x) {
        //     x.setAttribute('role', 'dialog');
        // }
    }, [openPopupChangeState, appInfo])
    const handleClose = () => {
        setOpen(false);
    }
    const selectStateHandle = (stateInfo: StateInfo) => {
        setCurrentStateInfo(stateInfo);
        setOpen(false);
    }
    let stateInfos: Array<StateInfo> = stateInfoState.list;
    let currentStateInfo: StateInfo = stateInfoState.mapCurrentStateInfo[appInfo.id];
    return (
        <Dialog
            onExit={() => {
                onHidden && onHidden();
            }}
            fullWidth={true}
            className="select-state-popup"
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            role="dialog"
            // aria-labelledby="alert-dialog-slide-title"
            // aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Select state</DialogTitle>
            <DialogContent role="dialog">
                <div className="state-info-panel">
                {
                    stateInfoState.loading == true || !stateInfos ? 
                    <LoadingWidget /> : stateInfos.sort((a: StateInfo, b: StateInfo) => a.name.localeCompare(b.name))
                        .map((stateInfo: StateInfo) => {
                        return (
                            <Button 
                                className={'state-item' + (currentStateInfo && currentStateInfo.id == stateInfo.id ? ' active' : '')} 
                                key={'state-item-' + stateInfo.id} 
                                variant="outlined" onClick={() => selectStateHandle(stateInfo)} >
                                {stateInfo.name}
                            </Button>
                        );
                    })
                }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: AppState, ownProps: any) => ({
    stateInfoState: state.stateInfoState,
    ...ownProps
});
const mapDispatchToProps = (dispatch: any) => ({
    getStateInfo: (parentId: number) => dispatch(getStateInfo(parentId)),
    setCurrentStateInfo: (stateInfo: StateInfo) => dispatch(setCurrentStateInfo(stateInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectStatePopup);