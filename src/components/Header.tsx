import { AppBar, Box, Button, Grid, Link } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Logo from '../resources/images/logo.svg';
import Routes from '../routes';
import { FixedContainer } from './Widgets';

const Header: FunctionComponent<({ alt?: string })> = ({ alt='' }) => {
	const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	// console.log('isMobile', isMobile, "width", width, 'height', height);
	if (isMobile) {
		return <HeaderMobile alt={alt} />;
	}
	return <HeaderPC alt={alt} />;
}

const HeaderTabPanel = () => {
	let history = useHistory();
	let { appNameId, screen } = useParams();
	// console.log("appNameId", appNameId, 'screen', screen);
	screen = screen ?? '';
	let homeScreen: boolean = screen.length == 0;
	let studyScreen: boolean = !screen.startsWith('test') && !screen.startsWith('review') && !homeScreen;
	const gotoPage = (event: any, screen?: string) => {
		event.preventDefault();
		history.push(getLink(screen));
	}
	const getLink = (screen?: string) => {
		return '/' + appNameId + (screen ? '/' + screen : '');
	}
	return (
		<div className="header-tabs-panel">
			{
				studyScreen ?
					<Button 
						className={"header-tab-button" + (studyScreen ? ' active' : '')}>Learn</Button>
					: <Button 
						href={getLink()}
						className={"header-tab-button" + (homeScreen ? ' active' : '')} 
						onClick={(event) => gotoPage(event)}>Home</Button>
			}
			<Button 
				href={getLink(Routes.TEST_SCREEN)}
				className={"header-tab-button" + (screen.startsWith(Routes.TEST_SCREEN) ? ' active' : '')} 
				onClick={(event) => gotoPage(event, Routes.TEST_SCREEN)}>Test</Button>
			<Button 
				href={getLink(Routes.REVIEW_SCREEN)}
				className={"header-tab-button" + (screen.startsWith(Routes.REVIEW_SCREEN) ? ' active' : '')} 
				onClick={(event) => gotoPage(event, Routes.REVIEW_SCREEN)}>Review</Button>
		</div>
	);
}

const HeaderMobile: FunctionComponent<({ alt?: string })> = ({ alt }) => {
	let history = useHistory();
	return (
		<AppBar color="inherit" position="static" className="main-app-bar">
			<Grid
				container
				direction="row"
				justify="space-between"
				alignItems="flex-end"
				wrap="nowrap"
			>
				<Link style={{alignSelf: "center"}} href="/" className={'logo-web'} onClick={(event: any) => {
					event.preventDefault();
					history.push('/');
				}}>
					<img alt={alt} src={Logo} />
				</Link>
				<HeaderTabPanel />
			</Grid>
		</AppBar>
	);
}

const HeaderPC: FunctionComponent<({ alt?: string })> = ({ alt }) => {
	let history = useHistory();
	return (
		<AppBar color="inherit" position="static" className="main-app-bar">
			<div>
				<FixedContainer>
					<Grid
						container
						direction="row"
						justify="space-between"
						alignItems="center"
					>
						<Link href="/" className={'logo-web'} onClick={(event: any) => {
							event.preventDefault();
							history.push('/');
						}}>
							<img alt={alt} src={Logo} />
						</Link>
						<HeaderTabPanel />
						<div className="temp-panel"></div>
						<div className="temp-panel"></div>
						{/*<LoginPanel />*/}
					</Grid>
				</FixedContainer>
			</div>
		</AppBar>
	);
}

const LoginPanel = () => {
	return (
		<Box className={'login-panel'} component="span">
			<Button variant="text" color="inherit" style={{ marginRight: '10px', 'color': 'white' }}>Log In</Button>
			<Button variant="contained" color="default" style={{ 'color': 'white', 'backgroundColor': 'rgba(255, 255, 255, 0.5)' }}>Sign Up</Button>
		</Box>
	);
}

export default Header;