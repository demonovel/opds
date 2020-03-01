import { readJSON, outputJSON } from 'fs-extra';
import { join } from "path";
import Axios from 'axios';
import { IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
import { IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import Bluebird from 'bluebird';
import hashSum from 'hash-sum';
import cheerio from "cheerio";
import { inspect } from "util";
import { trim, newUUID } from '../util';
import { ICachedJSONRow, pathPrefix } from '../types';
import { __rootCache } from '../../__rootCache';
import { readJSONWithFetch } from '../util/fs';

export const id_packs_map = {
	dmzj: 'cached-dmzj/data/novel/info.pack.json',
	esjzone: 'cached-esjzone/data/novel/info.pack.json',
	masiro: 'cached-masiro/data/forum.pack.json',
	wenku8: 'cached-wenku8/data/novel/info.pack.json',
};

export interface Interface
{
	dmzj: IDmzjNovelInfoWithChapters,
	esjzone: IESJzoneRecentUpdateRowBook,
	masiro: IDiscuzForumPickThreads,
	wenku8: IWenku8RecentUpdateRowBookWithChapters,
}

export function fetch<K extends keyof typeof id_packs_map>(siteID: K): Promise<Record<string, Interface[K]>>
{
	return Axios.get(id_packs_map[siteID], {
			baseURL: pathPrefix.github,
			responseType: 'json',
			timeout: 10000,
		})
		.then(r => r.data)
		.then(async (data) =>
		{
			await outputJSON(join(pathPrefix.cache, `./${siteID}.json`), data, {
				spaces: 2,
			});

			return data
		})
		;
}

export function fetchFile<K extends keyof typeof id_packs_map>(siteID: K): Promise<Record<string, Interface[K]>>
{
	return readJSONWithFetch(join(pathPrefix.cache, `./${siteID}.json`), () => fetch(siteID))
}

export function update<K extends keyof typeof id_packs_map>(siteID: K | string)
{
	return Bluebird.resolve(fetchFile(siteID as keyof typeof id_packs_map))
		.then(data => Object.entries(data))
		.map(([id, _data]: any) =>
		{
			console.log(siteID, id);

			let uuid: string = newUUID(siteID, id);
			let novelID: string = id;
			let title: string;
			let content: string;
			let updated: number = 0;
			let chapters_num: number = 0;
			let authors: string[];
			let tags: string[];
			let cover: string;
			let last_update_name: string;

			let data: Interface['esjzone'] | Interface['masiro'] | Interface['wenku8'] & Interface['dmzj'];

			switch (siteID)
			{
				case 'dmzj':
				case 'wenku8':

					data = (_data as any as ((Interface['wenku8'] & Interface['dmzj'])));

					title = data.name;
					authors = [data.authors];
					content = data.desc || data.introduction;
					tags = data.types;
					updated = data.last_update_time;
					cover = data.cover;

					last_update_name = data.last_update_chapter_name;

					if (data.last_update_volume_name)
					{
						last_update_name = data.last_update_volume_name + '／' + last_update_name;
					}

					chapters_num = data.chapters && data.chapters.reduce((i, v) =>
					{

						i += v.chapters.length;

						return i
					}, 0);

					break;
				case 'esjzone':

					data = (_data as any as (Interface['esjzone']));

					title = data.name;
					authors = [data.authors];
					chapters_num = data.chapters && data.chapters.reduce((i, v) =>
					{

						i += v.chapters.length;

						return i
					}, 0);
					content = data.desc;
					updated = data.last_update_time;
					tags = data.tags;
					cover = data.cover;

					if (data.chapters && data.chapters.length)
					{
						let vol = data.chapters[data.chapters.length - 1];

						let ch = vol.chapters[vol.chapters.length - 1];

						if (ch)
						{
							last_update_name = ch.chapter_name;
						}

						if (vol.volume_name)
						{
							last_update_name = vol.volume_name + '／' + last_update_name;
						}
					}

					break;
				case 'masiro':

					data = (_data as any as (Interface['masiro']));

					if (data.subforums && data.subforums.length)
					{
						return null;
					}

					title = data.forum_name;
					chapters_num = data.threads.length;

					try
					{
						content = data.forum_rules;
						content = content && cheerio.load(`<body>${content}</body>`)(`body`).text();
					}
					catch (e)
					{

					}

					updated = data.last_thread_time;

					if (data.threads[0])
					{
						last_update_name = data.threads[0].subject;

						let typeid = data.threads[0].typeid;
						if (data.thread_types && data.thread_types[typeid])
						{
							last_update_name = data.thread_types[typeid] + '／' + last_update_name;
						}
					}
					break;
				default:
					throw new Error(`unknown siteID ${siteID}, ${inspect(_data)}`)
			}

			if (title)
			{
				title = trim(title);
			}

			if (content)
			{
				content = trim(content)
			}
			else
			{
				content = void 0
			}

			if (!updated)
			{
				updated = 0;
			}

			let item: ICachedJSONRow = {
				siteID,
				novelID,
				uuid,
				id,
				title,
				cover,
				authors,
				updated,
				chapters_num,
				last_update_name,
				tags,
				content,
			} as ICachedJSONRow;

			Object.entries(item)
				.forEach(([k, v]) =>
				{
					if (v && Array.isArray(v))
					{
						v = v.filter(v => Boolean(v) && String(v).length);
						// @ts-ignore
						if (v.length)
						{
							item[k] = v;
						}
						else
						{
							delete item[k]
						}
					}
					else if (typeof v === "string")
					{
						item[k] = trim(v);
					}
				})
			;

			return item;
		})
		.filter(Boolean)
		.then(data =>
		{
			return data.sort((a, b) =>
			{
				return b.updated - a.updated
			})
		})
		.reduce((a, b) =>
		{

			a[b.uuid] = b;

			return a;
		}, {} as Record<string, ICachedJSONRow>)
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
