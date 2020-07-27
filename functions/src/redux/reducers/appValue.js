"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AppValueState = void 0;

var Types = _interopRequireWildcard(require("../actions"));

var _MyAlert = require("./../../components/MyAlert");

class AppValueState {
  constructor(props) {
    var _a, _b, _c, _d;

    this.image = (_a = props === null || props === void 0 ? void 0 : props.image) !== null && _a !== void 0 ? _a : "";
    this.msg = (_b = props === null || props === void 0 ? void 0 : props.msg) !== null && _b !== void 0 ? _b : "";
    this.alertType = (_c = props === null || props === void 0 ? void 0 : props.alertType) !== null && _c !== void 0 ? _c : _MyAlert.AlertType.info;
    this.onClose = (_d = props === null || props === void 0 ? void 0 : props.onClose) !== null && _d !== void 0 ? _d : function () {};
  }

  static init() {
    return new AppValueState();
  }

}

exports.AppValueState = AppValueState;

var appValueState = function appValueState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : AppValueState.init();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case Types.SHOW_IMAGE_DIALOG:
      {
        return Object.assign(Object.assign({}, state), {
          image: action.url
        });
      }

    case Types.SHOW_ALERT:
      {
        return Object.assign(Object.assign({}, state), {
          msg: action.msg,
          alertType: action.alertType,
          onClose: action.onClose
        });
      }

    default:
      return state;
  }
};

var _default = appValueState;
exports.default = _default;