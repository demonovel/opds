import { AppContext } from 'next/dist/pages/_app';
import { DocumentContext, NextPageContext } from 'next/dist/next-server/lib/utils';
import getCTX from '../util/nextjs/getCTX';
import getHost from './getHost';

export function processServerEnv<T extends AppContext | DocumentContext | NextPageContext>(_ctx: T)
{
	let ctx = getCTX(_ctx)

//	// @ts-ignore
//	let { remoteAddress, remoteFamily, remotePort, localAddress, localPort, localFamily } = ctx.req.connection;
//
//	console.dir({
//		remoteAddress,
//		remoteFamily,
//		remotePort,
//		localAddress,
//		localFamily,
//		localPort,
//	})

	let data = getHost(ctx);

	process.env.origin = data.origin;
	process.env.host = data.host;
	process.env.hostname = data.hostname;
	process.env.isZeitNowServer = data.isZeitNowServer;

	console.dir(data)
}
