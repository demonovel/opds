import { NextPageContext } from 'next/dist/next-server/lib/utils';
import { fetchApi } from './index';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';

export default async (body, init?: RequestInit, ctx?: NextPageContext) => {

	console.dir(body)

	if (body && typeof body !== 'string')
	{
		if (!(body instanceof URLSearchParams))
		{
			let p = new URLSearchParams;

			for (let key in body)
			{
				if (Array.isArray(body[key]))
				{
					body[key].forEach(v => p.append(key, v))
				}
				else
				{
					p.append(key, body[key])
				}
			}

			body = p;
		}

		//body = JSON.stringify(body)
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
