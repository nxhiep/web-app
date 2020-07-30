"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config.js"));

class Choice {
  constructor() {
    var choice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.id = -1;
    this.content = _config.default.NULL_STRING;
    this.questionId = -1;
    this.isCorrect = false;
    this.selected = false;
    var {
      id,
      content,
      questionId,
      isCorrect,
      selected
    } = choice;
    this.id = id !== null && id !== void 0 ? id : -1;
    this.content = content !== null && content !== void 0 ? content : _config.default.NULL_STRING;
    this.isCorrect = isCorrect !== null && isCorrect !== void 0 ? isCorrect : false;
    this.questionId = questionId !== null && questionId !== void 0 ? questionId : _config.default.NULL_STRING;
    this.selected = selected !== null && selected !== void 0 ? selected : false;
  }

  static fromJS(choiceJS) {
    if (typeof choiceJS === 'string') {
      return JSON.parse(choiceJS, Choice.reviver);
    } else if (typeof choiceJS === 'object') {
      var convert = {};
      var keysOfChoiceJS = Object.keys(choiceJS);
      var valuesOfChoiceJS = Object.values(choiceJS);

      for (var i = 0; i < keysOfChoiceJS.length; i++) {
        var item = keysOfChoiceJS[i];

        if (item === "id" || item === "content" || item === "questionId" || item === "isCorrect" || item === "selected") {
          convert[item] = valuesOfChoiceJS[i];
        }
      }

      return new Choice(convert);
    } else {
      var choice = Object.create(Choice.prototype);
      return Object.assign(choice, choiceJS);
    }
  }

  static reviver(key, value) {
    return key === "" ? Choice.fromJS(value) : value;
  }

}

var _default = Choice;
exports.default = _default;