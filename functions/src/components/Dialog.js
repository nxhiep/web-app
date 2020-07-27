"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShowImage = exports.AlertDialogSlide = exports.DialogInfo = void 0;

var _core = require("@material-ui/core");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));

var _DialogActions = _interopRequireDefault(require("@material-ui/core/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@material-ui/core/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));

var _Slide = _interopRequireDefault(require("@material-ui/core/Slide"));

var _icons = require("@material-ui/icons");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _appValue = require("../redux/actions/appValue");

var Transition = /*#__PURE__*/_react.default.forwardRef(function Transition(props, ref) {
  return /*#__PURE__*/_react.default.createElement(_Slide.default, Object.assign({
    direction: "up",
    ref: ref
  }, props));
});

class DialogInfo {
  constructor(props) {
    var {
      title,
      msg,
      okText,
      cancelText,
      autoHide = true,
      onConfirm = () => {},
      showDialogKey
    } = props;
    this.title = title;
    this.msg = msg;
    this.okText = okText;
    this.cancelText = cancelText;
    this.autoHide = autoHide;
    this.onConfirm = onConfirm;
    this.showDialogKey = showDialogKey == -1 ? -1 : new Date().getTime();
  }

  static init() {
    return new DialogInfo({
      title: '',
      msg: '',
      showDialogKey: -1
    });
  }

}

exports.DialogInfo = DialogInfo;

var AlertDialogSlide = (_ref) => {
  var {
    dialogInfo
  } = _ref;
  var {
    title,
    msg,
    okText,
    cancelText,
    autoHide = true,
    showDialogKey,
    onConfirm = () => {}
  } = dialogInfo;
  var [open, setOpen] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if (showDialogKey != -1) {
      setOpen(true);
    }
  }, [showDialogKey]);

  var handleClose = () => {
    if (onConfirm) {
      onConfirm(false);
    }

    setOpen(false);
  };

  var handleAgree = () => {
    if (onConfirm) {
      onConfirm(true);
    }

    if (autoHide) {
      setOpen(false);
    }
  };

  return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: open,
    TransitionComponent: Transition,
    keepMounted: true,
    onClose: handleClose,
    "aria-labelledby": "alert-dialog-slide-title",
    "aria-describedby": "alert-dialog-slide-description"
  }, title ? /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
    id: "alert-dialog-slide-title"
  }, title) : '', msg ? /*#__PURE__*/_react.default.createElement(_DialogContent.default, null, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, {
    id: "alert-dialog-slide-description"
  }, msg)) : '', /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, cancelText !== undefined ? /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleClose,
    color: "primary"
  }, cancelText ? cancelText : 'Cancel') : '', okText !== undefined ? /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleAgree,
    color: "primary"
  }, okText ? okText : 'Ok') : ''));
};

exports.AlertDialogSlide = AlertDialogSlide;

var ShowImageUI = (_ref2) => {
  var {
    appValueState,
    showImageDialog
  } = _ref2;
  var [open, setOpen] = (0, _react.useState)(false); // console.log("******************* appValueState ", appValueState);

  (0, _react.useEffect)(() => {
    window.onpopstate = e => {
      console.log("back button ************** open", open);
      showImageDialog('');
    };

    if (appValueState.image && appValueState.image.length > 0) {
      setOpen(true);
    }
  }, [appValueState]);

  var handleClose = () => {
    setOpen(false);
    showImageDialog('');
  };

  var isMobile = window.innerWidth <= 500;
  return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    onClose: handleClose,
    "aria-labelledby": "simple-dialog-title",
    open: open
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: isMobile ? '100%' : 500,
      position: 'relative'
    }
  }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    onClick: handleClose,
    "aria-label": "close",
    style: {
      position: 'absolute',
      'top': 0,
      right: '0'
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.Close, {
    fontSize: "small",
    style: {
      color: 'red'
    }
  })), /*#__PURE__*/_react.default.createElement("img", {
    width: "100%",
    src: appValueState.image,
    alt: ""
  })));
};

var mapDispatchToProps = {
  showImageDialog: url => (0, _appValue.showImageDialog)(url)
};
var ShowImage = (0, _reactRedux.connect)((state, ownProps) => Object.assign({
  appValueState: state.appValueState
}, ownProps), mapDispatchToProps)(ShowImageUI);
exports.ShowImage = ShowImage;