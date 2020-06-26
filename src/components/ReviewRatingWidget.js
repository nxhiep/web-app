import { Box, Button, Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Config from '../config';
import { getUserRates } from '../redux/actions/rate';
import { getAvatarFromUserId } from '../services';
import { timeSince } from '../uitls';
import { LoadingWidget } from './Widgets';

class ReviewRatingWidget extends Component {

    constructor(props) {
        super(props);
        this.state = { examId: props.examId, offset: 0 };
    }

    componentDidMount() {
        this.onSeeMore();
    }

    onSeeMore() {
        this.props.getUserRateByExamId(this.state.examId, this.state.offset, this.state.offset + Config.LIMIT_USER_RATING);
        this.setState({
            offset: this.state.offset + Config.LIMIT_USER_RATING
        });
    }

    render() {
        if(this.props.loading === true || !this.props.userRates){
            return <LoadingWidget />
        }
        let userRates = this.props.userRates;
        let listRatingItem = [];
        if(userRates){
            for(let i = 0; i < userRates.length; i++){
                listRatingItem.push(<UserRateItem userRate={userRates[i]} key={'user-rate-' + userRates[i]._id} />);
            }
        }
        return (
            <Box className={'review-rating-panel'}>
                <h2>Reviews</h2>
                <hr />
                <Box>
                    {listRatingItem.length > 0 ? listRatingItem : <Box>Empty!</Box>}
                </Box>
                <Grid 
                    container
                    justify={'center'}
                    style={{padding: "20px 0"}}
                >
                    <Button variant="outlined" color="primary" onClick={()=> {
                        this.onSeeMore()
                    }}>See More Reviews</Button>
                </Grid>
            </Box>
        );
    }
}

const UserRateItem = ({userRate}) => {
    let avatar = getAvatarFromUserId(userRate.userId);
    // console.log('xxxx',userRate);
    let timeAgo = new Date().getTime() - userRate.lastUpdate;
    return (
        <Grid
            className={'user-rate-item'}
            container
            direction={'row'}
        >
            <div className={'first-content'}>
                <Box className={'avatar'}><img alt="" src={avatar} /></Box>
                <div>
                    <div>{timeSince(timeAgo) + " ago"}</div>
                    <div><b>{userRate.userName}</b></div>
                </div>
            </div>
            <div className={'second-content'}>
                <Rating value={userRate.rateValue} max={5} precision={0.5} readOnly />
                <p>{userRate.content}</p>
                <Box className={'info-panel'}>
                    <span>Was this review helpful?</span>
                    <Button>Yes</Button>
                    <Button>No</Button>
                    <Button>Report</Button>
                </Box>
            </div>
        </Grid>
    );
}

const mapStateToProps = (state, ownProps) => {
    return state.userRateReducer;
}

const mapDispatchToProps = dispatch => ({
    getUserRateByExamId: (id, offset, limit) => dispatch(getUserRates(id, offset, limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewRatingWidget);