import { Button, Collapse, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Rating from '@material-ui/lab/Rating';
import React, { FunctionComponent, Suspense, useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Image from '../../components/Image';
import SelectStatePopup from '../../components/SelectStatePopup';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import AppInfo from '../../models/AppInfo';
import UserRate from '../../models/UserRate';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo, getUserRate } from '../../redux/actions';
import { AppState } from '../../redux/appstate';
import { AppInfoState } from '../../redux/reducers/appInfo';
import { StateInfoState } from '../../redux/reducers/stateInfo';
import { UserRateState } from '../../redux/reducers/userRate';
import appStoreIcon from '../../resources/images/app-store-icon.png';
import googlePlayIcon from '../../resources/images/google-play-icon.png';
import '../../resources/scss/home.scss';
import '../../resources/scss/main.scss';
import "../../resources/css/slick-theme.css";
import "../../resources/css/slick.css";
import { formatDate, isLoadingNew } from '../../utils';
import HomeContent from './HomeContent';
import ReactGA from 'react-ga';

const HomeViewScreen: FunctionComponent<({
    appInfoState: AppInfoState,
    getAppInfo: any,
    stateInfoState: StateInfoState
    })> = ({
    appInfoState,
    getAppInfo,
    stateInfoState
    }) => {
    const [openPopupChangeState, setOpenPopupChangeState] = useState(false);
    let { appNameId } = useParams();
    // console.log("appNameId", appNameId);
    if(!appNameId){
        appNameId = '';
    }
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        getAppInfo(appNameId);
        if(isMobile){
            scrollToTop();
        }
    }, []);
    let appInfo: AppInfo = appInfoState.data[appNameId];
    useEffect(() => {
        if(appInfo) {
            setSEOContent({
                title: appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.avatar
            });
            ReactGA.pageview('/homepage/' + appInfo.title);
        }
    }, [appInfo]);
    if(!appInfo){
        return <LoadingWidget />;
    }
    let parentId = appInfo.id;
    if(appInfo && appInfo.hasState && stateInfoState.mapCurrentStateInfo[appInfo.id]){
        parentId = stateInfoState.mapCurrentStateInfo[appInfo.id].id;
    }
    return (
        <MainWidget>
            <Header alt={appInfo.appName ?? appInfo.title} />
            <AppInfoWidget appNameId={appNameId} />
            <Suspense fallback={<LoadingWidget />}>
                <HomeContent 
                    parentId={parentId} appNameId={appNameId} 
                    hasState={appInfo && appInfo.hasState}
                    onChangeState={() => {
                        setOpenPopupChangeState(true);
                    }}
                />
            </Suspense>
            <Footer alt={appInfo.appName ?? appInfo.title} />
            { appInfo && appInfo.hasState ? 
            <SelectStatePopup 
                appInfo={appInfo} 
                openPopupChangeState={openPopupChangeState} 
                onHidden={() => {
                    setOpenPopupChangeState(false);
                }} /> : '' }
        </MainWidget>
    );
}

