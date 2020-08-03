import { Button, Collapse, Grid } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Image from '../../components/Image';
import SelectStatePopup from '../../components/SelectStatePopup';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo, getUserRate } from '../../redux/actions';
import appStoreIcon from '../../resources/images/app-store-icon.png';
import googlePlayIcon from '../../resources/images/google-play-icon.png';
import '../../resources/scss/home.scss';
import '../../resources/scss/main.scss';
import { formatDate, isLoadingNew } from '../../utils';
import HomeContent from './HomeContent';
import ReactGA from 'react-ga';
const HomeViewScreen = ({ appInfoState, getAppInfo, stateInfoState , theme}) => {
    var _a, _b;
    const [openPopupChangeState, setOpenPopupChangeState] = useState(false);
    let { appNameId } = useParams();
    // console.log("appNameId", appNameId);
    if (!appNameId) {
        appNameId = '';
    }
    // const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        getAppInfo(appNameId);
        if (isMobile) {
            scrollToTop();
        }
    }, []);
    let appInfo = appInfoState.data[appNameId];
    console.log("AppInfo in home view" , appInfo)
    useEffect(() => {
        if (appInfo) {
            setSEOContent({
                title: appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.avatar
            });
            ReactGA.pageview('/homepage/' + appInfo.title);
        }
    }, [appInfo]);
    if (!appInfo) {
        return React.createElement(LoadingWidget, null);
    }
    let parentId = appInfo.id;
    if (appInfo && appInfo.hasState && stateInfoState.mapCurrentStateInfo[appInfo.id]) {
        parentId = stateInfoState.mapCurrentStateInfo[appInfo.id].id;
    }
    return (
        <MainWidget>
            <Header alt={appInfo.appName ?? appInfo.title} />
            <AppInfoWidget appNameId={appNameId} />
            <HomeContent
                parentId={parentId} appNameId={appNameId}
                hasState={appInfo && appInfo.hasState}
                onChangeState={() => {
                    setOpenPopupChangeState(true);
                }}
            />
            <Footer alt={appInfo.appName ?? appInfo.title} />
            {appInfo && appInfo.hasState ?
                <SelectStatePopup
                    appInfo={appInfo}
                    openPopupChangeState={openPopupChangeState}
                    onHidden={() => {
                        setOpenPopupChangeState(false);
                    }} /> : ''}
        </MainWidget>
    );
};
const AppInfoUI = ({ appInfoState, appNameId }) => {
    const [openCollapse, setOpenCollapse] = useState(false);
    let appInfo = appInfoState === null || appInfoState === void 0 ? void 0 : appInfoState.data[appNameId];
    if (isLoadingNew(appInfoState) || !appInfo) {


        return React.createElement(LoadingWidget, null);
    }
    let content = appInfo.content ? appInfo.content : '';
    let showButtonShowMore = content.length > 500;
    return (React.createElement(FixedContainer, null,
        React.createElement("div", { className: "space-height" }),
        React.createElement(Grid, { className: "user-info-panel", container: true, direction: "row", justify: 'space-between', spacing: 3 },
            React.createElement(Grid, { item: true, xs: 12, sm: 12, md: 8, className: "user-info-content-panel" },
                React.createElement("h1", null, appInfo.title),
                React.createElement(Collapse, { style: { color: '#555' }, in: openCollapse || !showButtonShowMore, collapsedHeight: "300px" },
                    React.createElement("div", null, ReactHtmlParser(content.replace(/<o:p>/g, '').replace(/<\/o:p>/, '')))),
                showButtonShowMore ?
                    React.createElement(Button, { style: { float: 'right', margin: '10px 0' }, variant: "outlined", color: "primary", onClick: () => setOpenCollapse(!openCollapse) }, openCollapse ? "Show less" : "Show more") : ''),
            React.createElement(Grid, { item: true, xs: 12, sm: 12, md: 4, className: "user-avatar-content-panel", style: { overflow: 'hidden' } },
                React.createElement("div", { className: "parent-app-info-name" },
                    React.createElement("div", { className: "app-info-name" },
                        React.createElement(Image, { src: appInfo.avatar, alt: appInfo.appName, width: "100px", height: "100px" }),
                        React.createElement("div", { className: "app-child-name" },
                            React.createElement("div", null,
                                React.createElement("strong", null, appInfo.appName)),
                            React.createElement(Rating, { name: "read-only", value: 5, readOnly: true, size: "small", style: { marginTop: '10px' } }))),
                    React.createElement("div", { className: "link-app-store" },
                        React.createElement("a", { href: appInfo.urlAndroid, target: "_blank", rel: "noopener noreferrer" },
                            React.createElement(Image, { alt: "Link google app", src: googlePlayIcon })),
                        React.createElement("div", { style: { width: '20px' } }),
                        React.createElement("a", { href: appInfo.urlIos, target: "_blank", rel: "noopener noreferrer" },
                            React.createElement(Image, { alt: "Link app store", src: appStoreIcon })))),
                React.createElement(UserRateAppSlider, { appId: appInfo.id })))));
};
const UserRateAppSliderUI = ({ userRateState, getUserRate, appId }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "review-app-slider",
    };
    useEffect(() => {
        getUserRate(appId);
    }, []);
    let userRates = userRateState === null || userRateState === void 0 ? void 0 : userRateState.data[appId];
    return (userRateState.loading == true || !userRateState.data || !userRates ? React.createElement(LoadingWidget, null) :
        React.createElement(Slider, Object.assign({}, settings), userRates.map((userRate) => {
            return React.createElement(ReviewAppItem, {
                key: "ReviewAppItem-" + userRate.id,
                // value={userRate.rateValue}
                value: 5, content: userRate.content, name: userRate.userName, createTime: userRate.createDate
            });
        })));
};
const ReviewAppItem = ({ content, name, createTime, value }) => {
    return (React.createElement("div", { className: "review-app-item" },
        React.createElement("div", null,
            React.createElement("p", { className: "dot-3" }, content),
            React.createElement(Grid, { container: true, alignItems: "center", className: "info", justify: "space-between" },
                React.createElement("div", null,
                    React.createElement("strong", null, name),
                    React.createElement("div", { className: "time" }, formatDate(createTime))),
                React.createElement(Rating, { size: "small", value: value, readOnly: true })))));
};
const mapStateToPropsAppInfo = (state, ownProps) => (Object.assign({ appInfoState: state.appInfoState, stateInfoState: state.stateInfoState }, ownProps));
const mapDispatchToPropsAppInfo = (dispatch) => ({
    getAppInfo: (appNameId) => dispatch(getAppInfo(appNameId)),
});
const AppInfoWidget = connect(mapStateToPropsAppInfo, null)(AppInfoUI);
export default connect(mapStateToPropsAppInfo, mapDispatchToPropsAppInfo)(withTheme(HomeViewScreen));
const mapStateToPropsUserRate = (state, ownProps) => (Object.assign({ userRateState: state.userRateState }, ownProps));
const mapDispatchToPropsUserRate = (dispatch) => ({
    getUserRate: (appId) => dispatch(getUserRate(appId)),
});
const UserRateAppSlider = connect(mapStateToPropsUserRate, mapDispatchToPropsUserRate)(UserRateAppSliderUI);
