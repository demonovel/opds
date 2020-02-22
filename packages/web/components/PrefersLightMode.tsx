import React, { useState, Dispatch, SetStateAction, useEffect, ReactNode } from "react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider, Theme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Button } from '@material-ui/core';
import { ButtonTypeMap } from '@material-ui/core/Button/Button';

import { useTheme, createTheme, IThemeExtra } from 'material-ui-theme-state/lib/global';

export function prefersLightMode()
{
	try
	{
		return useMediaQuery('(prefers-color-scheme: light)');
	}
	catch (e)
	{

	}
}

export function ButtonTheme(props: ButtonTypeMap["props"] & {
	children: string | ReactNode,
})
{
	const { theme, setTheme } = useTheme();

	let click = () =>
	{
		setTheme(theme => {

				theme.palette.type = (theme.palette.type !== 'light') ? 'light' : 'dark';

			return theme;
		}, true)

	};

	return (<Button variant="contained" color="secondary" {...props} onClick={click}/>)
}

export default function (props)
{
	let bool = prefersLightMode();
	let theme: ThemeOptions | Theme;
	let setTheme: IThemeExtra["setTheme"];

	// @ts-ignore
	([theme, setTheme] = useState({
		palette: {
			type: bool ? 'light': 'dark',
		},
		typography: {
			fontFamily: 'JetBrains Mono, Consolas',
		},
		overrides: {
			MuiCssBaseline: {
				'@global': {
					'@font-face': [{
						'-webkit-font-feature-settings': '"liga" on, "calt" on',
						'-webkit-font-smoothing': 'antialiased',
						textRendering: 'optimizeLegibility',
						fontFamily: ['JetBrains Mono',"Roboto", "Helvetica", "Arial", 'sans-serif'].join(','),
					}],
				},
			},
		},
	}));

	useEffect(() =>
	{
		async function getDate()
		{
			setTheme(theme => {

				theme.palette.type = bool ? 'light' : 'dark';

				return theme;
			})
		}

		getDate();
	}, []);

	const muiTheme = createTheme(theme, {
		setTheme,
	}).theme;

	return (<MuiThemeProvider theme={muiTheme}>{props.children}</MuiThemeProvider>)
}
