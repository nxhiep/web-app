"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _App = _interopRequireDefault(require("../App"));

var _reactRouterDom = require("react-router-dom");

var _serializeJavascript = _interopRequireDefault(require("serialize-javascript"));

var _reactRedux = require("react-redux");

var renderer = (req, store, context, initialState) => {
  // let loadableState = {};
  var content = (0, _server.renderToString)( /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.StaticRouter, {
    location: req.url,
    context: context
  }, /*#__PURE__*/_react.default.createElement(_App.default, null)))); // loadableState = await getLoadableState(content);

  return "\n        <!DOCTYPE html>\n        <html>\n            <head>\n            <meta charset=\"UTF-8\" />\n            <link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css\"/>\n            <link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css\"/>\n            <style>\n                :root {\n                    --main-color: #3f51b5;\n                    --main-background-color: #f8fdff;\n                }\n\n                body {\n                    margin: 0;\n                    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\n                        \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\n                        sans-serif;\n                    -webkit-font-smoothing: antialiased;\n                    -moz-osx-font-smoothing: grayscale;\n                    position: absolute;\n                    height: 100%;\n                    width: 100%;\n                }\n\n                code {\n                    font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\n                        monospace;\n                }\n            \n                #root {\n                  width: 100%;\n                  height: 100%;\n                }\n\n                .main-loading {\n                  background: rgba(0, 0, 0, 0.2);\n                  position: fixed;\n                  z-index: 1;\n                  width: 100%;\n                  height: 100%;\n                  display: flex;\n                  align-items: center;\n                  justify-content: center;\n                }\n\n                .lds-dual-ring {\n                  display: inline-block;\n                  width: 80px;\n                  height: 80px;\n                }\n\n                .lds-dual-ring:after {\n                  content: \" \";\n                  display: block;\n                  width: 64px;\n                  height: 64px;\n                  margin: 8px;\n                  border-radius: 50%;\n                  border: 6px solid #fff;\n                  border-color: #fff transparent #fff transparent;\n                  animation: lds-dual-ring 1.2s linear infinite;\n                }\n\n                @keyframes lds-dual-ring {\n                  0% {\n                      transform: rotate(0deg);\n                  }\n              \n                  100% {\n                      transform: rotate(360deg);\n                  }\n                }\n            </style>\n            \n\n            <head>\n            <body>\n                <div id = \"root\">".concat(content, "</div>   \n                <script src = \"/bundle.js\"></script>\n                <script type=\"text/javascript\" charset=\"utf-8\">\n                    window.__INITIAL_STATE__ = ").concat((0, _serializeJavascript.default)(initialState), ";\n                </script>\n            </body>\n        </html>\n    ");
};

var _default = renderer;
exports.default = _default;