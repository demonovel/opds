/**
 * Created by user on 2020/2/23.
 */

import Bluebird from 'bluebird';
import { readJSON, outputJSON } from 'fs-extra';
import { join } from "path";
import { __root } from '../../__root';
import { ICachedJSONRowPlus, ICachedJSONRow } from '../types';
import { slugifyNovel } from '../util/title';
import { array_unique_overwrite } from 'array-hyper-unique';

export default Bluebird
	.resolve(readJSON(join(__root, '.cache', 'build.all.json')))
	.then(async (table) =>
	{
		let list = Object.values(table) as (ICachedJSONRow & ICachedJSONRowPlus)[];

		let titles = {} as Record<string, string[]>;
		let titles2 = {} as Record<string, string[]>;

		list
			.forEach(item =>
			{

				let title = slugifyNovel(item.title);

				let list: string[] = [];

				list.push(title);

				if (item.titles)
				{
					item.titles
						.forEach(title =>
						{
							title = slugifyNovel(title);
							list.push(title);
						})
					;
				}

				let first: string[];

				for (let title of list)
				{
					if (title in titles)
					{
						first = titles[title];
						break;
					}
				}

				if (!first)
				{
					first = titles[title] || [];
				}

				list.forEach(title =>
				{
					if ((title in titles) && titles[title] !== first)
					{
						first.push(...titles[title]);
					}
					titles[title] = first;
				});

				first.push(item.uuid);
			})
		;

		Object.values(titles)
			.map(v => array_unique_overwrite(v).sort())
		;

		return outputJSON(join(__root, '.cache', 'temp', `./titles.json`), Object.entries(titles))

	})
;
