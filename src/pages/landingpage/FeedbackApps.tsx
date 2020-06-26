import { Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { FixedContainer, LoadingWidget, TitleBlock } from '../../components/Widgets';
import UserRate from '../../models/UserRate';
import { getUserRatesPerfectest } from '../../redux/actions';
import { AppState } from '../../redux/appstate';
import { UserRateState } from '../../redux/reducers/userRate';
import { formatDate } from '../../utils';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const FeedbackAppsUI: FunctionComponent<({
    getUserRatesPerfectest: any,
    userRateState: UserRateState
    })> = ({
    getUserRatesPerfectest,
    userRateState
    }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: isMobile ? 1 : 3,
        className: "feedback-slider",
    };
    useEffect(() => {
        getUserRatesPerfectest();
    }, []);
    let userRates: Array<UserRate> = [];
    for(let i = 0; i < userRateState.perfectest.length; i++){
        if(i < 6){
            userRates.push(userRateState.perfectest[i]);
        } else {
            break;
        }
    }
    console.log("XXXXX userRates", userRates);
    return (
        <section className="feedback-apps">
            <FixedContainer>
                <TitleBlock 
                    title="What our clients say" 
                />
                <Slider {...settings}>
                    {
                        userRates && userRates.length > 0 ? userRates.map((userRate: UserRate) => {
                            return <FeedbackItem 
                                key={"FeedbackItem-" + userRate.id}
                                // value={userRate.rateValue}
                                value={5}
                                content={userRate.content}
                                name={userRate.userName}
                                createTime={userRate.createDate}
                            />
                        }) : <LoadingWidget />
                    }
                </Slider>
            </FixedContainer>
        </section>
    );
}

const FeedbackItem: FunctionComponent<({
    value: number,
    content: string,
    name: string,
    createTime: number
    })> = ({
        value = 0,
        content = '',
        name = '',
        createTime = 0,
    }) => {
    return (
        <div className="feedback-item">
            <div>
                <Rating size="small" value={value} readOnly />
                <p className="dot-7">{content}</p>
                <br />
                <Grid container alignItems="center" className="info">
                    <span className="border"></span>
                    <div>
                        <strong>{name}</strong>
                        <div >{formatDate(createTime)}</div>
                    </div>
                </Grid>
            </div>
        </div>
    );
}
const mapStateToPropsUserRate = (state: AppState, ownProps: any) => {
    return {
        userRateState: state.userRateState,
        ...ownProps
    };
}

const mapDispatchToPropsUserRate = (dispatch: any) => ({
    getUserRatesPerfectest: () => dispatch(getUserRatesPerfectest()),
});

export default connect(mapStateToPropsUserRate, mapDispatchToPropsUserRate)(FeedbackAppsUI);