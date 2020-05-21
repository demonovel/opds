import React, { useState } from 'react'
import App, { Container } from 'next/app';
import PrefersLightMode from '../components/PrefersLightMode';
import CssBaseline from '@material-ui/core/CssBaseline';
import '../assets/styles/style.scss'
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import { processServerEnv } from '../lib/server/env';

export default class MyApp extends App
{
	static async getInitialProps(ctx)
	{
		console.log(`App:getInitialProps`);

		processServerEnv(ctx)

		let props = await App.getInitialProps(ctx);

		return props
	}

	render()
	{
		const { Component, pageProps } = this.props;
		return (
			<React.StrictMode>
				<PrefersLightMode key="PrefersLightMode">
					<CssBaseline />
					<Component {...pageProps} />
				</PrefersLightMode>
			</React.StrictMode>
		)
	}
}
