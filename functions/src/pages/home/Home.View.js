"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Rating = _interopRequireDefault(require("@material-ui/lab/Rating"));

var _react = _interopRequireWildcard(require("react"));

var _reactHtmlParser = _interopRequireDefault(require("react-html-parser"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _reactSlick = _interopRequireDefault(require("react-slick"));

var _Footer = _interopRequireDefault(require("../../components/Footer"));

var _Header = _interopRequireDefault(require("../../components/Header"));

var _Image = _interopRequireDefault(require("../../components/Image"));

var _SelectStatePopup = _interopRequireDefault(require("../../components/SelectStatePopup"));

var _Widgets = require("../../components/Widgets");

var _Utils = require("../../models/Utils");

var _actions = require("../../redux/actions");

var _appStoreIcon = _interopRequireDefault(require("../../resources/images/app-store-icon.png"));

var _googlePlayIcon = _interopRequireDefault(require("../../resources/images/google-play-icon.png"));

require("../../resources/scss/home.scss");

require("../../resources/scss/main.scss");

var _utils = require("../../utils");

var _HomeContent = _interopRequireDefault(require("./HomeContent"));

var _reactGa = _interopRequireDefault(require("react-ga"));

var HomeViewScreen = (_ref) => {
  var _appInfo$appName, _appInfo$appName2;

  var {
    appInfoState,
    getAppInfo,
    stateInfoState
  } = _ref;

  var _a, _b;

  var [openPopupChangeState, setOpenPopupChangeState] = (0, _react.useState)(false);
  var {
    appNameId
  } = (0, _reactRouterDom.useParams)(); // console.log("appNameId", appNameId);

  if (!appNameId) {
    appNameId = '';
  }

  var theme = (0, _styles.useTheme)();
  var isMobile = (0, _useMediaQuery.default)(theme.breakpoints.down('sm'));
  (0, _react.useEffect)(() => {
    getAppInfo(appNameId);

    if (isMobile) {
      (0, _Utils.scrollToTop)();
    }
  }, []);
  var appInfo = appInfoState.data[appNameId];
  (0, _react.useEffect)(() => {
    if (appInfo) {
      (0, _Utils.setSEOContent)({
        title: appInfo.title,
        description: appInfo.description,
        keywords: appInfo.keywords,
        icon: appInfo.avatar
      });

      _reactGa.default.pageview('/homepage/' + appInfo.title);
    }
  }, [appInfo]);

  if (!appInfo) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var parentId = appInfo.id;

  if (appInfo && appInfo.hasState && stateInfoState.mapCurrentStateInfo[appInfo.id]) {
    parentId = stateInfoState.mapCurrentStateInfo[appInfo.id].id;
  }

  return /*#__PURE__*/_react.default.createElement(_Widgets.MainWidget, null, /*#__PURE__*/_react.default.createElement(_Header.default, {
    alt: (_appInfo$appName = appInfo.appName) !== null && _appInfo$appName !== void 0 ? _appInfo$appName : appInfo.title
  }), /*#__PURE__*/_react.default.createElement(AppInfoWidget, {
    appNameId: appNameId
  }), /*#__PURE__*/_react.default.createElement(_HomeContent.default, {
    parentId: parentId,
    appNameId: appNameId,
    hasState: appInfo && appInfo.hasState,
    onChangeState: () => {
      setOpenPopupChangeState(true);
    }
  }), /*#__PURE__*/_react.default.createElement(_Footer.default, {
    alt: (_appInfo$appName2 = appInfo.appName) !== null && _appInfo$appName2 !== void 0 ? _appInfo$appName2 : appInfo.title
  }), appInfo && appInfo.hasState ? /*#__PURE__*/_react.default.createElement(_SelectStatePopup.default, {
    appInfo: appInfo,
    openPopupChangeState: openPopupChangeState,
    onHidden: () => {
      setOpenPopupChangeState(false);
    }
  }) : '');
};

var AppInfoUI = (_ref2) => {
  var {
    appInfoState,
    appNameId
  } = _ref2;
  var [openCollapse, setOpenCollapse] = (0, _react.useState)(false);
  var appInfo = appInfoState === null || appInfoState === void 0 ? void 0 : appInfoState.data[appNameId];

  if ((0, _utils.isLoadingNew)(appInfoState) || !appInfo) {
    return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
  }

  var content = appInfo.content ? appInfo.content : '';
  var showButtonShowMore = content.length > 500;
  return /*#__PURE__*/_react.default.createElement(_Widgets.FixedContainer, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "space-height"
  }), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: "user-info-panel",
    container: true,
    direction: "row",
    justify: 'space-between',
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: 8,
    className: "user-info-content-panel"
  }, /*#__PURE__*/_react.default.createElement("h1", null, appInfo.title), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    style: {
      color: '#555'
    },
    in: openCollapse || !showButtonShowMore,
    collapsedHeight: "300px"
  }, /*#__PURE__*/_react.default.createElement("div", null, (0, _reactHtmlParser.default)(content.replace(/<o:p>/g, '').replace(/<\/o:p>/, '')))), showButtonShowMore ? /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      float: 'right',
      margin: '10px 0'
    },
    variant: "outlined",
    color: "primary",
    onClick: () => setOpenCollapse(!openCollapse)
  }, openCollapse ? "Show less" : "Show more") : ''), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: 4,
    className: "user-avatar-content-panel",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "parent-app-info-name"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "app-info-name"
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    src: appInfo.avatar,
    alt: appInfo.appName,
    width: "100px",
    height: "100px"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "app-child-name"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("strong", null, appInfo.appName)), /*#__PURE__*/_react.default.createElement(_Rating.default, {
    name: "read-only",
    value: 5,
    readOnly: true,
    size: "small",
    style: {
      marginTop: '10px'
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "link-app-store"
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: appInfo.urlAndroid,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    alt: "Link google app",
    src: _googlePlayIcon.default
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '20px'
    }
  }), /*#__PURE__*/_react.default.createElement("a", {
    href: appInfo.urlIos,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react.default.createElement(_Image.default, {
    alt: "Link app store",
    src: _appStoreIcon.default
  })))), /*#__PURE__*/_react.default.createElement(UserRateAppSlider, {
    appId: appInfo.id
  }))));
};

