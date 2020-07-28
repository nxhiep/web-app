import { Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { FixedContainer, LoadingWidget, TitleBlock } from '../../components/Widgets';
import { getUserRatesPerfectest } from '../../redux/actions';
import { formatDate } from '../../utils';
import {  withTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
const FeedbackAppsUI = ({ getUserRatesPerfectest, userRateState, theme }) => {
    // const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: isMobile ? 1 : 3,
        className: "feedback-slider",
    };
    useEffect(() => {
        getUserRatesPerfectest();
    }, []);
    let userRates = [];
    for (let i = 0; i < userRateState.perfectest.length; i++) {
        if (i < 6) {
            userRates.push(userRateState.perfectest[i]);
        }
        else {
            break;
        }
    }
    console.log("XXXXX userRates", userRates);
    return (React.createElement("section", { className: "feedback-apps" },
        React.createElement(FixedContainer, null,
            React.createElement(TitleBlock, { title: "What our clients say" }),
            React.createElement(Slider, Object.assign({}, settings), userRates && userRates.length > 0 ? userRates.map((userRate) => {
                return React.createElement(FeedbackItem, { key: "FeedbackItem-" + userRate.id, 
                    // value={userRate.rateValue}
                    value: 5, content: userRate.content, name: userRate.userName, createTime: userRate.createDate });
            }) : React.createElement(LoadingWidget, null)))));
};
const FeedbackItem = ({ value = 0, content = '', name = '', createTime = 0, }) => {
    return (React.createElement("div", { className: "feedback-item" },
        React.createElement("div", null,
            React.createElement(Rating, { size: "small", value: value, readOnly: true }),
            React.createElement("p", { className: "dot-7" }, content),
            React.createElement("br", null),
            React.createElement(Grid, { container: true, alignItems: "center", className: "info" },
                React.createElement("span", { className: "border" }),
                React.createElement("div", null,
                    React.createElement("strong", null, name),
                    React.createElement("div", null, formatDate(createTime)))))));
};
const mapStateToPropsUserRate = (state, ownProps) => {
    return Object.assign({ userRateState: state.userRateState }, ownProps);
};
const mapDispatchToPropsUserRate = (dispatch) => ({
    getUserRatesPerfectest: () => dispatch(getUserRatesPerfectest()),
});
export default connect(mapStateToPropsUserRate, mapDispatchToPropsUserRate)(withTheme(FeedbackAppsUI));
