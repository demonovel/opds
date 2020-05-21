import React, { PropsWithChildren, ReactNode } from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document'
import { ServerStyleSheets, ThemeProvider, MuiThemeProvider } from '@material-ui/core/styles';
import { prefersLightMode } from '../components/PrefersLightMode';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';
import { processServerEnv } from '../lib/server/env';

export default class MyDocument extends Document
{

	static async getInitialProps(ctx)
	{
		console.log(`Document:getInitialProps`);

		processServerEnv(ctx)

		const sheet = new ServerStyleSheets();

		const initialProps = await Document.getInitialProps({
			...ctx,
			renderPage()
			{

				const page = ctx.renderPage(App => props => {

					const muiTheme = createMuiTheme({
						palette: {
							type: prefersLightMode() ? 'light' : 'dark',
							primary: blue,
							secondary: purple,
						},
					});

					return sheet.collect(<MuiThemeProvider theme={muiTheme}>
						<App {...props} />
					</MuiThemeProvider>)
				});

				return page
			}
		});

		return {
			...initialProps,
			styles: (<>
				{sheet.getStyleElement()}
				{initialProps.styles}
			</>),
		}
	}

	/*
	render()
	{
		return (
			<Html>
				<Head>
					{(this.props as any).styleTags}
				</Head>
				<body>
				<Main />
				<NextScript />
				</body>
			</Html>
		)
	}
	 */
}
