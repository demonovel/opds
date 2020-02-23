import { NextPageContext } from 'next/dist/next-server/lib/utils';
import { fetchApi } from './index';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';

export default async (body, init?: RequestInit, ctx?: NextPageContext) => {

	if (body && typeof body !== 'string' && !(body instanceof URLSearchParams))
	{
		body = JSON.stringify(body)
	}

	return fetchApi(ctx, '/api/search', {
		method: 'GET',
		cache: 'default',
		headers: {
			'Content-Type': 'application/json',
		},
		...init,
		body,
	})
		.then(v => v.json())
		.then<ICachedJSONRowPlus[]>(v =>
		{
			if (Array.isArray(v))
			{
				return v
			}

			console.error(v);

			return Promise.reject(v)
		})
	;
}
