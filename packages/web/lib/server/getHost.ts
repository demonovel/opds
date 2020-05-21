import { AppContext } from 'next/dist/pages/_app';
import { DocumentContext, NextPageContext } from 'next/dist/next-server/lib/utils';
import getCTX from '../util/nextjs/getCTX';
import { isZeitNow } from '../util/nextjs/zeit-now';
import isReqHttps from 'is-req-https2';
import originalUrl from 'original-url2';

export function getHost<T extends AppContext | DocumentContext | NextPageContext>(_ctx: T)
{
	const ctx = getCTX(_ctx);
	const secure = isReqHttps(ctx.req);
	let hostname: string;
	let isZeitNowServer: '1' | '0';

	if (typeof window === 'undefined')
	{
		let host = isZeitNow(ctx);

		if (host)
		{
			hostname = host
			isZeitNowServer = '1'
		}
	}

	let data = originalUrl(ctx.req);

	if (!hostname)
	{
		if (data.hostname)
		{
			hostname = data.hostname
		}
	}

	let url = new URL(data.full ? data.full : data.host);
	if (secure)
	{
		url.protocol = 'https:';
	}
	url.hostname = hostname ? hostname : data.hostname;

	return {
		isZeitNowServer,
		secure,
		origin: url.origin,
		hostname: url.hostname,
		host: url.host,
	}
}

export default getHost
