"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _actions = require("../redux/actions");

var _Widgets = require("./Widgets");

var _Utils = require("../models/Utils");

var Transition = /*#__PURE__*/_react.default.forwardRef(function Transition(props, ref) {
  return /*#__PURE__*/_react.default.createElement(_core.Slide, Object.assign({
    direction: "up",
    ref: ref
  }, props));
});

var SelectStatePopup = (_ref) => {
  var {
    stateInfoState,
    getStateInfo,
    setCurrentStateInfo,
    appInfo,
    openPopupChangeState,
    onHidden
  } = _ref;
  console.log("SelectStatePopup stateInfoState", stateInfoState);
  var [open, setOpen] = (0, _react.useState)(!stateInfoState.mapCurrentStateInfo[appInfo.id]);
  (0, _react.useEffect)(() => {
    if (appInfo.hasState) {
      getStateInfo(appInfo.id);
    }
  }, [getStateInfo, appInfo]);
  (0, _react.useEffect)(() => {
    if (appInfo.hasState && openPopupChangeState) {
      setOpen(true);
      (0, _Utils.onScrollElementAtParentElement)('.state-item.active', '.select-state-popup .MuiDialog-scrollPaper');
    } // TODO
    // let x = document.querySelector('[role="none presentation"]');
    // console.log('none-presentation', x);
    // if(x) {
    //     x.setAttribute('role', 'dialog');
    // }

  }, [openPopupChangeState, appInfo]);

  var handleClose = () => {
    setOpen(false);
  };

  var selectStateHandle = stateInfo => {
    setCurrentStateInfo(stateInfo);
    setOpen(false);
  };

  var stateInfos = stateInfoState.list;
  var currentStateInfo = stateInfoState.mapCurrentStateInfo[appInfo.id];
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    onExit: () => {
      onHidden && onHidden();
    },
    fullWidth: true,
    className: "select-state-popup",
    open: open,
    TransitionComponent: Transition,
    keepMounted: true,
    onClose: handleClose,
    role: "dialog"
  }, /*#__PURE__*/_react.default.createElement(_core.DialogTitle, {
    id: "alert-dialog-slide-title"
  }, "Select state"), /*#__PURE__*/_react.default.createElement(_core.DialogContent, {
    role: "dialog"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "state-info-panel"
  }, stateInfoState.loading == true || !stateInfos ? /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null) : stateInfos.sort((a, b) => a.name.localeCompare(b.name)).map(stateInfo => {
    return /*#__PURE__*/_react.default.createElement(_core.Button, {
      className: 'state-item' + (currentStateInfo && currentStateInfo.id == stateInfo.id ? ' active' : ''),
      key: 'state-item-' + stateInfo.id,
      variant: "outlined",
      onClick: () => selectStateHandle(stateInfo)
    }, stateInfo.name);
  }))), /*#__PURE__*/_react.default.createElement(_core.DialogActions, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: handleClose,
    color: "primary"
  }, "Cancel")));
};

var mapStateToProps = (state, ownProps) => Object.assign({
  stateInfoState: state.stateInfoState
}, ownProps);

var mapDispatchToProps = dispatch => ({
  getStateInfo: parentId => dispatch((0, _actions.getStateInfo)(parentId)),
  setCurrentStateInfo: stateInfo => dispatch((0, _actions.setCurrentStateInfo)(stateInfo))
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SelectStatePopup);

exports.default = _default;