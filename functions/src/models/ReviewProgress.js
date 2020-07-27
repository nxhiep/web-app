"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config"));

var _QuestionProgress = _interopRequireDefault(require("./QuestionProgress"));

class ReviewProgress {
  constructor(questionsProgress) {
    this.total = 0;
    this.boxMap = new Map();
    this.mapQuestionProgress = new Map(); //TODO: test

    this.allQuestionIds = new Array();
    this.weakQuestionIds = new Array();
    this.mediumQuestionIds = new Array();
    this.strongQuestionIds = new Array();
    this.yourFavoriteQuestionIds = new Array();

    if (questionsProgress) {
      this.total = questionsProgress.length;
      questionsProgress.forEach(progress => {
        var _a;

        progress = _QuestionProgress.default.fromJs(progress);
        var questionId = progress.questionId;
        this.mapQuestionProgress.set(questionId, progress);

        if (questionId) {
          var boxNum = progress.boxNum;

          if (boxNum > 2) {
            boxNum = 2;
          }

          if (!this.boxMap.has(boxNum)) {
            this.boxMap.set(boxNum, new Array());
          }

          (_a = this.boxMap.get(boxNum)) === null || _a === void 0 ? void 0 : _a.push(questionId);
          this.allQuestionIds.push(questionId);

          if (progress.getPercentCorrect() < 0.5) {
            this.weakQuestionIds.push(questionId);
          }

          if (progress.getPercentCorrect() >= 0.5 && progress.getPercentCorrect() < 0.8) {
            this.mediumQuestionIds.push(questionId);
          }

          if (progress.getPercentCorrect() > 0.8) {
            this.strongQuestionIds.push(questionId);
          }

          if (progress.bookmark === true) {
            this.yourFavoriteQuestionIds.push(questionId);
          }
        }
      });
    } else {
      console.log('questions empty!');
    }
  }

  notSeenNumber() {
    var _a;

    var list = (_a = this.boxMap.get(0)) !== null && _a !== void 0 ? _a : new Array();
    return list.length;
  }

  familiarNumber() {
    var _a;

    var list = (_a = this.boxMap.get(1)) !== null && _a !== void 0 ? _a : new Array();
    return list.length;
  }

  masteredNumber() {
    var _a;

    var list = (_a = this.boxMap.get(2)) !== null && _a !== void 0 ? _a : new Array();
    return list.length;
  }

  getPercentComplete() {
    return (this.familiarNumber() * 0.5 + this.masteredNumber() * 1) / this.total;
  }

  getTotalQuestionByLevelId(id) {
    return this.getQuestionsIdsByLevelId(id).length;
  }

  getQuestionsIdsByLevelId(id) {
    switch (id) {
      case _config.default.WEAK_QUESTION.id:
        return this.weakQuestionIds;

      case _config.default.MEDIUM_QUESTION.id:
        return this.mediumQuestionIds;

      case _config.default.STRONG_QUESTION.id:
        return this.strongQuestionIds;

      case _config.default.ALL_FAMILIAR_QUESTION.id:
        return this.allQuestionIds;

      case _config.default.YOUR_FAVORITE_QUESTION.id:
        return this.yourFavoriteQuestionIds;

      default:
        return [];
    }
  }

  getCurrentSelectedId() {
    if (this.weakQuestionIds.length > 0) {
      return _config.default.WEAK_QUESTION.id;
    } else if (this.mediumQuestionIds.length > 0) {
      return _config.default.MEDIUM_QUESTION.id;
    } else if (this.strongQuestionIds.length > 0) {
      return _config.default.STRONG_QUESTION.id;
    } else if (this.allQuestionIds.length > 0) {
      return _config.default.ALL_FAMILIAR_QUESTION.id;
    } else if (this.yourFavoriteQuestionIds.length > 0) {
      return _config.default.YOUR_FAVORITE_QUESTION.id;
    }

    return _config.default.WEAK_QUESTION.id;
  }

}

exports.default = ReviewProgress;