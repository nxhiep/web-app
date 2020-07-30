import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { StaticRouter } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { Provider } from 'react-redux';
const renderer = (req, store, context, initialState) => {
    // let loadableState = {};
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <App></App>
            </StaticRouter>
        </Provider>

    );
    // loadableState = await getLoadableState(content);
    return `
        <!DOCTYPE html>
        <html>
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-functions.js"></script>
            <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
            <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
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
            

            <head>
            <body>
                <div id = "root">${content}</div>   
                <script src = "/bundle.js"></script>
                <script type="text/javascript" charset="utf-8">
                    window.__INITIAL_STATE__ = ${serialize(initialState)};
                </script>

            </body>
        </html>
    `;
};

export default renderer;
//# sourceMappingURL=renderer.js.map
