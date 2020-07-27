"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config.js"));

class Progress {
  constructor(props) {
    var _a, _b, _c, _d, _e, _f, _g;

    this.done = (_a = props.done) !== null && _a !== void 0 ? _a : 0;
    this.notDone = (_b = props.notDone) !== null && _b !== void 0 ? _b : 0;
    this.mistake = (_c = props.mistake) !== null && _c !== void 0 ? _c : 0;
    this.skipped = (_d = props.skipped) !== null && _d !== void 0 ? _d : 0;
    this.correct = (_e = props.correct) !== null && _e !== void 0 ? _e : 0;
    this.mapBoxNum = (_f = props.mapBoxNum) !== null && _f !== void 0 ? _f : new Map();
    this.total = (_g = props.total) !== null && _g !== void 0 ? _g : 0;
  }

  static init() {
    return new Progress({
      done: 0,
      notDone: 0,
      correct: 0,
      mistake: 0,
      skipped: 0,
      mapBoxNum: new Map(),
      total: 0
    });
  }

  static calcProgress(questions) {
    var mapBoxNum = new Map();
    var total = questions.length;
    var done = 0,
        notDone = 0,
        mistake = 0,
        skipped = 0,
        correct = 0;

    for (var i = 0; i < total; i++) {
      var question = questions[i];
      var progress = question.progress;
      var boxNum = progress.boxNum;

      if (boxNum > 2) {
        boxNum = 2;
      }

      if (!mapBoxNum.has(boxNum)) {
        mapBoxNum.set(boxNum, new Array());
      } // let array: Array<Question> = mapBoxNum.get(boxNum);
      // console.log("arrayz", array);
      // array.push(question);


      mapBoxNum.get(boxNum).push(question);

      if (question.questionStatus === _config.default.QUESTION_NOT_ANSWERED) {
        notDone++;
      } else {
        if (question.questionStatus === _config.default.QUESTION_ANSWERED_SKIP) skipped++;
        done++;

        if (question.questionStatus === _config.default.QUESTION_ANSWERED_CORRECT) {
          correct++;
        } else {
          mistake++;
        }
      }
    }

    return new Progress({
      done,
      notDone,
      correct,
      mistake,
      skipped,
      mapBoxNum,
      total
    });
  }

  getNotSeenNumber() {
    var _a, _b;

    return (_b = (_a = this.mapBoxNum.get(0)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
  }

  getFamiliarNumber() {
    var _a, _b;

    return (_b = (_a = this.mapBoxNum.get(1)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
  }

  getMasteredNumber() {
    var _a, _b;

    return (_b = (_a = this.mapBoxNum.get(2)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
  }

  getPercentComplete() {
    if (!this.total) {
      alert('getPercentComplete in game.js: this.total == 0');
    }

    return (this.getFamiliarNumber() * 0.5 + this.getMasteredNumber() * 1) / this.total;
  }

}

var _default = Progress;
exports.default = _default;