var UserRateAppSliderUI = (_ref3) => {
  var {
    userRateState,
    getUserRate,
    appId
  } = _ref3;
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "review-app-slider"
  };
  (0, _react.useEffect)(() => {
    getUserRate(appId);
  }, []);
  var userRates = userRateState === null || userRateState === void 0 ? void 0 : userRateState.data[appId];
  return userRateState.loading == true || !userRateState.data || !userRates ? /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null) : /*#__PURE__*/_react.default.createElement(_reactSlick.default, Object.assign({}, settings), userRates.map(userRate => {
    return /*#__PURE__*/_react.default.createElement(ReviewAppItem, {
      key: "ReviewAppItem-" + userRate.id,
      // value={userRate.rateValue}
      value: 5,
      content: userRate.content,
      name: userRate.userName,
      createTime: userRate.createDate
    });
  }));
};

var ReviewAppItem = (_ref4) => {
  var {
    content,
    name,
    createTime,
    value
  } = _ref4;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "review-app-item"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("p", {
    className: "dot-3"
  }, content), /*#__PURE__*/_react.default.createElement(_core.Grid, {
    container: true,
    alignItems: "center",
    className: "info",
    justify: "space-between"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("strong", null, name), /*#__PURE__*/_react.default.createElement("div", {
    className: "time"
  }, (0, _utils.formatDate)(createTime))), /*#__PURE__*/_react.default.createElement(_Rating.default, {
    size: "small",
    value: value,
    readOnly: true
  }))));
};

var mapStateToPropsAppInfo = (state, ownProps) => Object.assign({
  appInfoState: state.appInfoState,
  stateInfoState: state.stateInfoState
}, ownProps);

var mapDispatchToPropsAppInfo = dispatch => ({
  getAppInfo: appNameId => dispatch((0, _actions.getAppInfo)(appNameId))
});

var AppInfoWidget = (0, _reactRedux.connect)(mapStateToPropsAppInfo, null)(AppInfoUI);

var _default = (0, _reactRedux.connect)(mapStateToPropsAppInfo, mapDispatchToPropsAppInfo)(HomeViewScreen);

exports.default = _default;

var mapStateToPropsUserRate = (state, ownProps) => Object.assign({
  userRateState: state.userRateState
}, ownProps);

var mapDispatchToPropsUserRate = dispatch => ({
  getUserRate: appId => dispatch((0, _actions.getUserRate)(appId))
});

var UserRateAppSlider = (0, _reactRedux.connect)(mapStateToPropsUserRate, mapDispatchToPropsUserRate)(UserRateAppSliderUI);