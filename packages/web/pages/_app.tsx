import React, { useState } from 'react'
import App, { Container } from 'next/app';
import PrefersLightMode from '../components/PrefersLightMode';
import CssBaseline from '@material-ui/core/CssBaseline';
import '../assets/styles/style.scss'

export default class MyApp extends App
{
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
