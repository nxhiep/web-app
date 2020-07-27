import { Button, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import Footer from '../../components/Footer';
import Image from '../../components/Image';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import { onScrollToElement } from '../../models/Utils';
import ImageHeader from '../../resources/images/landing-page-header.png';
import '../../resources/scss/landing-page.scss';
import '../../resources/scss/main.scss';
import FeedbackApps from './FeedbackApps';
import ListGreatApps from './ListGreatApps';
import StatictisApps from './StatictisApps';
import ReactGA from 'react-ga';
const LandingPage = () => {
    useEffect(() => {
        ReactGA.pageview('/homepage');
    }, []);
    return (
        <MainWidget className={'landing-page'}>
            <Header />
                <StatictisApps />
                <FeedbackApps />
                <ListGreatApps />
            <Footer alt="ABC Elearning" />
        </MainWidget>
    )
};
const Header = () => {
    return (React.createElement("header", null,
        React.createElement(FixedContainer, null,
            React.createElement(Grid, { container: true, alignItems: "center", justify: "space-between", className: "header-tab-panel" },
                React.createElement("div", { className: "parent-logo" },
                    React.createElement("a", { href: "/", className: "logo" },
                        React.createElement("strong", null, "A B C"),
                        React.createElement("div", null, "E-Learning"))),
                React.createElement("div", { className: "menu-appbar" },
                    React.createElement("div", { className: "space-header" }),
                    React.createElement(Button, {
                        className: "header-button header-button-right", variant: "contained", color: "secondary", onClick: (event) => {
                            onScrollToElement('.list-great-apps');
                        }
                    }, "Explore Our Exams"))),
            React.createElement("div", { style: { width: "100%", height: "20px" } }),
            React.createElement(Grid, { container: true, alignItems: "center", justify: "space-between" },
                React.createElement(Grid, { item: true, xs: 12, sm: 7, className: "header-content" },
                    React.createElement("h1", { style: { fontWeight: 600 } }, "Make your study great with our thousands of free practice questions"),
                    React.createElement("p", null, "You want to get 100% ready for your important day? You desire to pass your exam at your first try? You are wondering if you should pay a charge of money buying some practice materials? That\u2019s why we are here to support you achieve the gate of success with our test prep solutions.")),
                React.createElement(Grid, { item: true, xs: 12, sm: 5, className: "header-image-content" },
                    React.createElement(Image, { alt: 'Make your study great with our thousands of free practice questions', src: ImageHeader }))))));
};
export default LandingPage;
