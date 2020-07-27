import { Box, Button, Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Config from '../config';
import { getUserRates } from '../redux/actions/rate';
import { getAvatarFromUserId } from '../services';
import { timeSince } from '../uitls';
import { LoadingWidget } from './Widgets';
class ReviewRatingWidget extends Component {
    constructor(props) {
        super(props);
        this.state = { examId: props.examId, offset: 0 };
    }
    componentDidMount() {
        this.onSeeMore();
    }
    onSeeMore() {
        this.props.getUserRateByExamId(this.state.examId, this.state.offset, this.state.offset + Config.LIMIT_USER_RATING);
        this.setState({
            offset: this.state.offset + Config.LIMIT_USER_RATING
        });
    }
    render() {
        if (this.props.loading === true || !this.props.userRates) {
            return React.createElement(LoadingWidget, null);
        }
        let userRates = this.props.userRates;
        let listRatingItem = [];
        if (userRates) {
            for (let i = 0; i < userRates.length; i++) {
                listRatingItem.push(React.createElement(UserRateItem, { userRate: userRates[i], key: 'user-rate-' + userRates[i]._id }));
            }
        }
        return (React.createElement(Box, { className: 'review-rating-panel' },
            React.createElement("h2", null, "Reviews"),
            React.createElement("hr", null),
            React.createElement(Box, null, listRatingItem.length > 0 ? listRatingItem : React.createElement(Box, null, "Empty!")),
            React.createElement(Grid, { container: true, justify: 'center', style: { padding: "20px 0" } },
                React.createElement(Button, { variant: "outlined", color: "primary", onClick: () => {
                        this.onSeeMore();
                    } }, "See More Reviews"))));
    }
}
const UserRateItem = ({ userRate }) => {
    let avatar = getAvatarFromUserId(userRate.userId);
    // console.log('xxxx',userRate);
    let timeAgo = new Date().getTime() - userRate.lastUpdate;
    return (React.createElement(Grid, { className: 'user-rate-item', container: true, direction: 'row' },
        React.createElement("div", { className: 'first-content' },
            React.createElement(Box, { className: 'avatar' },
                React.createElement("img", { alt: "", src: avatar })),
            React.createElement("div", null,
                React.createElement("div", null, timeSince(timeAgo) + " ago"),
                React.createElement("div", null,
                    React.createElement("b", null, userRate.userName)))),
        React.createElement("div", { className: 'second-content' },
            React.createElement(Rating, { value: userRate.rateValue, max: 5, precision: 0.5, readOnly: true }),
            React.createElement("p", null, userRate.content),
            React.createElement(Box, { className: 'info-panel' },
                React.createElement("span", null, "Was this review helpful?"),
                React.createElement(Button, null, "Yes"),
                React.createElement(Button, null, "No"),
                React.createElement(Button, null, "Report")))));
};
const mapStateToProps = (state, ownProps) => {
    return state.userRateReducer;
};
const mapDispatchToProps = dispatch => ({
    getUserRateByExamId: (id, offset, limit) => dispatch(getUserRates(id, offset, limit)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewRatingWidget);
