import React from 'react';
import { Route, Switch, useParams } from "react-router-dom";
import Routes from './routes';
import ReactGA from 'react-ga';
// import { createBrowserHistory } from 'history';
import HomeViewScreen  from'./pages/home/Home.View';
import LandingPageScreen from'./pages/landingpage/LandingPage';
import ReviewViewScreen from'./pages/review/Review.View';
import StudyViewScreen  from'./pages/study/Study.View';
import TestViewScreen  from'./pages/test/Test.View';
import GameViewScreen  from'./pages/game/Game.ViewTS';
initializeReactGA();
function initializeReactGA() {
    ReactGA.initialize('UA-167769768-1');
}
function App() {
    // const history = createBrowserHistory();
    return (
        // <Router >
        // <Suspense fallback={makeMainLoading()}>
        <Switch>
            <Route exact path={"/:appNameId/:screen"} children={<ScreenChild />}></Route>
            <Route exact path={"/:appNameId"}>
                <HomeViewScreen>
                </HomeViewScreen>
            </Route>
            <Route exact path={"/"}>    
                <LandingPageScreen />
            </Route>
        </Switch>
    )           
}
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
/*
<Route exact path={"/:appNameId/" + Routes.TEST_SCREEN}>
  <TestViewScreen />
</Route>
<Route exact path={"/:appNameId/" + Routes.REVIEW_SCREEN}>
  <ReviewViewScreen />
</Route>
*/
export default App;
