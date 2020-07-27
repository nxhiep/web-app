"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../config.js"));

var _utils = require("../utils.js");

var _Choice = _interopRequireDefault(require("./Choice"));

var _QuestionProgress = _interopRequireDefault(require("./QuestionProgress"));

class Question {
  constructor() {
    var questionJS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // console.log("ggggggggg questionJS", questionJS)
    var {
      question,
      hint,
      image,
      sound,
      explanation,
      answers,
      choices,
      lastUpdate,
      userId,
      _id,
      parentId,
      categoryId,
      questionStatus,
      id,
      progress,
      index,
      topicQuestion,
      listChoices,
      paragraphId,
      quiz
    } = questionJS;
    this.question = question !== null && question !== void 0 ? question : "";
    this.hint = hint !== null && hint !== void 0 ? hint : "";
    this.image = image !== null && image !== void 0 ? image : "";
    this.sound = sound !== null && sound !== void 0 ? sound : "";
    this.explanation = explanation !== null && explanation !== void 0 ? explanation : "";
    this.quiz = quiz;
    this.paragraphContent = quiz && quiz.description ? quiz.description : '';
    this.paragraphId = paragraphId !== null && paragraphId !== void 0 ? paragraphId : -1; // this.choices = choices ?? "";

    this.lastUpdate = lastUpdate !== null && lastUpdate !== void 0 ? lastUpdate : new Date().getTime();
    this.userId = userId !== null && userId !== void 0 ? userId : ""; // this._id = _id ?? "";

    this.categoryId = categoryId !== null && categoryId !== void 0 ? categoryId : -1;
    this.questionStatus = questionStatus !== null && questionStatus !== void 0 ? questionStatus : _config.default.QUESTION_NOT_ANSWERED;
    this.id = id !== null && id !== void 0 ? id : _id !== null && _id !== void 0 ? _id : -1;
    this.lastUpdate = new Date().getTime();
    this.choices = this.getListChoices(answers, choices, this.id);

    if (!(this.choices && this.choices.length > 0) && listChoices && listChoices.length > 0) {
      this.choices = [];
      listChoices.forEach(choice => {
        this.choices.push(_Choice.default.fromJS({
          content: choice.choice,
          isCorrect: choice.isCorrect,
          id: choice.id,
          questionId: this.id,
          selected: choice.selected
        }));
      });
    }

    this.correctNums = this.getCorrectNum();
    this.rootTopicId = parentId;
    this.parentId = -1;
    this.topicQuestion = topicQuestion;

    if (topicQuestion && topicQuestion.parentId) {
      this.parentId = topicQuestion.parentId;
    }

    if (progress) {
      this.progress = _QuestionProgress.default.fromJs(progress);
    } else {
      this.progress = _QuestionProgress.default.init(this.parentId, id, _config.default.USER_ID);
    }

    this.index = index;
  }

  getListChoices(answers, choices, questionId) {
    var _a;

    var listChoices = new Array();

    if (answers && choices) {
      for (var i = 0; i < answers.length; i++) {
        var correctChoice = _Choice.default.fromJS(Object.assign({}, {
          content: answers[i],
          isCorrect: true,
          questionId: questionId,
          id: listChoices.length
        }));

        listChoices.push(correctChoice);
      }

      for (var _i = 0; _i < choices.length; _i++) {
        var wrongChoice = _Choice.default.fromJS(Object.assign({}, {
          content: choices[_i],
          isCorrect: false,
          questionId: questionId,
          id: listChoices.length
        }));

        listChoices.push(wrongChoice);
      }
    } else if (choices) {
      for (var _i2 = 0; _i2 < choices.length; _i2++) {
        var _wrongChoice = _Choice.default.fromJS(Object.assign({}, {
          content: choices[_i2]['content'],
          isCorrect: choices[_i2]['isCorrect'],
          questionId: choices[_i2]['questionId'],
          selected: !!choices[_i2]['selected'],
          id: (_a = choices[_i2]['id']) !== null && _a !== void 0 ? _a : _i2
        }));

        listChoices.push(_wrongChoice);
      }
    } else {
      console.error("answers && choices = null", answers, choices);
    }

    return (0, _utils.shuffle)(listChoices);
  }

  getCorrectNum() {
    this.correctNums = 0;

    for (var i = 0; i < this.choices.length; i++) {
      if (this.choices[i].isCorrect) this.correctNums++;
    }

    return this.correctNums;
  }

  static fromJs(questionJS) {
    if (typeof questionJS === 'string') {
      return new Question(JSON.parse(questionJS, Question.reviver));
    } else {
      var question = Object.create(Question.prototype);
      return new Question(Object.assign(question, questionJS));
    }
  }

  getNumberChoiceSelected() {
    var num = 0;

    for (var i = 0; i < this.choices.length; i++) {
      if (this.choices[i].selected) num++;
    }

    return num;
  }

  updateQuestionProgress(listChoiceSelected) {
    this.lastUpdate = new Date().getTime();
    var correctNum = 0;

    for (var i = 0; i < listChoiceSelected.length; i++) {
      var choiceUpdate = listChoiceSelected[i];
      if (choiceUpdate.isCorrect) correctNum++;
    }

    this.questionStatus = correctNum === this.correctNums ? _config.default.QUESTION_ANSWERED_CORRECT : _config.default.QUESTION_ANSWERED_INCORRECT;
    this.progress.updateProgress(correctNum === this.correctNums);
    this.progress.status = this.questionStatus;
  }

  reset() {
    this.questionStatus = _config.default.QUESTION_NOT_ANSWERED;
    this.progress.status = _config.default.QUESTION_NOT_ANSWERED;

    for (var index = 0; index < this.choices.length; index++) {
      this.choices[index].selected = false;
    }
  }

  static reviver(key, value) {
    return key === "" ? _Choice.default.fromJS(value) : value;
  }

  updateTestProgress(listChoiceSelected) {
    var correctNum = 0;

    for (var i = 0; i < listChoiceSelected.length; i++) {
      var choiceUpdate = listChoiceSelected[i];
      if (choiceUpdate.isCorrect) correctNum++;
    }

    this.questionStatus = correctNum === this.correctNums ? _config.default.QUESTION_ANSWERED_CORRECT : _config.default.QUESTION_ANSWERED_INCORRECT;
    this.progress.updateTestProgress(correctNum === this.correctNums);
    this.progress.status = this.questionStatus;
  }

}

var _default = Question;
exports.default = _default;