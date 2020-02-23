import { NextApiRequest, NextApiResponse } from 'next';
import { handleSearchInput } from '../../lib/util/search';
import zhRegExp from '../../lib/zhRegExp';
import { array_unique_overwrite } from 'array-hyper-unique';
import sortUpdatedComp from 'build-json-cache/lib/util/sortUpdated';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
//import buildJsonCacheCacheTempTitles from 'build-json-cache/.cache/temp/titles.json';

function toRe(input: string | string[], options: {
	full?: boolean,
	or?: boolean,
} = {}): zhRegExp[]
{
	let arr = (Array.isArray(input) ? input : [input])
		.filter(v => typeof v !== 'undefined')
		.map(s =>
		{
			s = handleSearchInput(s);

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
	else if (type === 'build.all.array')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/build.all.array')
		p = import('../../cache/build.all.array')
	}

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
	let {
		title,
	} = req.query;

	let data: ICachedJSONRowPlus[];

	if (title && title.length)
	{
		data = await importBuildJsonCache<[string, string[]][]>('titles')
			.then(async (list) =>
			{
				let rs = toRe(title, {
					or: true,
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
					});

				array_unique_overwrite(ids);

				return importBuildJsonCache<Record<string, ICachedJSONRowPlus>>('build.all')
					.then(data =>
					{
						return ids.map(uuid => data[uuid]);
					})
					;
			})
	}

	let { tags, content, authors } = req.query as any as Record<string, RegExp[]>;

	tags = toRe(tags as any, {
		or: true,
	});
	content = toRe(content as any, {
		or: true,
	});
	authors = toRe(authors as any, {
		or: true,
	});

	if (tags.length || content.length || authors.length)
	{
		if (typeof data === 'undefined')
		{
			data = await importBuildJsonCache<ICachedJSONRowPlus[]>('build.all.array');
		}
	}

	if (data && data.length)
	{
		data = data.filter(item =>
		{

			let bool = true;

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
				bool = testRe(content, item.content)
			}

			return bool
		});
	}

	if (data)
	{
		data.sort(sortUpdatedComp);

		return res
			.json(data)
			;
	}

	res
		.status(400)
		.json({
			error: true,
			query: req.query,
		})
	;
}
