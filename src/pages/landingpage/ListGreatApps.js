import { Button, Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Image from '../../components/Image';
import { FixedContainer, LoadingWidget, TitleBlock } from '../../components/Widgets';
import { getAllAppInfo } from '../../redux/actions';
import ReactGA from 'react-ga';
const ListGreatApps = ({ getAllAppInfo = () => { }, appInfoState }) => {
    useEffect(() => {
        getAllAppInfo();
    }, []);
    if (appInfoState.loading === true || !appInfoState.data) {
        return React.createElement(LoadingWidget, null);
    }
    let appInfos = Object.values(appInfoState.data);
    return (React.createElement("section", { className: "list-great-apps" },
        React.createElement(FixedContainer, null,
            React.createElement(TitleBlock, { title: "Great apps for you", description: "Practice right now with our free apps!" }),
            React.createElement(Grid, { container: true, alignItems: "stretch", spacing: 2 }, appInfos
                .sort((a, b) => a.appName.localeCompare(b.appName))
                .map((appInfo, index) => {
                return React.createElement(AppInfoItem, { appInfo: appInfo, key: "AppInfoItem-" + index });
            }))),
        React.createElement("div", { style: { width: "100%", height: "100px" } })));
};
const AppInfoItem = ({ appInfo }) => {
    let appName = appInfo.appName ? appInfo.appName : appInfo.title;
    return (React.createElement(Grid, { item: true, xs: 6, sm: 4, md: 2, className: "app-info-item" },
        React.createElement(Button, { href: "/" + appInfo.appNameId, target: "_blank", onClick: () => {
                ReactGA.event({
                    category: 'click-app',
                    action: 'Clicked ' + appInfo.appName
                });
            } },
            React.createElement("div", null,
                React.createElement(Image, { src: appInfo.avatar, alt: appName, width: "100%" })),
            React.createElement("div", { className: "title" },
                React.createElement("strong", null, appName)),
            React.createElement("div", { className: "rating" },
                React.createElement(Rating, { size: "small", value: 5, readOnly: true })))));
};
const mapStateToProps = (state, ownProps) => {
    return Object.assign({ appInfoState: state.appInfoState }, ownProps);
};
const mapDispatchToProps = (dispatch) => ({
    getAllAppInfo: () => dispatch(getAllAppInfo()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ListGreatApps);
