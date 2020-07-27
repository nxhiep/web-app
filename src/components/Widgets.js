import { Box, Button, CircularProgress, Container, Fab, Grid, InputBase, TextareaAutosize, Typography } from '@material-ui/core';
import { Search as SearchIcon, Send as SendIcon } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Image from './Image';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

function FixedContainer (props) {
    return (React.createElement(React.Fragment, null,
        React.createElement(Container, { fixed: true, className: 'fixed-container' + (props.className ? ' ' + props.className : ''), style: props.style },
            React.createElement(Typography, { component: "div", style: {} }, props.children))));
};
function SearchTextBox (props){
    const [value, setValue] = useState("");
    let history = useHistory();
    const onSearch = () => {
        console.log("SEARCH_SCREEN");
        // window.location.href = Routes.SEARCH_SCREEN + '?v=' + value;
        // history.push(Routes.SEARCH_SCREEN + '?appId='+appId+'&v=' + value);
    };
    return (React.createElement("div", { className: 'search-panel', style: { backgroundColor: props.backgroundColor } },
        React.createElement(InputBase, {
            placeholder: "Search for anything...", className: 'search-box', onChange: (event) => {
                setValue(event.target.value);
            }, onKeyDown: (event) => {
                if (event.keyCode === 13) {
                    onSearch();
                }
            }
        }),
        React.createElement(Button, { type: "submit", className: 'search-button', "aria-label": "search", onClick: onSearch },
            React.createElement(SearchIcon, null))));
};
function RatingWidget ({ values = [], className = '', size = '', }) {
    size = size ? size : "medium";
    let total = 0;
    let value = 0;
    values.forEach((item, index) => {
        if (index > 0) {
            value += item * index;
            total += item;
        }
    });
    if (value > 0 && total > 0) {
        value = Math.round((value / total) * 10) / 10;
    }
    return (React.createElement("div", { className: className },
        React.createElement(Grid, { className: "star-panel", container: true, direction: "row", alignItems: "center" },
            React.createElement(Rating, { name: "half-rating", max: 5, precision: 0.5, value: value, readOnly: true, size: "small" }),
            React.createElement("div", null, value)),
        React.createElement("div", { className: "total-ratings" },
            "(",
            total,
            " ratings)")));
};
function RatingPanel ({ values = [], onWriteReview = () => { } }) {
    let total = 0;
    let value = 0;
    values.forEach((item, index) => {
        if (index > 0) {
            value += item * index;
            total += item;
        }
    });
    if (value > 0 && total > 0) {
        value = Math.round((value / total) * 10) / 10;
    }
    let listCenter = [];
    let listRight = [];
    for (let number = 1; number < 6; number++) {
        let element = values[number] ? values[number] : 0;
        let percent = total > 0 ? (element / total) * 100 : 0;
        listCenter.push(React.createElement(Box, { key: 'rate-center-item-' + number, className: 'rate-item-center' },
            React.createElement("div", { className: 'rate-value', style: { width: percent + "%" } })));
        listRight.push(React.createElement(Grid, { key: 'rate-right-item-' + number, className: "rate-item-right", container: true, direction: "row", alignItems: "center" },
            React.createElement(Rating, { name: "half-rating", max: 5, precision: 1, value: value, readOnly: true }),
            React.createElement("div", null,
                (Math.round(percent * 10) / 10),
                "%")));
    }
    const [writeReview, setWriteReview] = useState(false);
    const [rateValue, setRateValue] = useState(0);
    return (React.createElement(Grid, { container: true, direction: "column", alignItems: "flex-end" },
        React.createElement(Button, {
            variant: "contained", color: "primary", onClick: () => {
                setWriteReview(!writeReview);
            }
        }, "Write Review"),
        React.createElement(Grid, { className: "rating-panel", container: true, direction: "row", alignItems: "center" },
            React.createElement("div", { className: 'first-info' },
                React.createElement("h1", null, value),
                React.createElement(Grid, { container: true, direction: "row", alignItems: "center" },
                    React.createElement(Rating, { name: "half-rating", max: 5, precision: 0.5, value: value, readOnly: true }),
                    React.createElement("div", null, value))),
            React.createElement("div", { className: 'second-info' }, listCenter.reverse()),
            React.createElement("div", { className: 'three-info' }, listRight.reverse())),
        React.createElement(Box, { component: 'div', style: { display: writeReview ? 'block' : 'none', width: '100%', border: '1px solid #ddd', padding: '10px' } },
            React.createElement(Rating, {
                name: "half-rating", max: 5, precision: 0.5, value: rateValue, onChange: (event) => {
                    setRateValue(parseInt(event.target.value));
                }
            }),
            React.createElement(TextAreaWidget, {
                onChange: (content) => {
                    if (!rateValue || rateValue < 1) {
                        window.alert('what the hell? rateValue = ' + rateValue);
                        return;
                    }
                    onWriteReview(content, rateValue);
                }
            }))));
};
function LoadingWidget (props) {
    let { color, width, height, fixed } = props;
    if (!color) {
        color = "var(--main-color)";
    }
    let style = { color: color, textAlign: "center", margin: "15px auto" };
    if (width) {
        style.width = width;
    }
    if (height) {
        style.height = height;
    }
    if (fixed) {
        return (React.createElement(Grid, {
            container: true, justify: "center", alignItems: "center", style: {
                position: 'fixed', width: '100%',
                height: '100%', zIndex: 9999, backgroundColor: 'white'
            }
        },
            React.createElement("div", { style: style },
                React.createElement(CircularProgress, { style: { color: 'var(--main-color)' } }))));
    }
    return (React.createElement(Grid, { container: true, justify: "center", alignItems: "center", style: style },
        React.createElement(CircularProgress, { color: "inherit" })));
};
function TextAreaWidget ({ onChange }) {
    const [value, setvalue] = useState("");
    return (React.createElement(Grid, { className: 'text-area-widget', container: true, direction: "row" },
        React.createElement(Box, { className: 'text-area-i-p' },
            React.createElement(TextareaAutosize, { className: 'text-area-i', placeholder: "Enter to text...", onChange: (event) => setvalue(event.target.value) })),
        React.createElement(Fab, {
            className: 'button-write-review', color: "primary", "aria-label": "add", onClick: () => {
                onChange(value);
            }
        },
            React.createElement(SendIcon, { className: 'icon' }))));
};
function MainWidget (props) {
    let className = props.className;
    return (React.createElement("div", { className: 'body-panel' + (className ? ' ' + className : '') }, props.children));
};
function TabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    return (React.createElement(Typography, Object.assign({ component: "div", role: "tabpanel", hidden: value !== index, id: `scrollable-auto-tabpanel-${index}`, "aria-labelledby": `scrollable-auto-tab-${index}` }, other), value === index && React.createElement(Box, { p: 3 }, children)));
};
function LineProgress ({ percent, size }) {
    return (React.createElement(Grid, { className: "parent-line-progress-panel", container: true, direction: "row", alignItems: "center" },
        React.createElement("div", { className: "line-progress-panel", style: { 'height': size, 'width': 'calc(100% - 40px)' } },
            React.createElement("div", { style: { 'width': percent + '%' }, className: "content-line-progress-panel" })),
        React.createElement("div", { style: { 'width': '40px', 'textAlign': 'right' } },
            percent,
            "%")));
};
function TitleBlock ({ title = '', description = '', image = '' }) {
    return (React.createElement("div", { className: "title-block" },
        image ? React.createElement(Image, { src: image }) : '',
        React.createElement("h2", { className: "title" }, title),
        description ? React.createElement("p", { className: "description" }, description) : ''));
};
export { TitleBlock, FixedContainer, SearchTextBox, RatingWidget, RatingPanel, LoadingWidget, MainWidget, TabPanel, LineProgress, };
