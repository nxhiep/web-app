"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Widgets = require("./Widgets");

var _errorImageGeneric = _interopRequireDefault(require("../resources/images/error-image-generic.png"));

var Image = (_ref) => {
  var {
    src,
    alt = '',
    width = '',
    height = '',
    onClick = () => {},
    onLoaded = () => {},
    onError: _onError = () => {},
    className
  } = _ref;
  var [loading, setLoading] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    setLoading(true);
  }, [src]);
  var [url, setUrl] = (0, _react.useState)(src);
  console.log(url);
  return /*#__PURE__*/_react.default.createElement("span", {
    className: 'my-image' + (className ? ' ' + className : '')
  }, loading ? /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null) : '', /*#__PURE__*/_react.default.createElement("img", {
    style: loading ? {
      display: 'none'
    } : {},
    src: url,
    alt: alt,
    width: width,
    height: height,
    onLoad: () => {
      onLoaded();
      setLoading(false);
    },
    onError: () => {
      _onError();

      setLoading(false);
      setUrl(_errorImageGeneric.default);
    },
    onClick: onClick
  }));
};

var _default = Image;
exports.default = _default;