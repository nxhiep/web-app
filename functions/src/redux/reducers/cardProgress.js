"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var Types = _interopRequireWildcard(require("../actions/types"));

var _QuestionProgress = _interopRequireDefault(require("../../models/QuestionProgress"));

var _utils = require("../../utils");

var InitialQuestionProgressState = {
  loading: false,
  data: {},
  error: null,
  list: []
};

var cardProgressReducer = function cardProgressReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialQuestionProgressState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a, _b, _c, _d; // console.log("cardProgressReducer state", state, " ----- action", action);
  // let mapProgress: Map<number, QuestionProgress> = state.data ?? new Map<number, QuestionProgress>();


  var mapProgress = (_a = state.data) !== null && _a !== void 0 ? _a : {};

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        if (action.payload) {
          var list = (_b = action.payload.cardProgressReducer) === null || _b === void 0 ? void 0 : _b.list;

          if (list) {
            list.forEach(value => {
              var qp = _QuestionProgress.default.fromJs(value);

              mapProgress[qp.questionId] = qp;
            });
            state.list = list;
            state.data = mapProgress;
          }
        } // console.log("REHYDRATE cardProgressReducer action", action, state);


        return Object.assign({}, state);
      }

    case Types.GET_CARDS_PROGRESS:
      {
        // console.log("1111111 loading")
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_CARDS_PROGRESS_SUCCESS:
      {
        var questionProgress = (_c = action.data) !== null && _c !== void 0 ? _c : new Array(); // console.log("GET_CARDS_PROGRESS_SUCCESS ", questionProgress, mapProgress);

        if (questionProgress) {
          questionProgress.forEach(p => {
            var progress = _QuestionProgress.default.fromJs(p);

            if (!mapProgress[p.questionId]) {
              state.list.push(progress);
            } else {
              (0, _utils.replaceItem)(state.list, 'id', progress); // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
              // state.list.push(progress);
            }

            mapProgress[p.questionId] = progress;
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapProgress,
          error: null
        });
      }

    case Types.GET_CARDS_PROGRESS_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.UPDATE_QUESTION_PROGRESS:
      {
        var _questionProgress = (_d = action.data) !== null && _d !== void 0 ? _d : new Array(); // console.log("UPDATE_QUESTION_PROGRESS cardProgressReducer action", questionProgress);


        if (mapProgress && _questionProgress) {
          _questionProgress.forEach(p => {
            var progress = _QuestionProgress.default.fromJs(p);

            if (!mapProgress[p.questionId]) {
              state.list.push(progress);
            } else {
              (0, _utils.replaceItem)(state.list, 'id', progress); // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
              // state.list.push(progress);
            }

            mapProgress[p.questionId] = progress;
          });
        }

        return Object.assign(Object.assign({}, state), {
          data: mapProgress
        });
      }

    case Types.GET_QUESTION_PROGRESS_BY_IDS:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_QUESTION_PROGRESS_BY_IDS_SUCCESS:
      {
        var _questionProgress2 = action.data; // console.log("TTTTTTTTT ", questionProgress, mapProgress);

        if (_questionProgress2) {
          _questionProgress2.forEach(p => {
            var progress = _QuestionProgress.default.fromJs(p);

            if (!mapProgress[progress.questionId]) {
              state.list.push(progress);
            } else {
              (0, _utils.replaceItem)(state.list, 'id', progress); // state.list = state.list.filter((item: QuestionProgress) => item.id != progress.id);
              // state.list.push(progress);
            }

            mapProgress[progress.questionId] = progress;
          });
        }

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapProgress,
          error: null
        });
      }

    case Types.GET_QUESTION_PROGRESS_BY_IDS_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.RESET_CARD_IN_TOPIC:
      {
        var topicId = action.topicId;

        if (topicId) {
          state.list.forEach(q => {
            var questionProgress = _QuestionProgress.default.fromJs(q);

            if (questionProgress.parentId == topicId) {
              questionProgress.reset();
              mapProgress[questionProgress.questionId] = questionProgress;
            }
          });
        }

        return Object.assign(Object.assign({}, state), {
          data: mapProgress
        });
      }

    default:
      return state;
  }
};

var _default = cardProgressReducer;
exports.default = _default;