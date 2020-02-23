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

export default async (req: NextApiRequest, res: NextApiResponse) =>
{
	let {
		title,
	} = req.query;

	let data: ICachedJSONRowPlus[];

	if (title && title.length)
	{
		data = await import('../../cache/temp/titles')
		//data = await Promise.resolve(buildJsonCacheCacheTempTitles)
			// @ts-ignore
			.then(list => (list.default || list) as [string, string[]][])
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

				return import('../../cache/build.all')
					.then(list => list.default || list)
					.then(data =>
					{
						return ids.map(uuid => data[uuid]);
					})
					;
			})
	}

	if (typeof data === 'undefined')
	{
		data = await import('../../cache/build.all.array')
			.then(list => list.default || list) as ICachedJSONRowPlus[]
		;
	}

	if (data.length)
	{
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
