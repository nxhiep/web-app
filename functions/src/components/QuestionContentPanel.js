"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TextContentType = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireDefault(require("react"));

var _reactHtmlParser = _interopRequireDefault(require("react-html-parser"));

var _reactRedux = require("react-redux");

var _appValue = require("../redux/actions/appValue");

var _Image = _interopRequireDefault(require("./Image"));

var _reactRouterDom = require("react-router-dom");

var TextContentType;
exports.TextContentType = TextContentType;

(function (TextContentType) {
  TextContentType[TextContentType["question"] = 1] = "question";
  TextContentType[TextContentType["answer"] = 2] = "answer";
  TextContentType[TextContentType["explanation"] = 3] = "explanation";
})(TextContentType || (exports.TextContentType = TextContentType = {}));

var QuestionContentPanel = (_ref) => {
  var {
    content,
    image = '',
    type = TextContentType.question,
    showImageDialog,
    appInfoState
  } = _ref;
  var {
    appNameId
  } = (0, _reactRouterDom.useParams)();
  var {
    bucket
  } = appInfoState.data[appNameId !== null && appNameId !== void 0 ? appNameId : ''];
  bucket = bucket !== null && bucket !== void 0 ? bucket : '';
  console.log("QuestionContentPanel bucket ", bucket);
  content = content.replace(/\n/g, "<br/>").replace(/\\u(....)/g, "&#x$1;");

  if (type === TextContentType.question) {
    return /*#__PURE__*/_react.default.createElement(TextContentQuestion, {
      content: content,
      image: image,
      showImageDialog: showImageDialog,
      type: type,
      bucket: bucket
    });
  }

  return /*#__PURE__*/_react.default.createElement(TextContent, {
    content: content,
    type: type,
    bucket: bucket
  });
};

var getUrlImage = (bucket, name) => {
  return 'https://storage.googleapis.com/micro-enigma-235001.appspot.com/' + bucket + '/images/' + name;
};

var TextContent = (_ref2) => {
  var {
    content,
    type,
    bucket
  } = _ref2;
  var result = content.split('$').map(str => {
    if (isImage(str)) {
      var size = getSizeImage(str);
      return '<img style="cursor:pointer;display:inline-block;vertical-align:middle" alt="" src="' + getUrlImage(bucket, str) + '" width="' + size.width + '" height="' + size.height + '" />';
    }

    return str;
  }).join('');
  return /*#__PURE__*/_react.default.createElement("div", {
    style: type == TextContentType.explanation ? {
      marginBottom: '10px'
    } : {}
  }, (0, _reactHtmlParser.default)(result));
};

var TextContentQuestion = (_ref3) => {
  var {
    content,
    image,
    showImageDialog,
    type,
    bucket
  } = _ref3;

  if (!image) {
    if (hasImage(content)) {
      return /*#__PURE__*/_react.default.createElement(TextContent, {
        content: content,
        type: type,
        bucket: bucket
      });
    }

    return /*#__PURE__*/_react.default.createElement("div", null, (0, _reactHtmlParser.default)(content));
  }

  var imageUrl = getUrlImage(bucket, image);
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "flex-start",
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 9
  }, (0, _reactHtmlParser.default)(content)), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 3
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    className: "image-in-question",
    width: "100%",
    src: imageUrl,
    alt: "",
    onClick: () => showImageDialog(imageUrl)
  })));
};

function hasImage(str) {
  return !!str && (str.includes(".png") || str.includes(".jpg") || str.includes(".gif") || str.includes(".tiff") || str.includes(".bmp"));
}

function isImage(str) {
  return !!str && (str.endsWith(".png") || str.endsWith(".jpg") || str.endsWith(".gif") || str.endsWith(".tiff") || str.endsWith(".bmp"));
}

function getSizeImage(str) {
  var i1 = str.indexOf('_'),
      i2 = str.lastIndexOf('.');

  if (i1 > -1 && i2 > -1) {
    var sizeStr = str.substring(i1, i2);
    var i3 = sizeStr.indexOf('_w'),
        i4 = sizeStr.lastIndexOf('_h');
    var width = sizeStr.substring(i3 + 2, i4);
    var height = sizeStr.substring(i4 + 2, sizeStr.length);
    return {
      width: width + 'px',
      height: height + 'px'
    };
  }

  return {
    width: '50px',
    height: '50px'
  };
}

var mapStateToProps = (state, ownProps) => {
  return {
    appInfoState: state.appInfoState
  };
};

var mapDispatchToProps = {
  showImageDialog: url => (0, _appValue.showImageDialog)(url)
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(QuestionContentPanel);

exports.default = _default;