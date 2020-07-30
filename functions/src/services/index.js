"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callApi = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _config = _interopRequireDefault(require("../config"));

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var callApi = (_ref) => {
  var {
    method,
    url,
    params
  } = _ref;
  console.log("CALL API ", url);
  return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    (0, _axios.default)({
      baseURL: _config.default.BASE_URL,
      timeout: _config.default.HTTP_REQUEST_TIMEOUT,
      url: url,
      // cancelToken: source.token,
      method: method ? method : 'POST',
      data: params ? params : null
    }).then(response => {
      console.log("ket qua server tra ve Hiep sida:", response);

      if (response.status === _config.default.HTTP_REQUEST_SUCCESSS) {
        resolve(response.data);
      } else {
        reject("failed");
      }
    }).catch(e => {
      console.log("url:", url);
      reject(e);
    });
  }));
};

exports.callApi = callApi;