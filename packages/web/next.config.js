const withWorkspacesSupport = require('webpack-workspaces-support/nextjs');

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

	withWorkspacesSupport,

], {
	assetPrefix: '.',
}));
