"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TitleBlock = TitleBlock;
exports.FixedContainer = FixedContainer;
exports.SearchTextBox = SearchTextBox;
exports.RatingWidget = RatingWidget;
exports.RatingPanel = RatingPanel;
exports.LoadingWidget = LoadingWidget;
exports.MainWidget = MainWidget;
exports.TabPanel = TabPanel;
exports.LineProgress = LineProgress;

var _core = require("@material-ui/core");

var _icons = require("@material-ui/icons");

var _Rating = _interopRequireDefault(require("@material-ui/lab/Rating"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Image = _interopRequireDefault(require("./Image"));

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

function FixedContainer(props) {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Container, {
    fixed: true,
    className: 'fixed-container' + (props.className ? ' ' + props.className : ''),
    style: props.style
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    component: "div",
    style: {}
  }, props.children)));
}

;

function SearchTextBox(props) {
  var [value, setValue] = (0, _react.useState)("");
  var history = (0, _reactRouterDom.useHistory)();

  var onSearch = () => {
    console.log("SEARCH_SCREEN"); // window.location.href = Routes.SEARCH_SCREEN + '?v=' + value;
    // history.push(Routes.SEARCH_SCREEN + '?appId='+appId+'&v=' + value);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: 'search-panel',
    style: {
      backgroundColor: props.backgroundColor
    }
  }, /*#__PURE__*/_react.default.createElement(_core.InputBase, {
    placeholder: "Search for anything...",
    className: 'search-box',
    onChange: event => {
      setValue(event.target.value);
    },
    onKeyDown: event => {
      if (event.keyCode === 13) {
        onSearch();
      }
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    type: "submit",
    className: 'search-button',
    "aria-label": "search",
    onClick: onSearch
  }, /*#__PURE__*/_react.default.createElement(_icons.Search, null)));
}

;

function RatingWidget(_ref) {
  var {
    values = [],
    className = '',
    size = ''
  } = _ref;
  size = size ? size : "medium";
  var total = 0;
  var value = 0;
  values.forEach((item, index) => {
    if (index > 0) {
      value += item * index;
      total += item;
    }
  });

  if (value > 0 && total > 0) {
    value = Math.round(value / total * 10) / 10;
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: className
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: "star-panel",
    container: true,
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    name: "half-rating",
    max: 5,
    precision: 0.5,
    value: value,
    readOnly: true,
    size: "small"
  }), /*#__PURE__*/_react.default.createElement("div", null, value)), /*#__PURE__*/_react.default.createElement("div", {
    className: "total-ratings"
  }, "(", total, " ratings)"));
}

;

function RatingPanel(_ref2) {
  var {
    values = [],
    onWriteReview = () => {}
  } = _ref2;
  var total = 0;
  var value = 0;
  values.forEach((item, index) => {
    if (index > 0) {
      value += item * index;
      total += item;
    }
  });

  if (value > 0 && total > 0) {
    value = Math.round(value / total * 10) / 10;
  }

  var listCenter = [];
  var listRight = [];

  for (var number = 1; number < 6; number++) {
    var element = values[number] ? values[number] : 0;
    var percent = total > 0 ? element / total * 100 : 0;
    listCenter.push( /*#__PURE__*/_react.default.createElement(_core.Box, {
      key: 'rate-center-item-' + number,
      className: 'rate-item-center'
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: 'rate-value',
      style: {
        width: percent + "%"
      }
    })));
    listRight.push( /*#__PURE__*/_react.default.createElement(_core.Grid, {
      key: 'rate-right-item-' + number,
      className: "rate-item-right",
      container: true,
      direction: "row",
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
      name: "half-rating",
      max: 5,
      precision: 1,
      value: value,
      readOnly: true
    }), /*#__PURE__*/_react.default.createElement("div", null, Math.round(percent * 10) / 10, "%")));
  }

  var [writeReview, setWriteReview] = (0, _react.useState)(false);
  var [rateValue, setRateValue] = (0, _react.useState)(0);
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "column",
    alignItems: "flex-end"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "contained",
    color: "primary",
    onClick: () => {
      setWriteReview(!writeReview);
    }
  }, "Write Review"), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: "rating-panel",
    container: true,
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: 'first-info'
  }, /*#__PURE__*/_react.default.createElement("h1", null, value), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    name: "half-rating",
    max: 5,
    precision: 0.5,
    value: value,
    readOnly: true
  }), /*#__PURE__*/_react.default.createElement("div", null, value))), /*#__PURE__*/_react.default.createElement("div", {
    className: 'second-info'
  }, listCenter.reverse()), /*#__PURE__*/_react.default.createElement("div", {
    className: 'three-info'
  }, listRight.reverse())), /*#__PURE__*/_react.default.createElement(_core.Box, {
    component: 'div',
    style: {
      display: writeReview ? 'block' : 'none',
      width: '100%',
      border: '1px solid #ddd',
      padding: '10px'
    }
  }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    name: "half-rating",
    max: 5,
    precision: 0.5,
    value: rateValue,
    onChange: event => {
      setRateValue(parseInt(event.target.value));
    }
  }), /*#__PURE__*/_react.default.createElement(TextAreaWidget, {
    onChange: content => {
      if (!rateValue || rateValue < 1) {
        window.alert('what the hell? rateValue = ' + rateValue);
        return;
      }

      onWriteReview(content, rateValue);
    }
  })));
}

