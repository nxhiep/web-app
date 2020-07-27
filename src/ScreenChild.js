import React from 'react';
import loadable from '@loadable/component';
const ReviewViewScreen = loadable(() => import('./pages/review/Review.View'));
const StudyViewScreen = loadable(() => import('./pages/study/Study.View'));
const TestViewScreen = loadable(() => import('./pages/test/Test.View'));
function ScreenChild() {
    let { screen } = useParams();
    screen = screen !== null && screen !== void 0 ? screen : '';
    if (screen.startsWith(Routes.TEST_SCREEN)) {
        // console.log("screen", screen);
        let offset = screen.lastIndexOf('-');
        let topicId = -1;
        if (offset > -1) {
            offset += 1;
            topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
        }
        // console.log("TestViewScreen topicId ", topicId);
        return React.createElement(TestViewScreen, { topicId: topicId });
    }
    if (screen.startsWith(Routes.REVIEW_SCREEN)) {
        return React.createElement(ReviewViewScreen, null);
    }
    if (screen.length > 0) {
        return React.createElement(StudyViewScreen, null);
    }
    return React.createElement(HomeViewScreen, null);
}