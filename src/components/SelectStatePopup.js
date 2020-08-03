import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getStateInfo, setCurrentStateInfo } from "../redux/actions";
import { LoadingWidget } from "./Widgets";
import { onScrollElementAtParentElement } from "../models/Utils";
const Transition = React.forwardRef(function Transition(props, ref) {
    return React.createElement(Slide, Object.assign({ direction: "up", ref: ref }, props));
});
const SelectStatePopup = ({ stateInfoState, getStateInfo, setCurrentStateInfo, appInfo, openPopupChangeState, onHidden }) => {
    console.log("SelectStatePopup stateInfoState", stateInfoState);
    const [open, setOpen] = useState(!stateInfoState.mapCurrentStateInfo[appInfo.id]);
    useEffect(() => {
        if (appInfo.hasState && openPopupChangeState) {
            setOpen(true);
            onScrollElementAtParentElement('.state-item.active', '.select-state-popup .MuiDialog-scrollPaper');
        }
    }, [openPopupChangeState, appInfo]);
    const handleClose = () => {
        setOpen(false);
    };
    const selectStateHandle = (stateInfo) => {
        setCurrentStateInfo(stateInfo);
        setOpen(false);
    };
    let stateInfos = stateInfoState.list;
    let currentStateInfo = stateInfoState.mapCurrentStateInfo[appInfo.id];
    return (React.createElement(Dialog, { onExit: () => {
            onHidden && onHidden();
        }, fullWidth: true, className: "select-state-popup", open: open, TransitionComponent: Transition, keepMounted: true, onClose: handleClose, role: "dialog" },
        React.createElement(DialogTitle, { id: "alert-dialog-slide-title" }, "Select state"),
        React.createElement(DialogContent, { role: "dialog" },
            React.createElement("div", { className: "state-info-panel" }, stateInfoState.loading == true || !stateInfos ?
                React.createElement(LoadingWidget, null) : stateInfos.sort((a, b) => a.name.localeCompare(b.name))
                .map((stateInfo) => {
                return (React.createElement(Button, { className: 'state-item' + (currentStateInfo && currentStateInfo.id == stateInfo.id ? ' active' : ''), key: 'state-item-' + stateInfo.id, variant: "outlined", onClick: () => selectStateHandle(stateInfo) }, stateInfo.name));
            }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, color: "primary" }, "Cancel"))));
};
const mapStateToProps = (state, ownProps) => (Object.assign({ stateInfoState: state.stateInfoState }, ownProps));
const mapDispatchToProps = (dispatch) => ({
    getStateInfo: (parentId) => dispatch(getStateInfo(parentId)),
    setCurrentStateInfo: (stateInfo) => dispatch(setCurrentStateInfo(stateInfo))
});
export default connect(mapStateToProps, mapDispatchToProps)(SelectStatePopup);
