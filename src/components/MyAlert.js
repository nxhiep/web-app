import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
export var AlertType;
(function (AlertType) {
    AlertType[AlertType["error"] = 0] = "error";
    AlertType[AlertType["info"] = 1] = "info";
    AlertType[AlertType["success"] = 2] = "success";
    AlertType[AlertType["warning"] = 3] = "warning";
})(AlertType || (AlertType = {}));
const MyAlertUI = ({ msg, alertType, onClose = () => { }, appValueState }) => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        if (appValueState.msg && appValueState.msg.length > 0) {
            setOpen(true);
        }
    }, [appValueState.msg]);
    if (!open) {
        return null;
    }
    let alertTypeStr = 'info';
    let title = 'Info';
    switch (alertType) {
        case AlertType.error:
            alertTypeStr = "error";
            title = "Error";
            break;
        case AlertType.success:
            alertTypeStr = "success";
            title = "Success";
            break;
        case AlertType.warning:
            alertTypeStr = "warning";
            title = "Warning";
            break;
    }
    //TODO: test
    msg = "This is a " + alertTypeStr + " alert — check it out!";
    return (React.createElement("div", { className: "my-alert " + (alertTypeStr) },
        React.createElement(Grid, { container: true, alignItems: "center", justify: "space-between", style: { height: "100%" } },
            React.createElement("span", null),
            React.createElement("div", { className: "content" },
                React.createElement("div", { className: "title" }, title),
                React.createElement("div", { className: "msg" }, msg)),
            React.createElement(IconButton, { onClick: () => { onClose(); setOpen(false); } },
                React.createElement(CloseIcon, { style: { color: 'white' } })))));
};
const mapDispatchToProps = {
// showAlert: (url: string) => showAlert(url),
};
export default connect((state, ownProps) => (Object.assign({ appValueState: state.appValueState }, ownProps)), mapDispatchToProps)(MyAlertUI);
