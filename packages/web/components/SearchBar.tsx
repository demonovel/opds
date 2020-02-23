import React, { PropsWithChildren, ReactNode } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import { InputBaseProps } from '@material-ui/core/InputBase/InputBase';
import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon2 from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({

		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginRight: theme.spacing(2),
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(3),
			},
		},
		searchIcon: {
			width: theme.spacing(7),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
			width: '70%',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 7),
			transition: theme.transitions.create('width'),
			width: '70%',
			flex: 1,
		},
	}),
);

export default (prop: InputBaseProps & {
	icon?: ReactNode,
	inputRef?,
	onClose?(),
}) =>
{
	const classes = useStyles();

	let { placeholder = "Search…", icon } = prop;

	if (!icon)
	{
		icon = <SearchIcon />
	}

	return <>
		<div className={classes.search}>
			<div className={classes.searchIcon}>
				{icon}
			</div>
			<InputBase
				placeholder={placeholder}
				{...prop}
				inputProps={{
					'aria-label': 'search',
					...prop.inputProps,
				}}
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
					...prop.classes,
				}}
				endAdornment={<InputAdornment position="end"><IconButton
					aria-label="toggle password visibility"
					onClick={prop.onClose}
					edge="end"
				><CloseIcon/></IconButton></InputAdornment>}
			/>
		</div>
	</>
}
