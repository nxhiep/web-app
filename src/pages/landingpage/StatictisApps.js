import { Grid } from '@material-ui/core';
import { CalendarToday as CalendarTodayIcon } from '@material-ui/icons';
import React from 'react';
import { FixedContainer, TitleBlock } from '../../components/Widgets';
import ImageStatictisApps from '../../resources/images/landing-page-statictis-apps.jpg';
import Image from '../../components/Image';
const StatictisApps = () => {
    return (React.createElement("section", { className: "statictis-apps" },
        React.createElement(FixedContainer, null,
            React.createElement(TitleBlock, { title: "Some of the best features", description: "With thousands of exam-simulated questions with detail explanations, lifetime access to the complete Manual, and dozens of test-taking strategies, our Test Prep helps you pass your test with flying colors." }),
            React.createElement(Grid, { container: true },
                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                    React.createElement(Image, { className: "image-statictis-apps", alt: 'With thousands of exam-simulated questions with detail explanations, lifetime access to the complete Manual, and dozens of test-taking strategies, our Test Prep helps you pass your test with flying colors', src: ImageStatictisApps })),
                React.createElement(Grid, { item: true, xs: 12, sm: 6, className: "statictis-apps-items" },
                    React.createElement(StatictisAppItem, { title: "Completely free", description: "Our application is 100% free, so you can practice your test in our web or in any other devices with our available free app on google play or appStore. No internet connection and no registration required." }),
                    React.createElement(StatictisAppItem, { title: "Practice by topics", description: "Test your knowledge by practicing by topics exactly as in real test. Moreover, topic is also divided into small parts which helps you get your interest in studying, just like playing a game." }),
                    React.createElement(StatictisAppItem, { title: "Customize your exam", description: "You can design your test so that it works best for you. Gradually set the test as close as the real test to ready for it. This is the most effective way that helps many people get over their challenge." }),
                    React.createElement(StatictisAppItem, { title: "Special review mode", description: "With this feature, you can review which questions you are weak, medium or strong. And this will help you find out where you need to work more and make the most of your study time." }))),
            React.createElement(Grid, { container: true, className: "list-number" },
                React.createElement(Grid, { item: true, xs: 12, sm: 3 },
                    React.createElement(ActiveItem, { value: "10,123", title: "Users" })),
                React.createElement(Grid, { item: true, xs: 12, sm: 3 },
                    React.createElement(ActiveItem, { value: "20,432", title: "Download" })),
                React.createElement(Grid, { item: true, xs: 12, sm: 3 },
                    React.createElement(ActiveItem, { value: "7871", title: "Likes" })),
                React.createElement(Grid, { item: true, xs: 12, sm: 3 },
                    React.createElement(ActiveItem, { value: "945", title: "5 star rating" }))))));
};
const ActiveItem = ({ value = '', title = '' }) => {
    return (React.createElement("div", { className: "active-item" },
        React.createElement("strong", null, value),
        React.createElement("span", null, title)));
};
const StatictisAppItem = ({ title = '', description = '' }) => {
    return (React.createElement("div", { className: "statictis-app-item" },
        React.createElement("div", { className: "image" },
            React.createElement(CalendarTodayIcon, null)),
        React.createElement("div", { className: "info" },
            React.createElement("strong", { className: "title" }, title),
            React.createElement("p", null, description))));
};
export default StatictisApps;
