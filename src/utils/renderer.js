import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { Provider } from 'react-redux';
import App from '../App'
import { ServerStyleSheets } from '@material-ui/core/styles';
const renderer = (req, store, context,description,title) => {
    // let loadableState = {};
    const sheets = new ServerStyleSheets();
    const content = renderToString(
        sheets.collect(
            <Provider store={store}>
                <StaticRouter location={req} context={context}>
                    <App></App>
                </StaticRouter>
            </Provider>
        )
    );
    const css = sheets.toString();
    // loadableState = await getLoadableState(content);
    return `
        <!DOCTYPE html>
        <html>
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="apple-touch-icon" href="assets/logo60.png" />
            <link rel="manifest" href="mainfest.json" />
            <link rel="icon" href="/assets/favicon.ico" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> 
            <link rel="preconnect" href="https://storage.googleapis.com">
            <link rel="preconnect" href="https://webappapi-dot-micro-enigma-235001.appspot.com">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <meta property="og:type" content="website" />
            <title>ABC Learning</title>
            <meta name="title" content=${title}>
            <meta name="description" content=${description}>
            <meta name="keywords" content="Abc e-learning, abc elearning, study online, practice test, practice question, exam prepare, asvab, teas exam, cdl test, cdl practice, cissp exam, cissp practice, accuplacer, comptia practice test, comptia A+, compTIA Network, comptia security, dmv, dmv practice test, driving theory, driving theory UK, G1 test, GED, hesi, hesi A2, motorcycle permit, pmp, pmp exam, ptcb, ptce, real estate exam, practice app, practice test onl, free practice test, free practice questions, free practice app">
            <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
            <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
            <style>.content-home-page{flex:auto}.content-home-page .main-title{display:flex;align-items:center;justify-content:space-between}.content-home-page .content-panel{align-items:stretch;justify-content:space-between;flex-wrap:wrap}.content-home-page .content-panel .topic-item-panel{box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;padding:20px;width:calc(50% - 10px);box-sizing:border-box;margin-top:10px;margin-bottom:10px;border-radius:5px;cursor:pointer}.content-home-page .content-panel .topic-item-panel>a{display:flex;flex-direction:column;height:100%;align-items:flex-start;text-decoration:none;color:inherit}.content-home-page .content-panel .topic-item-panel>a label{font-weight:500}.content-home-page .content-panel .topic-item-panel>a .parent-line-progress-panel{margin-top:auto}.content-home-page .content-panel .topic-item-panel>a p,.content-home-page .content-panel .topic-item-panel>a span,.content-home-page .content-panel .topic-item-panel>a font{text-indent:0 !important}.content-home-page .content-panel .topic-item-panel>a:hover{text-decoration:none}.user-info-panel .user-avatar-content-panel .parent-app-info-name{box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;padding-bottom:10px;margin-bottom:15px}.user-info-panel .user-avatar-content-panel .parent-app-info-name .app-info-name{display:flex;align-items:flex-start;padding:10px}.user-info-panel .user-avatar-content-panel .parent-app-info-name .app-info-name .app-child-name{padding-top:10px;padding-left:20px}.user-info-panel .user-avatar-content-panel .parent-app-info-name .app-info-name .app-child-name strong{font-size:20px}.user-info-panel .user-avatar-content-panel .parent-app-info-name .link-app-store{border-top:1px solid #ddd;padding-top:15px;display:flex;align-items:center;justify-content:center}.user-info-panel .user-avatar-content-panel .parent-app-info-name .link-app-store a img{width:120px}.user-info-panel .review-app-slider{margin:-10px}.user-info-panel .review-app-slider .review-app-item{padding:10px}.user-info-panel .review-app-slider .review-app-item>div{box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;padding:15px}.user-info-panel .review-app-slider .review-app-item>div .time{color:#555;font-size:.9em}.user-info-panel .review-app-slider .review-app-item .dot-3{min-height:72px}@media screen and (max-width: 768px){.content-home-page .content-panel .topic-item-panel{width:100%}.user-info-panel .user-info-content-panel{order:2}.user-info-panel .user-info-content-panel>p:first-child{margin-top:0}.user-info-panel .user-avatar-content-panel{order:1;margin-top:20px}}</style>
            <style>.logo-web{font-size:20px}.search-panel{padding:1px 10px;padding-right:0;border-radius:5px;background:#efefef;display:flex;align-items:center}.search-panel .search-button{padding:3px;margin-top:-2px;background:transparent;color:var(--main-color);width:40px}.search-panel .search-box{width:calc(100% - 40px)}header .logo-web{color:var(--main-color);display:flex;align-items:center;justify-content:center}header .header-tab-panel{padding-top:10px;padding-bottom:10px}footer{background-color:var(--main-color)}footer .logo-web{color:#fff;display:flex;align-items:center}footer .fixed-container{padding-top:5px;padding-bottom:5px}footer #select-languages{padding:5px 10px;min-width:150px}footer .footer-content{display:flex;align-items:center;height:50px}.rating-panel .first-info{flex:1}.rating-panel .second-info{flex:4}.rating-panel .second-info .rate-item-center{width:100%;height:25px;background:rgba(158,158,158,.2);margin-bottom:10px}.rating-panel .second-info .rate-item-center .rate-value{background:#2196f3;height:100%}.rating-panel .three-info{flex:1}.rating-panel .three-info .rate-item-right{margin-bottom:10px}.review-rating-panel .user-rate-item{border-bottom:1px solid #ddd;padding:10px 0}.review-rating-panel .user-rate-item .first-content{flex:1;display:flex;align-items:center}.review-rating-panel .user-rate-item .first-content .avatar img{border-radius:100%;width:50px;margin:0 auto;display:block;padding:10px}.review-rating-panel .user-rate-item .second-content{flex:3}.text-area-widget .text-area-i-p{width:calc(100% - 40px)}.text-area-widget .text-area-i-p .text-area-i{width:100%;border:1px solid #ddd;outline:none;border-radius:3px;padding:10px;box-sizing:border-box}.text-area-widget .button-write-review{width:35px;height:35px}.text-area-widget .button-write-review .icon{font-size:17px}.exam-item-panel{width:250px;border:1px solid #ddd;margin-bottom:20px;margin-right:20px;cursor:pointer}.exam-item-panel .avatar{border-bottom:1px solid #ddd}.exam-item-panel .avatar img{width:100%}.exam-item-panel .content-item-panel{padding:10px}.exam-item-panel .content-item-panel .title{font-weight:bold}.exam-item-panel .content-item-panel .rating-course-item{display:flex;align-items:center}.exam-item-panel .content-item-panel .star-panel{width:calc(100% - 95px)}.exam-item-panel .content-item-panel .total-ratings{font-size:12px;width:95px}.exam-item-panel:hover .avatar{position:relative}.exam-item-panel:hover .avatar:before{content:"";position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5)}.border-b-tab-panel .MuiTabs-scroller.MuiTabs-scrollable{border-bottom:1px solid #ddd}.body-panel{width:100%;height:100%;display:flex;flex-direction:column}.main-app-bar{background-color:var(--main-color) !important;color:#fff}.main-app-bar .header-tabs-panel .header-tab-button{color:#fff;border-radius:0;padding:15px 30px}.main-app-bar .header-tabs-panel .header-tab-button.active{color:#ff0;border-bottom:3px solid}.main-title>span{position:relative}.main-title>span:before{content:"";position:absolute;bottom:-23px;width:100%;border-bottom:3px solid var(--main-color)}.line-progress-panel{position:relative;width:100%;height:15px;background-color:#eee;border-radius:15px}.line-progress-panel .content-line-progress-panel{background-color:#adff2f;height:100%;position:absolute;top:0;left:0;border-radius:15px}.floating-button-test{position:fixed !important;bottom:70px;right:30px;width:90px !important}.dot-1{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.dot-2{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.dot-3{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.dot-4{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4}.dot-5{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5}.dot-6{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6}.dot-7{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:7}.dot-8{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:8}.dot-9{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:9}.dot-10{overflow:hidden !important;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:10}html::-webkit-scrollbar{width:10px;height:10px}html::-webkit-scrollbar-track{box-shadow:inset 0 0 3px #999;border-radius:10px}html::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 300px #999}body::-webkit-scrollbar{width:10px;height:10px}body::-webkit-scrollbar-track{box-shadow:inset 0 0 3px #999;border-radius:10px}body::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 300px #999}.my-modal{display:flex;align-items:center;justify-content:center}.my-modal *[tabindex="-1"]{outline:none}.my-modal .my-modal-content{width:600px;min-height:300px;background-color:#fff;display:flex;flex-direction:column;outline:none;box-shadow:0 0 6px 4px #333;border-radius:3px}.my-modal .my-modal-content .my-modal-header{width:100%;height:40px;background-color:var(--main-color);display:flex;align-items:center;justify-content:space-between;color:#fff;border-top-left-radius:3px;border-top-right-radius:3px;font-weight:600}.my-modal .my-modal-content .my-modal-header .close-icon-button{color:#fff}.my-modal .my-modal-content .my-modal-header:before{content:""}.my-modal .my-modal-content .my-modal-body{width:100%}.my-modal .my-modal-content .my-modal-footer{width:100%;height:40px;margin-top:auto;border-bottom-left-radius:3px;border-bottom-right-radius:3px;border-top:1px solid #ddd}.space-height{width:100%;height:50px}@media screen and (max-width: 500px){.space-height{height:10px}.my-modal .my-modal-content{width:100%}.main-app-bar .logo-web{width:50px;padding:5px 10px}.main-app-bar .header-tabs-panel{width:calc(100% - 70px)}.main-app-bar .header-tabs-panel .header-tab-button{padding:7px 0;width:33.33%}.floating-button-test{bottom:15px;right:15px}}.my-alert{position:fixed;top:56px;left:0;z-index:9999;width:100%;height:60px}.my-alert.success{color:#b7dfb9;background-color:#071107}.my-alert.info{color:#a6d5fa;background-color:#030e18}.my-alert.warning{color:#ffd599;background-color:#190f00}.my-alert.error{color:#fab3ae;background-color:#180605}.image-in-question{cursor:pointer;display:inline-block;vertical-align:middle}.state-info-panel{display:grid;grid-template-columns:100%;grid-gap:5px}.state-info-panel .state-item{justify-content:flex-start}.state-info-panel .state-item.active{color:#fff;background-color:var(--main-color)}</style>
            <style>.landing-page header{background:url(assets/be1201d0e73bae05a8eb91ff52633b7f.jpg) no-repeat;background-size:cover}.landing-page header .logo{text-decoration:none;color:#fff}.landing-page header .logo strong{font-size:30px;letter-spacing:-1px;line-height:0;padding-left:2px}.landing-page header .logo div{line-height:.6;font-weight:500}.landing-page header .menu-appbar{display:flex;align-items:center}.landing-page header .menu-appbar ul{display:flex;align-items:center;list-style-type:none}.landing-page header .menu-appbar ul li{margin-right:10px}.landing-page header .menu-appbar ul li .header-button{color:#fff}.landing-page header .menu-appbar ul li:last-child{margin-right:0}.landing-page header .menu-appbar .header-button-right{background-color:rgba(255,255,255,.5)}.landing-page header .menu-appbar .space-header{width:100px}.landing-page header .header-content{color:#fff}.landing-page header .header-content h1{font-size:40px}.landing-page header .header-image-content{display:flex;align-items:flex-end;justify-content:center}.landing-page header .header-image-content .my-image{display:flex;align-items:flex-end}.landing-page header .header-image-content .my-image img{max-width:400px;width:100%}.landing-page .feedback-slider .slick-arrow{background-color:#fff;width:35px;height:35px;box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;border-radius:100%}.landing-page .feedback-slider .slick-arrow:before{color:#333}.landing-page .feedback-slider .slick-arrow:hover{background-color:#673ab7}.landing-page .feedback-slider .slick-arrow:hover:before{color:#fff}.landing-page .title-block{display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;margin-bottom:20px}.landing-page .title-block .description{max-width:500px;color:#555}.landing-page .statictis-apps{margin-top:30px}.landing-page .statictis-apps .image-statictis-apps img{max-width:500px;width:100%}.landing-page .statictis-apps .statictis-apps-items{display:flex;align-items:center;flex-wrap:wrap}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item{width:50%;max-width:250px}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item .image{width:50px;height:50px;background-color:rgba(255,0,0,.2);color:red;border-radius:10px;display:flex;align-items:center;justify-content:center}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item .info{padding-top:20px;padding-right:20px}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item .info p{color:#555}.landing-page .statictis-apps .list-number{padding:30px 0}.landing-page .statictis-apps .list-number .active-item strong{font-size:35px;color:#639;margin-right:10px;font-weight:bold}.landing-page .statictis-apps .list-number .active-item span{color:#555}.landing-page .feedback-apps{background-color:#eaeaea;padding:50px 0}.landing-page .feedback-apps .feedback-item{padding:30px 40px}.landing-page .feedback-apps .feedback-item>div{box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;background-color:#fff;padding:30px;color:#555}.landing-page .feedback-apps .feedback-item>div .info strong{color:#333}.landing-page .feedback-apps .feedback-item>div .info .border{width:3px;height:40px;margin-right:20px;background-color:#ddd}.landing-page .feedback-apps .feedback-item .dot-7{min-height:168px}.landing-page .list-great-apps .app-info-item{cursor:pointer}.landing-page .list-great-apps .app-info-item>a{padding:0;height:100%}.landing-page .list-great-apps .app-info-item>a .MuiButton-label{box-shadow:0 0 6px 4px rgba(185,185,185,.5);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-direction:column;height:100%;width:100%;box-sizing:border-box;padding:15px}.landing-page .list-great-apps .app-info-item>a .MuiButton-label img{border-radius:20px}.landing-page .list-great-apps .app-info-item .title{text-align:center;margin-bottom:15px;margin-top:7px}.landing-page .list-great-apps .app-info-item .rating{margin-top:auto}@media(max-width: 500px){.landing-page header .header-tab-panel .parent-logo{padding-top:15px}.landing-page header .header-tab-panel .menu-appbar{flex-direction:column}.landing-page header .header-tab-panel .menu-appbar ul{padding:0}.landing-page header .header-tab-panel .menu-appbar ul li{margin-right:0}.landing-page header .header-tab-panel .menu-appbar .space-header{width:unset}.landing-page .statictis-apps .statictis-apps-items{padding-top:20px}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item{width:100%;max-width:100%;display:flex;align-items:flex-start;justify-content:space-between}.landing-page .statictis-apps .statictis-apps-items .statictis-app-item .info{width:calc(100% - 65px);padding:0}.landing-page .statictis-apps .active-item{text-align:center}.landing-page .feedback-apps{padding:10px 0}.landing-page .feedback-apps .title-block{margin-bottom:0}.landing-page .feedback-apps .feedback-slider .slick-arrow.slick-next{right:0}.landing-page .feedback-apps .feedback-slider .slick-arrow.slick-prev{left:0}.landing-page .feedback-apps .feedback-slider .slick-dots{bottom:0;overflow-x:auto;white-space:nowrap}}</style>
            <style id="jss-server-side">${css}</style>

            <style>
                :root {
                    --main-color: #3f51b5;
                    --main-background-color: #f8fdff;
                }

                body {
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    position: absolute;
                    height: 100%;
                    width: 100%;
                }

                code {
                    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
                        monospace;
                }
            
                #root {
                  width: 100%;
                  height: 100%;
                }

                .main-loading {
                  background: rgba(0, 0, 0, 0.2);
                  position: fixed;
                  z-index: 1;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .lds-dual-ring {
                  display: inline-block;
                  width: 80px;
                  height: 80px;
                }

                .lds-dual-ring:after {
                  content: " ";
                  display: block;
                  width: 64px;
                  height: 64px;
                  margin: 8px;
                  border-radius: 50%;
                  border: 6px solid #fff;
                  border-color: #fff transparent #fff transparent;
                  animation: lds-dual-ring 1.2s linear infinite;
                }

                @keyframes lds-dual-ring {
                  0% {
                      transform: rotate(0deg);
                  }
              
                  100% {
                      transform: rotate(360deg);
                  }
                }
            </style>
            </head>
            <body>
                <div id = "root">${content}</div>
                <script type="text/javascript" charset="utf-8">
                    window.__INITIAL_STATE__ = ${serialize(store.getState())};
                </script>
                <script src="bundle.js"></script>

            </body>
        </html>
    `;
};

export default renderer;
//# sourceMappingURL=renderer.js.map
