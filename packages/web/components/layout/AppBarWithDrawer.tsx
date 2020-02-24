import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState, PropsWithChildren, ReactNode } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import useTheme from '@material-ui/core/styles/useTheme';
import DiscordButton from '../DiscordButton';
import CssBaseline from '@material-ui/core/CssBaseline';

function useStylesWithDrawerWidth(drawerWidth: number)
{
	drawerWidth = drawerWidth | 0 || 240;

	const useStyles = makeStyles((theme: Theme) =>
		createStyles({

			root: {
				display: 'flex',
			},

			appBar: {
				zIndex: theme.zIndex.drawer + 1,
				transition: theme.transitions.create(['width', 'margin'], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
			},

			appBarShift: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(['width', 'margin'], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},

			drawer: {
				width: drawerWidth,
				flexShrink: 0,
				whiteSpace: 'nowrap',
			},
			drawerOpen: {
				width: drawerWidth,
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
			drawerClose: {
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
				overflowX: 'hidden',
				width: theme.spacing(6) + 1,
				[theme.breakpoints.up('sm')]: {
					width: theme.spacing(9) + 1,
				},
			},
			toolbar: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				padding: theme.spacing(0, 1),
				...theme.mixins.toolbar,
			},
			content: {
				flexGrow: 1,
				padding: theme.spacing(3),
			},
		}),
	);

	return useStyles();
}

export default (prop: PropsWithChildren<{
	barChildren?(): ReactNode,
	drawerChildren?(): ReactNode,
	drawerWidth?: number,
}>) => {

	const theme = useTheme();
	const classes = useStylesWithDrawerWidth(prop.drawerWidth);

	const [open, setOpen] = useState(false);

	return (<div className={classes.root}>



		<AppBar
			position="fixed"
			color={"inherit"}
			className={clsx(classes.appBar, {
				[classes.appBarShift]: open,
			})}
		>
			<Toolbar variant="dense">
				<IconButton
					edge="start"
					color="inherit"
					aria-label="open drawer"
					onClick={() => setOpen(true)}
				>
					<MenuIcon />
				</IconButton>

				{prop.barChildren ? prop.barChildren() : ''}

				<DiscordButton/>
			</Toolbar>
		</AppBar>

		<Drawer
			variant="permanent"
			className={clsx(classes.drawer, {
				[classes.drawerOpen]: open,
				[classes.drawerClose]: !open,
			})}
			classes={{
				paper: clsx({
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				}),
			}}
		>
			<div>
				<IconButton onClick={() => setOpen(false)}>
					{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				</IconButton>
			</div>
			<Divider />
			{prop.drawerChildren ? prop.drawerChildren() : ''}
		</Drawer>

		<Container maxWidth={"xl"} className={classes.content}>

			<div className={classes.toolbar} />

			{prop.children}

		</Container>

	</div>)
};
