"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxPersist = require("redux-persist");

var _QuestionX = _interopRequireDefault(require("../../models/QuestionX"));

var Types = _interopRequireWildcard(require("../actions/types"));

var _utils = require("../../utils");

var initialState = {
  loading: false,
  data: {},
  list: new Array(),
  error: null
};

var cardReducer = function cardReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var _a, _b; // console.log("cardReducer action ", action, '\nstate', state);
  // let mapCards = state.data ?? new Map<number, Map<number, Question>>();


  var mapQuestion = (_a = state.data) !== null && _a !== void 0 ? _a : {};

  switch (action.type) {
    case _reduxPersist.REHYDRATE:
      {
        if (action.payload) {
          var list = (_b = action.payload.cardReducer) === null || _b === void 0 ? void 0 : _b.list;

          if (list) {
            list.forEach(value => {
              var qs = _QuestionX.default.fromJs(value);

              mapQuestion[qs.id] = qs;
            });
            state.list = list;
            state.data = mapQuestion;
          }
        }

        return Object.assign({}, state);
      }

    case Types.GET_CARDS_BY_PARENT_ID:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_CARDS_BY_PARENT_ID_SUCCESS:
      {
        var cards = action.data;
        cards.forEach(card => {
          if (!mapQuestion[card.id]) {
            state.list.push(card);
          } else {
            (0, _utils.replaceItem)(state.list, 'id', card); // state.list = state.list.filter((item: Question) => item.id != card.id);
            // state.list.push(card);
          }

          mapQuestion[card.id] = card;
        });
        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapQuestion,
          error: null
        });
      }

    case Types.GET_CARDS_BY_PARENT_ID_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    case Types.GET_CARDS_BY_IDS:
      {
        return Object.assign(Object.assign({}, state), {
          loading: true
        });
      }

    case Types.GET_CARDS_BY_IDS_SUCCESS:
      {
        // let cards: Array<Question> = action.data;
        // let mapCard: Map<number, Question> = new Map<number, Question>();
        // cards.forEach((card: Question) => mapCard.set(card.id, card));
        // mapCards.set(action.parentId, mapCard);
        var _cards = action.data;

        _cards.forEach(card => {
          if (!mapQuestion[card.id]) {
            state.list.push(card);
          } else {
            (0, _utils.replaceItem)(state.list, 'id', card); // state.list = state.list.filter((item: Question) => item.id != card.id);
            // state.list.push(card);
          }

          mapQuestion[card.id] = card;
        });

        return Object.assign(Object.assign({}, state), {
          loading: false,
          data: mapQuestion,
          error: null
        });
      }

    case Types.GET_CARDS_BY_IDS_FAILURE:
      {
        return Object.assign(Object.assign({}, state), {
          loading: false,
          error: action.error
        });
      }

    default:
      return state;
  }
};

var _default = cardReducer;
exports.default = _default;