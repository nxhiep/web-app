"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@material-ui/core");

var _Rating = _interopRequireDefault(require("@material-ui/lab/Rating"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _config = _interopRequireDefault(require("../config"));

var _rate = require("../redux/actions/rate");

var _services = require("../services");

var _uitls = require("../uitls");

var _Widgets = require("./Widgets");

class ReviewRatingWidget extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      examId: props.examId,
      offset: 0
    };
  }

  componentDidMount() {
    this.onSeeMore();
  }

  onSeeMore() {
    this.props.getUserRateByExamId(this.state.examId, this.state.offset, this.state.offset + _config.default.LIMIT_USER_RATING);
    this.setState({
      offset: this.state.offset + _config.default.LIMIT_USER_RATING
    });
  }

  render() {
    if (this.props.loading === true || !this.props.userRates) {
      return /*#__PURE__*/_react.default.createElement(_Widgets.LoadingWidget, null);
    }

    var userRates = this.props.userRates;
    var listRatingItem = [];

    if (userRates) {
      for (var i = 0; i < userRates.length; i++) {
        listRatingItem.push( /*#__PURE__*/_react.default.createElement(UserRateItem, {
          userRate: userRates[i],
          key: 'user-rate-' + userRates[i]._id
        }));
      }
    }

    return /*#__PURE__*/_react.default.createElement(_core.Box, {
      className: 'review-rating-panel'
    }, /*#__PURE__*/_react.default.createElement("h2", null, "Reviews"), /*#__PURE__*/_react.default.createElement("hr", null), /*#__PURE__*/_react.default.createElement(_core.Box, null, listRatingItem.length > 0 ? listRatingItem : /*#__PURE__*/_react.default.createElement(_core.Box, null, "Empty!")), /*#__PURE__*/_react.default.createElement(_core.Grid, {
      container: true,
      justify: 'center',
      style: {
        padding: "20px 0"
      }
    }, /*#__PURE__*/_react.default.createElement(_core.Button, {
      variant: "outlined",
      color: "primary",
      onClick: () => {
        this.onSeeMore();
      }
    }, "See More Reviews")));
  }

}

var UserRateItem = (_ref) => {
  var {
    userRate
  } = _ref;
  var avatar = (0, _services.getAvatarFromUserId)(userRate.userId); // console.log('xxxx',userRate);

  var timeAgo = new Date().getTime() - userRate.lastUpdate;
  return /*#__PURE__*/_react.default.createElement(_core.Grid, {
    className: 'user-rate-item',
    container: true,
    direction: 'row'
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: 'first-content'
  }, /*#__PURE__*/_react.default.createElement(_core.Box, {
    className: 'avatar'
  }, /*#__PURE__*/_react.default.createElement("img", {
    alt: "",
    src: avatar
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, (0, _uitls.timeSince)(timeAgo) + " ago"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("b", null, userRate.userName)))), /*#__PURE__*/_react.default.createElement("div", {
    className: 'second-content'
  }, /*#__PURE__*/_react.default.createElement(_Rating.default, {
    value: userRate.rateValue,
    max: 5,
    precision: 0.5,
    readOnly: true
  }), /*#__PURE__*/_react.default.createElement("p", null, userRate.content), /*#__PURE__*/_react.default.createElement(_core.Box, {
    className: 'info-panel'
  }, /*#__PURE__*/_react.default.createElement("span", null, "Was this review helpful?"), /*#__PURE__*/_react.default.createElement(_core.Button, null, "Yes"), /*#__PURE__*/_react.default.createElement(_core.Button, null, "No"), /*#__PURE__*/_react.default.createElement(_core.Button, null, "Report"))));
};

var mapStateToProps = (state, ownProps) => {
  return state.userRateReducer;
};

var mapDispatchToProps = dispatch => ({
  getUserRateByExamId: (id, offset, limit) => dispatch((0, _rate.getUserRates)(id, offset, limit))
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ReviewRatingWidget);

exports.default = _default;