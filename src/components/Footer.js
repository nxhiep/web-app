import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { FixedContainer } from './Widgets';
import {  withTheme  } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Link} from 'react-router-dom'
const Footer = ({ alt = '' , theme}) => {
    // const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log("useMediaQuery isMobile", isMobile);
    if (isMobile) {
        return <div></div>;
    }
    return (<Box component="footer" style={{ marginTop: "auto" }}>
        <FixedContainer>
            <div className={'footer-content'}>
                <Grid container direction="row" alignItems="center" justify="space-between">
                    <Link to="/" className={'logo-web'}>
                        <img alt={alt} src={require('../resources/images/logo.svg').default} />
                    </Link>
                </Grid>
                {/* <LanguagePanel /> */}
            </div>
        </FixedContainer>
    </Box>);
};
export default withTheme(Footer);
