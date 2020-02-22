const withWorkspacesSupport = require('webpack-workspaces-support/nextjs');
const withSass = require('@zeit/next-sass');
const withFonts = require('next-fonts');

function chain(ls, nextConfig)
{
	return ls.reduce((nextConfig, fn) =>
	{
		return fn(nextConfig)
	}, nextConfig)
}

module.exports = chain([
	(nextConfig) =>
	{
		console.dir(nextConfig, {
			depths: 4,
		});

		return nextConfig;
	},
], chain([

	withSass,
	withFonts,

	withWorkspacesSupport,

], {
	assetPrefix: '.',
}));
