import { Box, Button, CircularProgress, Container, Fab, Grid, InputBase, TextareaAutosize, Typography } from '@material-ui/core';
import { Search as SearchIcon, Send as SendIcon } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';
import React, { FunctionComponent, useState } from 'react';
import { useHistory } from "react-router-dom";
import Image from './Image';

const FixedContainer = (props: any) => {
    return (
        <React.Fragment>
            <Container fixed className={'fixed-container' + (props.className ? ' ' + props.className : '')} style={props.style}>
                <Typography component="div" style={{}}>
                    {props.children}
                </Typography>
            </Container>
        </React.Fragment>
    );
}

const SearchTextBox = (props: any) => {
    const [value, setValue] = useState("");
    let history = useHistory();
    const onSearch = () => {
        console.log("SEARCH_SCREEN");
        // window.location.href = Routes.SEARCH_SCREEN + '?v=' + value;
        // history.push(Routes.SEARCH_SCREEN + '?appId='+appId+'&v=' + value);
    }

    return (
        <div className={'search-panel'} style={{ backgroundColor: props.backgroundColor }}>
            <InputBase
                placeholder="Search for anything..."
                className={'search-box'}
                onChange={(event) => {
                    setValue(event.target.value);
                }}
                onKeyDown={(event) => {
                    if (event.keyCode === 13) {
                        onSearch();
                    }
                }}
            />
            <Button
                type="submit"
                className={'search-button'}
                aria-label="search"
                onClick={onSearch}
            >
                <SearchIcon />
            </Button>
        </div>
    );
}

const RatingWidget: FunctionComponent<({ 
    values: Array<number>, 
    className: string, 
    size: number 
    })> = ({ 
    values = [],
    className = '',
    size = '',
    }) => {
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
    return (
        <div className={className}>
            <Grid
                className="star-panel"
                container
                direction="row"
                alignItems="center"
            >
                <Rating name="half-rating" max={5} precision={0.5} value={value} readOnly size="small" />
                <div>{value}</div>
            </Grid>
            <div className="total-ratings">
                ({total} ratings)
            </div>
        </div>
    );
}

const RatingPanel: FunctionComponent<({ 
    values: Array<number>, onWriteReview: any 
    })> = ({
    values = [],
    onWriteReview = () => {}
    }) => {
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
        listCenter.push(<Box key={'rate-center-item-' + number} className={'rate-item-center'}><div className={'rate-value'} style={{ width: percent + "%" }}></div></Box>);
        listRight.push(
            <Grid
                key={'rate-right-item-' + number}
                className={"rate-item-right"}
                container
                direction="row"
                alignItems="center"
            >
                <Rating name="half-rating" max={5} precision={1} value={value} readOnly />
                <div>{(Math.round(percent * 10) / 10)}%</div>
            </Grid>
        );
    }

    const [writeReview, setWriteReview] = useState(false);
    const [rateValue, setRateValue] = useState(0);

    return (
        <Grid
            container
            direction="column"
            alignItems="flex-end"
        >
            <Button variant="contained" color="primary" onClick={() => {
                setWriteReview(!writeReview);
            }}>Write Review</Button>
            <Grid
                className={"rating-panel"}
                container
                direction="row"
                alignItems="center"
            >
                <div className={'first-info'}>
                    <h1>{value}</h1>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                    >
                        <Rating name="half-rating" max={5} precision={0.5} value={value} readOnly />
                        <div>{value}</div>
                    </Grid>
                </div>
                <div className={'second-info'}>
                    {listCenter.reverse()}
                </div>
                <div className={'three-info'}>
                    {listRight.reverse()}
                </div>
            </Grid>
            <Box component='div' style={{ display: writeReview ? 'block' : 'none', width: '100%', border: '1px solid #ddd', padding: '10px' }}>
                <Rating name="half-rating" max={5} precision={0.5} value={rateValue} onChange={(event: any) => {
                    setRateValue(parseInt(event.target.value));
                }} />
                <TextAreaWidget onChange={(content: string) => {
                    if (!rateValue || rateValue < 1) {
                        window.alert('what the hell? rateValue = ' + rateValue);
                        return;
                    }
                    onWriteReview(content, rateValue);
                }} />
            </Box>
        </Grid>
    );
}

const LoadingWidget = (props: any) => {
    let { color, width, height, fixed } = props;
    if (!color) {
        color = "var(--main-color)";
    }
    let style: any = { color: color, textAlign: "center", margin: "15px auto" };
    if(width){
        style.width = width;
    }
    if(height){
        style.height = height;
    }
    if(fixed){
        return (
            <Grid container justify="center" alignItems="center" 
                style={{position: 'fixed', width: '100%', 
                    height: '100%', zIndex: 9999, backgroundColor: 'white'}}>
                <div style={style}><CircularProgress style={{color: 'var(--main-color)'}} /></div>
            </Grid>
        );
    }
    return (
        <Grid container justify="center" alignItems="center" style={style}><CircularProgress color="inherit" /></Grid>
    );
}

const TextAreaWidget: FunctionComponent<({ onChange: any })> = ({ onChange }) => {
    const [value, setvalue] = useState("");
    return (
        <Grid
            className={'text-area-widget'}
            container
            direction="row"
        >
            <Box className={'text-area-i-p'}>
                <TextareaAutosize className={'text-area-i'} placeholder="Enter to text..." onChange={(event) => setvalue(event.target.value)}></TextareaAutosize>
            </Box>
            <Fab className={'button-write-review'} color="primary" aria-label="add" onClick={() => {
                onChange(value);
            }}><SendIcon className={'icon'} /></Fab>
        </Grid>
    );
}

const MainWidget = (props: any) => {
    let className = props.className;
    return (
        <div className={'body-panel' + (className ? ' ' + className : '')}>
            {props.children}
        </div>
    );
}

const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

const LineProgress: FunctionComponent<({ percent: string, size: string })> = ({ percent, size }) => {
    return (
        <Grid
            className="parent-line-progress-panel"
            container
            direction="row"
            alignItems="center"
        >
            <div className="line-progress-panel" style={{ 'height': size, 'width': 'calc(100% - 40px)' }}>
                <div style={{ 'width': percent + '%' }} className="content-line-progress-panel"></div>
            </div>
            <div style={{ 'width': '40px', 'textAlign': 'right' }}>
                {percent}%
                </div>
        </Grid>
    );
}

const TitleBlock: FunctionComponent<({ 
    title: string, description?: string, image?: string 
    })> = ({ title='', description='', image='' }) => {
    return (
        <div className="title-block">
            {image ? <Image src={image} /> : ''}
            <h2 className="title">{title}</h2>
            {description ? <p className="description">{description}</p> : ''}
        </div>
    );
}

export { TitleBlock, FixedContainer, SearchTextBox, RatingWidget, RatingPanel, LoadingWidget, MainWidget, TabPanel, LineProgress, };