;

function LoadingWidget(props) {
  var {
    color,
    width,
    height,
    fixed
  } = props;

  if (!color) {
    color = "var(--main-color)";
  }

  var style = {
    color: color,
    textAlign: "center",
    margin: "15px auto"
  };

  if (width) {
    style.width = width;
  }

  if (height) {
    style.height = height;
  }

  if (fixed) {
    return /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      justify: "center",
      alignItems: "center",
      style: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        backgroundColor: 'white'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: style
    }, /*#__PURE__*/_react.default.createElement(_core.CircularProgress, {
      style: {
        color: 'var(--main-color)'
      }
    })));
  }

  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    justify: "center",
    alignItems: "center",
    style: style
  }, /*#__PURE__*/_react.default.createElement(_core.CircularProgress, {
    color: "inherit"
  }));
}

;

function TextAreaWidget(_ref3) {
  var {
    onChange
  } = _ref3;
  var [value, setvalue] = (0, _react.useState)("");
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: 'text-area-widget',
    container: true,
    direction: "row"
  }, /*#__PURE__*/_react.default.createElement(_core.Box, {
    className: 'text-area-i-p'
  }, /*#__PURE__*/_react.default.createElement(_core.TextareaAutosize, {
    className: 'text-area-i',
    placeholder: "Enter to text...",
    onChange: event => setvalue(event.target.value)
  })), /*#__PURE__*/_react.default.createElement(_core.Fab, {
    className: 'button-write-review',
    color: "primary",
    "aria-label": "add",
    onClick: () => {
      onChange(value);
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.Send, {
    className: 'icon'
  })));
}

;

function MainWidget(props) {
  var className = props.className;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: 'body-panel' + (className ? ' ' + className : '')
  }, props.children);
}

;

function TabPanel(props) {
  var {
    children,
    value,
    index
  } = props,
      other = __rest(props, ["children", "value", "index"]);

  return /*#__PURE__*/_react.default.createElement(_core.Typography, Object.assign({
    component: "div",
    role: "tabpanel",
    hidden: value !== index,
    id: "scrollable-auto-tabpanel-".concat(index),
    "aria-labelledby": "scrollable-auto-tab-".concat(index)
  }, other), value === index && /*#__PURE__*/_react.default.createElement(_core.Box, {
    p: 3
  }, children));
}

;

function LineProgress(_ref4) {
  var {
    percent,
    size
  } = _ref4;
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: "parent-line-progress-panel",
    container: true,
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "line-progress-panel",
    style: {
      'height': size,
      'width': 'calc(100% - 40px)'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      'width': percent + '%'
    },
    className: "content-line-progress-panel"
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      'width': '40px',
      'textAlign': 'right'
    }
  }, percent, "%"));
}

;

function TitleBlock(_ref5) {
  var {
    title = '',
    description = '',
    image = ''
  } = _ref5;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "title-block"
  }, image ? /*#__PURE__*/_react.default.createElement(_Image.default, {
    src: image
  }) : '', /*#__PURE__*/_react.default.createElement("h2", {
    className: "title"
  }, title), description ? /*#__PURE__*/_react.default.createElement("p", {
    className: "description"
  }, description) : '');
}

;