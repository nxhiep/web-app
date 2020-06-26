import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import Routes from './routes';
import { makeMainLoading } from './utils';
import ReactGA from 'react-ga';

const HomeViewScreen = lazy(() => import('./pages/home/Home.View'));
const LandingPageScreen = lazy(() => import('./pages/landingpage/LandingPage'));
const ReviewViewScreen = lazy(() => import('./pages/review/Review.View'));
const StudyViewScreen = lazy(() => import('./pages/study/Study.View'));
const TestViewScreen = lazy(() => import('./pages/test/Test.View'));

initializeReactGA();
function initializeReactGA() {
  ReactGA.initialize('UA-167769768-1');
}

function App() {
  return (
    <Router>
    <Suspense fallback={makeMainLoading()}>
        <Switch>
          <Route exact path={"/:appNameId/:screen"} children={<ScreenChild />}></Route>
          <Route exact path={"/:appNameId"}>
            <HomeViewScreen />
          </Route>
          <Route exact path={"/"}>
            <LandingPageScreen />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

function ScreenChild() {
  let { screen } = useParams();
  screen = screen ?? '';
  if (screen.startsWith(Routes.TEST_SCREEN)) {
    // console.log("screen", screen);
    let offset = screen.lastIndexOf('-');
    let topicId = -1;
    if(offset > -1){
      offset += 1;
      topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    }
    // console.log("TestViewScreen topicId ", topicId);
    return <TestViewScreen topicId={topicId} />;
  }
  if (screen.startsWith(Routes.REVIEW_SCREEN)) {
    return <ReviewViewScreen />;
  }
  if (screen.length > 0) {
    return <StudyViewScreen />;
  }
  return <HomeViewScreen />;
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