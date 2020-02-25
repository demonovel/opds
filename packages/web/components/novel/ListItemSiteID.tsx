import React, { PropsWithChildren, ReactNode, MouseEventHandler, ReactChild } from 'react';
import { EnumHandleClickType, EnumSiteID } from './types';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { AvatarTypeMap } from '@material-ui/core/Avatar/Avatar';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import cyan from '@material-ui/core/colors/cyan';
import blueGrey from '@material-ui/core/colors/blueGrey';

const useStyles = makeStyles((theme: Theme) => createStyles({

	demonovel: {
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.main,
	},

	dmzj: {
		color: theme.palette.getContrastText(cyan[500]),
		backgroundColor: cyan[500],
	},

	wenku8: {
		color: theme.palette.getContrastText(blue[500]),
		backgroundColor: blue[500],
	},

	masiro: {
		color: theme.palette.getContrastText(blueGrey[200]),
		backgroundColor: blueGrey[200],
	},

}));

export default ({
	siteID,
	propAvatar,
	...prop
}: PropsWithChildren<{
	siteID: EnumSiteID,
	onClick?: MouseEventHandler,
	propAvatar?: AvatarTypeMap["props"],
}>) =>
{
	const classes = useStyles();

	let label: ReactChild | string = siteID[0].toUpperCase();

	switch (siteID)
	{
		case EnumSiteID.esjzone:
			label = 'E';
			break;
		case EnumSiteID.masiro:
			label = '真';
			break;
		case EnumSiteID.dmzj:
			label = '動';
			break;
		case EnumSiteID.demonovel:
			label = 'N';
			break;
	}

	if (typeof label === 'string')
	{
		label = (<Avatar className={classes[siteID]} {...propAvatar}>{label}</Avatar>);
	}

	return <ListItem
		button
		dense
		disableGutters
		{...prop}
	>
		<ListItemAvatar>{label}</ListItemAvatar>
		<ListItemText primary={siteID} />
	</ListItem>
}
