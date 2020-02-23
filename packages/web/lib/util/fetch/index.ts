import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next/dist/next-server/lib/utils';

export const fetchApi = (async (ctx: NextPageContext, input: string, init?: RequestInit) =>
{
	if (typeof window === 'undefined' && ctx)
	{
		let host = (ctx?.req?.headers?.host ?? ctx?.req?.headers?.['x-now-deployment-url'] ?? 'localhost');

		input = new URL(input as string, `http://${host}`).href
	}

	if (init?.method === 'GET' && init.body)
	{
		if (init.body instanceof URLSearchParams)
		{
			input += '?' + init.body.toString();
			delete init.body
		}
		else
		{
			init.method = 'POST';
		}
	}

	console.dir({
		input,
		init,
	})

	return fetch(input, init);
});

export default fetch
