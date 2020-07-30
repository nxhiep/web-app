"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showImageDialog = showImageDialog;
exports.showAlert = showAlert;

var Types = _interopRequireWildcard(require("./types"));

var XXX = "xxx";

function showImageDialog(url) {
  return {
    type: Types.SHOW_IMAGE_DIALOG,
    url: url
  };
}

function showAlert(msg, alertType, onClose) {
  return {
    type: Types.SHOW_ALERT,
    msg: msg,
    alertType: alertType,
    onClose: onClose
  };
}