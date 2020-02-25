const withWorkspacesSupport = require('webpack-workspaces-support/nextjs');
const withSass = require('@zeit/next-sass');
const withFonts = require('next-fonts');

console.dir(process.env);

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

	api: {
		bodyParser: true
	},

	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		//
		// This option is rarely needed, and should be reserved for advanced
		// setups. You may be looking for `ignoreDevErrors` instead.
		// !! WARN !!
		ignoreBuildErrors: true,
	},

}));
