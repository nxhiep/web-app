import { AppBar, Box, Button, Grid, Link } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Logo from '../resources/images/logo.png';
import Routes from '../routes';
import { FixedContainer } from './Widgets';
const Header = ({ alt = '' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // console.log('isMobile', isMobile, "width", width, 'height', height);
    if (isMobile) {
        return React.createElement(HeaderMobile, { alt: alt });
    }
    return React.createElement(HeaderPC, { alt: alt });
};
const HeaderTabPanel = () => {
    let history = useHistory();
    let { appNameId, screen } = useParams();
    // console.log("appNameId", appNameId, 'screen', screen);
    screen = screen !== null && screen !== void 0 ? screen : '';
    let homeScreen = screen.length == 0;
    let studyScreen = !screen.startsWith('test') && !screen.startsWith('review') && !homeScreen;
    const gotoPage = (event, screen) => {
        event.preventDefault();
        history.push(getLink(screen));
    };
    const getLink = (screen) => {
        return '/' + appNameId + (screen ? '/' + screen : '');
    };
    return (React.createElement("div", { className: "header-tabs-panel" },
        studyScreen ?
            React.createElement(Button, { className: "header-tab-button" + (studyScreen ? ' active' : '') }, "Learn")
            : React.createElement(Button, { href: getLink(), className: "header-tab-button" + (homeScreen ? ' active' : ''), onClick: (event) => gotoPage(event) }, "Home"),
        React.createElement(Button, { href: getLink(Routes.TEST_SCREEN), className: "header-tab-button" + (screen.startsWith(Routes.TEST_SCREEN) ? ' active' : ''), onClick: (event) => gotoPage(event, Routes.TEST_SCREEN) }, "Test"),
        React.createElement(Button, { href: getLink(Routes.REVIEW_SCREEN), className: "header-tab-button" + (screen.startsWith(Routes.REVIEW_SCREEN) ? ' active' : ''), onClick: (event) => gotoPage(event, Routes.REVIEW_SCREEN) }, "Review")));
};
const HeaderMobile = ({ alt }) => {
    let history = useHistory();
    return (React.createElement(AppBar, { color: "inherit", position: "static", className: "main-app-bar" },
        React.createElement(Grid, { container: true, direction: "row", justify: "space-between", alignItems: "flex-end", wrap: "nowrap" },
            React.createElement(Link, { style: { alignSelf: "center" }, href: "/", className: 'logo-web', onClick: (event) => {
                    event.preventDefault();
                    history.push('/');
                } },
                React.createElement("img", { alt: alt, src: Logo })),
            React.createElement(HeaderTabPanel, null))));
};
const HeaderPC = ({ alt }) => {
    let history = useHistory();
    return (React.createElement(AppBar, { color: "inherit", position: "static", className: "main-app-bar" },
        React.createElement("div", null,
            React.createElement(FixedContainer, null,
                React.createElement(Grid, { container: true, direction: "row", justify: "space-between", alignItems: "center" },
                    React.createElement(Link, { href: "/", className: 'logo-web', onClick: (event) => {
                            event.preventDefault();
                            history.push('/');
                        } },
                        React.createElement("img", { alt: alt, src: Logo })),
                    React.createElement(HeaderTabPanel, null),
                    React.createElement("div", { className: "temp-panel" }),
                    React.createElement("div", { className: "temp-panel" }))))));
};
const LoginPanel = () => {
    return (React.createElement(Box, { className: 'login-panel', component: "span" },
        React.createElement(Button, { variant: "text", color: "inherit", style: { marginRight: '10px', 'color': 'white' } }, "Log In"),
        React.createElement(Button, { variant: "contained", color: "default", style: { 'color': 'white', 'backgroundColor': 'rgba(255, 255, 255, 0.5)' } }, "Sign Up")));
};
export default Header;
