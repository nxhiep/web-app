import React from 'react';
import loadable from '@loadable/component';
// import { createBrowserHistory } from 'history';
const HomeViewScreen = loadable(() => import('./pages/home/Home.View'));
const LandingPageScreen = loadable(() => import('./pages/landingpage/LandingPage'));
const ReviewViewScreen = loadable(() => import('./pages/review/Review.View'));
const StudyViewScreen = loadable(() => import('./pages/study/Study.View'));
const TestViewScreen = loadable(() => import('./pages/test/Test.View'));
const GameViewScreen = loadable(() => import('./pages/game/Game.ViewTS'));


export default routesConfig = [
    {
        component: LandingPageScreen,
        routes : [
            {
                path: "/",
                exact : true,
                
            },
            {
                path : "/:appNameId",
                component : HomeViewScreen,
                exact : true,
                routes : [
                    {
                        path : "/:appNameId/review",
                        component : ReviewViewScreen,
                        exact : true
                    }
                ]
            }
        ]
    }
]