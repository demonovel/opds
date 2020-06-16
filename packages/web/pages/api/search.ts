import { NextApiRequest, NextApiResponse } from 'next';
import { array_unique_overwrite } from 'array-hyper-unique';
import sortUpdatedComp from 'build-json-cache/lib/util/sortUpdated';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import { testRe, toRe } from '../../lib/novel/search';
import { handleBuildJsonCacheList } from '../../lib/novel';
import { importBuildJsonCache } from '../../lib/novel/loader';
import { PassThrough } from "stream";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '1mb',
		},
	},
};

async function API_HANDLER(req: NextApiRequest, res: NextApiResponse)
{
	let query = {
		...req.query,
		...req.body,
	};

	let {
		title = query.titles,
	} = query;

	if (query.all === 'false' || query.all === '0')
	{
		query.all = false;
	}
	if (query.full === 'false' || query.full === '0')
	{
		query.full = false;
	}

	let data: ICachedJSONRowPlus[];

	console.log({
		title,
		query,
	});

	if (title && title.length)
	{
		data = await importBuildJsonCache<[string, string[]][]>('titles')
			.then(async (list) =>
			{
				let rs = toRe(title, {
					or: true,
					full: query.full,
				});

				console.log(rs)

				let ids: string[] = [];

				if (!rs.length)
				{
					return [] as ICachedJSONRowPlus[];
				}

				list
					.filter(([title, ls]) =>
					{
						let bool = testRe(rs, title);

						if (bool)
						{
							ids.push(...ls);
						}
					})
				;

				array_unique_overwrite(ids);

				return importBuildJsonCache<Record<string, ICachedJSONRowPlus>>('build.all')
					.then(data =>
					{
						return ids.map(uuid => data[uuid]);
					})
					;
			})
	}

	let q2 = {
		...query,
	};

	delete q2.title;
	delete q2.titles;
	delete q2.full;
	delete q2.all;

	let q3 = {} as Record<keyof ICachedJSONRowPlus, RegExp[]>;

	let bool = query.all || Object.entries(q2)
		.map(([k, v]) =>
		{

			q3[k] = toRe(v as any, {
				or: true,
				full: query.full,
			});

			return q3[k];
		})
		// @ts-ignore
		.some((v: string) => Boolean(v && v.length))
	;

	/*
	let { tags, content, authors } = query as any as Record<string, RegExp[]>;

	tags = toRe(tags as any, {
		or: true,
		full: query.full,
	});
	content = toRe(content as any, {
		or: true,
		full: query.full,
	});
	authors = toRe(authors as any, {
		or: true,
		full: query.full,
	});

	 */

	if (bool)
	{
		if (typeof data === 'undefined')
		{
			data = await importBuildJsonCache<ICachedJSONRowPlus[]>('build.all.array');
		}
	}

	console.log({
		all: query.all,

		...q2,
	});

	if (data && data.length)
	{
		data = data.filter(item =>
		{

			let bool = true;

			bool = (Object.entries(q3) as any as ([string, RegExp[]])[])
				.every(([k, v]) =>
				{

					if (!v.length)
					{
						delete q3[k]
					}
					else
					{
						bool = testRe(q3[k], item[k])
					}

					return bool;
				})
			;

			/*
			if (bool && tags.length)
			{
				bool = item?.tags?.some(target => testRe(tags, target))
			}

			if (bool && content.length)
			{
				bool = testRe(content, item.content)
			}

			if (bool && authors.length)
			{
				bool = testRe(authors, item.authors)
			}
			 */

			return bool
		});
	}

	if (data)
	{
		data = handleBuildJsonCacheList(data);

		if (req.method === 'GET')
		{
			res.setHeader('Cache-Control', `public, max-age=${3600 * 12}`);
		}

		let readStream = new PassThrough();
		readStream.end(JSON.stringify(data));

		res.setHeader('Content-Type', `application/json; charset=UTF-8`);
		return readStream.pipe(res);

		return res
			.json(data)
			;
	}
	else
	{
		console.dir(req)
		console.dir({
			q2,
			q3,
		})
	}

	res
		.status(400)
		.json({
			error: true,
			query,
		})
	;
};

export default (req: NextApiRequest, res: NextApiResponse, ...argv) =>
{
	return Promise.resolve()
		// @ts-ignore
		.then(v => API_HANDLER(req, res, ...argv))
		.catch(e =>
		{
			if (process.env.NODE_ENV === 'production')
			{
				return res
					.status(500)
					.json({
						error: true,
						message: String(e),
					})
					;
			}

			return Promise.reject(e);
		})
		;
}
