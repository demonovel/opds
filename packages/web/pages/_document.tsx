import React, { PropsWithChildren, ReactNode } from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document'
import { ServerStyleSheets, ThemeProvider, MuiThemeProvider } from '@material-ui/core/styles';
import { useTheme, createTheme } from 'material-ui-theme-state/lib/global';

export default class MyDocument extends Document
{

	static async getInitialProps(ctx)
	{
		const sheet = new ServerStyleSheets();

		const initialProps = await Document.getInitialProps({
			...ctx,
			renderPage()
			{
				const page = ctx.renderPage(App => props => {

					const { theme, setTheme } = useTheme();

					const muiTheme = createTheme(theme, {
						setTheme,
					}).theme;

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
				{initialProps.styles}
				{sheet.getStyleElement()}
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
