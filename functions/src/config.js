"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

class Config {}

(0, _defineProperty2.default)(Config, "USER_ID", 'kienxxx');
(0, _defineProperty2.default)(Config, "SECRET_KEY", "koolsoft-web");
(0, _defineProperty2.default)(Config, "TEST_MODE", false);
(0, _defineProperty2.default)(Config, "BASE_URL", "https://webappapi-dot-micro-enigma-235001.appspot.com");
(0, _defineProperty2.default)(Config, "NULL_STRING", "");
(0, _defineProperty2.default)(Config, "API_GET_CARDS_BY_IDS", "/get-card-by-ids");
(0, _defineProperty2.default)(Config, "API_GET_CARDS_FOR_TEST_SETTING", "/data?type=get_cards_for_test");
(0, _defineProperty2.default)(Config, "HTTP_REQUEST_TIMEOUT", 30000);
(0, _defineProperty2.default)(Config, "HTTP_REQUEST_SUCCESSS", 200);
(0, _defineProperty2.default)(Config, "HTTP_REQUEST_ERROR", 500);
(0, _defineProperty2.default)(Config, "LIMIT_USER_RATING", 10);
(0, _defineProperty2.default)(Config, "GAME_STATUS_TESTING", 0);
(0, _defineProperty2.default)(Config, "WEAK_QUESTION", {
  id: 1,
  name: 'Weak Question',
  image: require('./resources/images/weak.svg').default
});
(0, _defineProperty2.default)(Config, "MEDIUM_QUESTION", {
  id: 2,
  name: 'Medium Question',
  image: require('./resources/images/medium.svg').default
});
(0, _defineProperty2.default)(Config, "STRONG_QUESTION", {
  id: 3,
  name: 'Strong Question',
  image: require('./resources/images/strong.svg').default
});
(0, _defineProperty2.default)(Config, "ALL_FAMILIAR_QUESTION", {
  id: 4,
  name: 'All Familiar Question',
  image: require('./resources/images/test.svg').default
});
(0, _defineProperty2.default)(Config, "YOUR_FAVORITE_QUESTION", {
  id: 5,
  name: 'Your Favorite Question',
  image: require('./resources/images/heart.svg').default
});
(0, _defineProperty2.default)(Config, "LEVEL_QUESTION", [Config.WEAK_QUESTION, Config.MEDIUM_QUESTION, Config.STRONG_QUESTION, Config.ALL_FAMILIAR_QUESTION, Config.YOUR_FAVORITE_QUESTION]);
(0, _defineProperty2.default)(Config, "STUDY_GAME", 0);
(0, _defineProperty2.default)(Config, "TEST_GAME", 1);
(0, _defineProperty2.default)(Config, "REVIEW_GAME", 2);
(0, _defineProperty2.default)(Config, "GAME_STATUS_FAILED", -1);
(0, _defineProperty2.default)(Config, "GAME_STATUS_TESTING", 0);
(0, _defineProperty2.default)(Config, "GAME_STATUS_PASSED", 1);
(0, _defineProperty2.default)(Config, "QUESTION_NOT_ANSWERED", 0);
(0, _defineProperty2.default)(Config, "QUESTION_ANSWERED_INCORRECT", 1);
(0, _defineProperty2.default)(Config, "QUESTION_ANSWERED_CORRECT", 2);
(0, _defineProperty2.default)(Config, "QUESTION_ANSWERED_SKIP", 3);
(0, _defineProperty2.default)(Config, "START_STATUS", 0);
(0, _defineProperty2.default)(Config, "PLAYING_STATUS", 1);
(0, _defineProperty2.default)(Config, "FINISHED_STATUS", 2);
(0, _defineProperty2.default)(Config, "NEXT_PART_PROGRESS", 50);
(0, _defineProperty2.default)(Config, "TEST_TOTAL_QUESTION", 50);
(0, _defineProperty2.default)(Config, "TEST_ALLOW_MISTAKE", 15);
var _default = Config;
exports.default = _default;