const AppInfoUI: FunctionComponent<({
    appInfoState: AppInfoState,
    appNameId: string
    })> = ({
    appInfoState,
    appNameId
    }) => {
    const [openCollapse, setOpenCollapse] = useState(false);
    let appInfo: AppInfo = appInfoState?.data[appNameId];
    if(isLoadingNew(appInfoState) || !appInfo){
        return <LoadingWidget />
    }
    let content = appInfo.content ? appInfo.content : '';
    let showButtonShowMore = content.length > 500;
    return (
        <FixedContainer>
            <div className="space-height"></div>
            <Grid className="user-info-panel"
            container
            direction="row"
            justify='space-between'
            spacing={3}
            >
                <Grid item xs={12} sm={12} md={8} className="user-info-content-panel">
                    <h1>{appInfo.title}</h1>
                    <Collapse style={{color: '#555'}} in={openCollapse || !showButtonShowMore} collapsedHeight="300px">
                        <div>{ReactHtmlParser(content.replace(/<o:p>/g, '').replace(/<\/o:p>/, ''))}</div>
                    </Collapse>
                    {showButtonShowMore ? 
                        <Button 
                            style={{float: 'right', margin: '10px 0'}} 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => setOpenCollapse(!openCollapse)}>
                            {openCollapse ? "Show less" : "Show more"}
                        </Button> : ''}
                </Grid>
                <Grid item xs={12} sm={12} md={4} className="user-avatar-content-panel" style={{overflow: 'hidden'}}>
                    <div className="parent-app-info-name">
                        <div className="app-info-name">
                            <Image src={appInfo.avatar} alt={appInfo.appName} width="100px" height="100px" />
                            <div className="app-child-name">
                                <div><strong>{appInfo.appName}</strong></div>
                                <Rating name="read-only" value={5} readOnly size="small" style={{marginTop: '10px'}} />
                            </div>
                        </div>
                        <div className="link-app-store">
                            <a href={appInfo.urlAndroid} target="_blank" rel="noopener noreferrer">
                                <Image alt="Link google app" src={googlePlayIcon} />
                            </a>
                            <div style={{width: '20px'}}></div>
                            <a href={appInfo.urlIos} target="_blank" rel="noopener noreferrer">
                                <Image alt="Link app store" src={appStoreIcon} />
                            </a>
                        </div>
                    </div>
                    <UserRateAppSlider appId={appInfo.id} />
                </Grid>
            </Grid>
        </FixedContainer>
    );
}

const UserRateAppSliderUI: FunctionComponent<({
    userRateState: UserRateState,
    getUserRate: any,
    appId: number
    })> = ({
    userRateState,
    getUserRate,
    appId
    }) => {
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
    let userRates: Array<UserRate> = userRateState?.data[appId];
    return (
        userRateState.loading == true || !userRateState.data || !userRates ? <LoadingWidget /> :
        <Slider {...settings}>
            {
                userRates.map((userRate: UserRate) => {
                    return <ReviewAppItem 
                        key={"ReviewAppItem-" + userRate.id}
                        // value={userRate.rateValue}
                        value={5}
                        content={userRate.content}
                        name={userRate.userName}
                        createTime={userRate.createDate}
                    />
                })
            }
        </Slider>
    );
}

const ReviewAppItem: FunctionComponent<({
    content: string,
    name: string,
    createTime: number,
    value: number
    })> = ({
    content,
    name,
    createTime,
    value
    }) => {
    return (
        <div className="review-app-item">
            <div>
                <p className="dot-3">{content}</p>
                <Grid container alignItems="center" className="info" justify="space-between">
                    <div>
                        <strong>{name}</strong>
                        <div className="time">{formatDate(createTime)}</div>
                    </div>
                    <Rating size="small" value={value} readOnly />
                </Grid>
            </div>
        </div>
    );
}

const mapStateToPropsAppInfo = (state: AppState, ownProps: any) => ({
    appInfoState: state.appInfoState,
    stateInfoState: state.stateInfoState,
    ...ownProps
});

const mapDispatchToPropsAppInfo = (dispatch: any) => ({
    getAppInfo: (appNameId: string) => dispatch(getAppInfo(appNameId)),
});

const AppInfoWidget = connect(mapStateToPropsAppInfo, null)(AppInfoUI);

export default connect(mapStateToPropsAppInfo, mapDispatchToPropsAppInfo)(HomeViewScreen);

const mapStateToPropsUserRate = (state: AppState, ownProps: any) => ({
    userRateState: state.userRateState,
    ...ownProps
});
const mapDispatchToPropsUserRate = (dispatch: any) => ({
    getUserRate: (appId: number) => dispatch(getUserRate(appId)),
});
const UserRateAppSlider = connect(mapStateToPropsUserRate, mapDispatchToPropsUserRate)(UserRateAppSliderUI);