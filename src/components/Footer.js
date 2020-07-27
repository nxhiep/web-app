import { Box, Grid } from '@material-ui/core';
import React from 'react';
import Logo from '../resources/images/logo.png';
import { FixedContainer } from './Widgets';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Link} from 'react-router-dom'
const Footer = ({ alt = '' }) => {
    const theme = useTheme();
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
                        <img alt={alt} src={Logo} />
                    </Link>
                </Grid>
                {/* <LanguagePanel /> */}
            </div>
        </FixedContainer>
    </Box>);
};
export default Footer;
