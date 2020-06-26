import { Box, Grid, Link } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import Logo from '../resources/images/logo.svg';
import { FixedContainer } from './Widgets';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Footer: FunctionComponent<({ alt?: string })> = ({ alt='' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log("useMediaQuery isMobile", isMobile);
    if(isMobile){
        return <div></div>;
    }
    return (<Box component="footer" style={{marginTop:"auto"}}>
        <FixedContainer>
            <div className={'footer-content'}>
                <Grid container direction="row" alignItems="center" justify="space-between">
                    <Link href="/" className={'logo-web'}>
                        <img alt={alt} src={Logo} />
                    </Link>
                </Grid>
                {/* <LanguagePanel /> */}
            </div>
        </FixedContainer>
    </Box>);
}

// const LanguagePanel = () => {
//     const [language, setLanguage] = useState("en");
//     return (
//         <FormControl variant="filled" color="primary">
//             <Select
//                 value={language} 
//                 id="select-languages" 
//                 style={{ backgroundColor: 'white', borderRadius: '5px' }}
//                 onChange={(event) => {
//                     // console.log(event.target.value);
//                     setLanguage(event.target.value);
//                 }}
//             >
//                 <MenuItem value={'en'}><LanguageItem image={EnglishFlagIcon} title={'English'} /></MenuItem>
//                 <MenuItem value={'vi'}><LanguageItem image={VietNameseFlagIcon} title={'Vietnamese'} /></MenuItem>
//             </Select>
//         </FormControl>
//     );
// }

// const LanguageItem = (props) => {
//     return (
//         <Grid container direction="row" alignItems="center">
//             <img src={props.image} width="30px" height="30px" alt="" />
//             <span style={{ marginLeft: '7px' }}>{props.title}</span>
//         </Grid>
//     );
// }

export default Footer;