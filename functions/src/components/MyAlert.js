"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AlertType = void 0;

var _core = require("@material-ui/core");

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var AlertType;
exports.AlertType = AlertType;

(function (AlertType) {
  AlertType[AlertType["error"] = 0] = "error";
  AlertType[AlertType["info"] = 1] = "info";
  AlertType[AlertType["success"] = 2] = "success";
  AlertType[AlertType["warning"] = 3] = "warning";
})(AlertType || (exports.AlertType = AlertType = {}));

var MyAlertUI = (_ref) => {
  var {
    msg,
    alertType,
    onClose = () => {},
    appValueState
  } = _ref;
  var [open, setOpen] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    if (appValueState.msg && appValueState.msg.length > 0) {
      setOpen(true);
    }
  }, [appValueState.msg]);

  if (!open) {
    return null;
  }

  var alertTypeStr = 'info';
  var title = 'Info';

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
  } //TODO: test


  msg = "This is a " + alertTypeStr + " alert — check it out!";
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "my-alert " + alertTypeStr
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    justify: "space-between",
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement("span", null), /*#__PURE__*/_react.default.createElement("div", {
    className: "content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "title"
  }, title), /*#__PURE__*/_react.default.createElement("div", {
    className: "msg"
  }, msg)), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    onClick: () => {
      onClose();
      setOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.Close, {
    style: {
      color: 'white'
    }
  }))));
};

var mapDispatchToProps = {// showAlert: (url: string) => showAlert(url),
};

var _default = (0, _reactRedux.connect)((state, ownProps) => Object.assign({
  appValueState: state.appValueState
}, ownProps), mapDispatchToProps)(MyAlertUI);

exports.default = _default;