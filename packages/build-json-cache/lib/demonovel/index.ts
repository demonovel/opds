import Bluebird from 'bluebird';
import { fetchFile } from './fetch';
import { INovelStatCache, createFromJSON, IFilterNovelData, createMoment } from '@node-novel/cache-loader';
import dotValues2 from 'dot-values2/lib'
import NodeNovelInfo from 'node-novel-info/class';
import { ICachedJSONRow, ICachedJSONRowPlus } from '../types';
import hashSum from 'hash-sum';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__rootCache';
import { trim, newUUID } from '../util';

export interface IFilterNovelDataPlus extends IFilterNovelData
{
	title: string
	authors: string[]
}

const siteID = 'demonovel';

export function update()
{
	return Bluebird.resolve(fetchFile())
		.then(table => createFromJSON(table))
		.then(async (nc) =>
		{

			let novels = nc.filterNovel();

			let list = dotValues2.get(novels, `*.*`) as IFilterNovelDataPlus[];

			return list
				.map(novel =>
				{
					let id = novel.pathMain_base + '/' + novel.novelID;

					console.log(siteID, id);

					let info = NodeNovelInfo.create(novel.mdconf);

					let novelID = novel.novelID;

					let uuid = newUUID(siteID, id);

					let pathMain = novel.pathMain_base;

					let title = info.title();

					let content = dotValues2.get(novel, 'mdconf.novel.preface') as string;

					if (content)
					{
						content = trim(content)
					}
					else
					{
						content = void 0
					}

					let updated = novel.cache.epub_date || 0;

					if (updated)
					{
						updated = createMoment(updated).unix()
					}

					let item: ICachedJSONRowPlus = {
						siteID,
						pathMain,
						novelID,
						uuid,
						id,
						title,
						titles: info.titles(),
						cover: dotValues2.get(novel, 'mdconf.novel.cover') as string,
						authors: info.authors(),
						updated,
						//chapters_num,
						//last_update_name,
						tags: info.tags(),
						content,
					};

					return item
				})
				.filter(Boolean)
				.sort((a, b) =>
				{
					let i = (b.updated - a.updated);

					if (b.updated > a.updated)
					{
						return 1
					}
					else if (b.updated < a.updated)
					{
						return -1
					}

					return 0
				})
				.reduce((a, item) =>
				{
					a[item.uuid] = item;
					return a;
				}, {} as Record<string, ICachedJSONRowPlus>)
			;
		})
		.then(data =>
		{
			return Bluebird.all([
				outputJSON(join(join(__rootCache, 'build'), `./${siteID}.json`), data, {
					spaces: 2,
				}),
			])
		})
		;
}
