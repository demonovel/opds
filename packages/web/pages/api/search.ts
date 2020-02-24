import { NextApiRequest, NextApiResponse } from 'next';
import { handleSearchInput } from '../../lib/util/search';
import zhRegExp from '../../lib/zhRegExp';
import { array_unique_overwrite } from 'array-hyper-unique';
import sortUpdatedComp from 'build-json-cache/lib/util/sortUpdated';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import imgUnsplash from '../../lib/util/img/unsplash';
//import buildJsonCacheCacheTempTitles from 'build-json-cache/.cache/temp/titles.json';

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '1mb',
		},
	},
};

function toRe(input: string | string[], options: {
	full?: boolean,
	or?: boolean,
} = {}): zhRegExp[]
{
	let arr = (Array.isArray(input) ? input : [input])
		.filter(v => typeof v !== 'undefined')
		.map(s =>
		{
			s = handleSearchInput(String(s));

			if (s === '.*' || s === '')
			{
				return;
			}

			if (options.full)
			{
				s = `^${s}$`;
			}

			return s;
		})
		.filter(v => typeof v !== 'undefined' && v.length)
	;

	if (arr.length)
	{
		array_unique_overwrite(arr);

		if (options.or)
		{
			return [new zhRegExp(arr.join('|'), 'ig')];
		}

		return arr.map(s => new zhRegExp(s, 'ig'))
	}

	return [] as zhRegExp[]
}

function testRe(rs: RegExp[], target: string | string[])
{
	if (rs.length === 0)
	{
		return true;
	}

	if (Array.isArray(target))
	{
		return target
			.some(target => rs.some(r => r.test(target)))
	}

	return rs.some(r => r.test(target))
}

function importBuildJsonCache<T>(type: 'titles' | 'build.all' | 'build.all.array'): Promise<T>
{
	let p: Promise<any>;
	if (type === 'titles')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/temp/titles')
		p = import('../../cache/temp/titles')
	}
	else if (type === 'build.all' || type === 'build.all.array')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/build.all')
		p = import('../../cache/build.all')
	}
	/*
	else if (type === 'build.all.array')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/build.all.array')
		p = import('../../cache/build.all.array')
	}
	 */

	return p
		.then((list: any) => list.default || list)
		.then((data) => {

			if (type === 'build.all.array')
			{
				return Object.values(data)
			}

			return data
		})
	;
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
{
	let query = {
		...req.query,
		...req.body,
	};

	let {
		title,
	} = query;

	let data: ICachedJSONRowPlus[];

	if (title && title.length)
	{
		data = await importBuildJsonCache<[string, string[]][]>('titles')
			.then(async (list) =>
			{
				let rs = toRe(title, {
					or: true,
					full: query.full,
				});

				let ids: string[] = [];

				list
					.filter(([title, ls]) =>
					{
						let bool = rs.some(r => r.test(title));

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
	delete q2.full;
	delete q2.all;

	let q3 = {};

	let bool = query.all || Object.entries(q2)
		.map(([k, v]) => {

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
				.every(([k, v]) => {

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
		data
			.sort(sortUpdatedComp)
		;

		if (req.method === 'GET')
		{
			res.setHeader('Cache-Control', `public, max-age=${3600 * 12}`);
		}

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
}
