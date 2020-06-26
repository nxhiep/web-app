import { Button, Grid } from '@material-ui/core';
import React, { FunctionComponent, Suspense, useEffect } from 'react';
import Footer from '../../components/Footer';
import Image from '../../components/Image';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import { onScrollToElement } from '../../models/Utils';
import "../../resources/css/slick-theme.css";
import "../../resources/css/slick.css";
import ImageHeader from '../../resources/images/landing-page-header.png';
import '../../resources/scss/landing-page.scss';
import '../../resources/scss/main.scss';
import FeedbackApps from './FeedbackApps';
import ListGreatApps from './ListGreatApps';
import StatictisApps from './StatictisApps';
import ReactGA from 'react-ga';

const LandingPage: FunctionComponent<({})> = () => {
    useEffect(() => {
        ReactGA.pageview('/homepage');
    }, [])
    return (
        <MainWidget className={'landing-page'}>
            <Header />
            <Suspense fallback={<LoadingWidget />}>
                <StatictisApps />
                <FeedbackApps />
                <ListGreatApps />
            </Suspense>
            <Footer alt="ABC Elearning" />
        </MainWidget>
    );
}

const Header: FunctionComponent<({})> = () => {
    return (
        <header>
            <FixedContainer>
                <Grid container alignItems="center" justify="space-between" className="header-tab-panel">
                    <div className="parent-logo">
                        <a href="/" className="logo">
                            <strong>A B C</strong>
                            <div>E-Learning</div>
                        </a>
                    </div>
                    <div className="menu-appbar">
                        {/* <ul>
                            <li><Button className="header-button">About</Button></li>
                            <li><Button className="header-button">Feaures</Button></li>
                            <li><Button className="header-button">Testimoninals</Button></li>
                        </ul> */}
                        <div className="space-header"></div>
                        <Button 
                            className="header-button header-button-right" 
                            variant="contained" 
                            color="secondary"
                            onClick={(event: any) => {
                                onScrollToElement('.list-great-apps');
                            }}
                            >
                                Explore Our Exams
                        </Button>
                    </div>
                </Grid>
                <div style={{width: "100%", height: "20px"}}></div>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item xs={12} sm={7} className="header-content">
                        <h1 style={{fontWeight: 600}}>Make your study great with our thousands of free practice questions</h1>
                        <p>You want to get 100% ready for your important day? You desire to pass your exam at your first try? 
                            You are wondering if you should pay a charge of money buying some practice materials? 
                            That’s why we are here to support you achieve the gate of success with our test prep solutions.</p>
                    </Grid>
                    <Grid item xs={12} sm={5} className="header-image-content">
                        <Image alt='Make your study great with our thousands of free practice questions' src={ImageHeader} />
                    </Grid>
                </Grid>
            </FixedContainer>
        </header>
    );
}

export default LandingPage;
