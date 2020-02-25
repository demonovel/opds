/**
 * Created by user on 2020/2/23.
 */

import { join } from "path";
import { __rootCache } from '../__rootCache';
import { EnumSiteID } from 'demonovel/components/novel/types';

export interface ICachedJSONRow
{
	siteID: string | EnumSiteID;
	novelID: string;
	uuid: string;
	id: string;
	title: string;
	subtitle?: string;
	cover?: string;
	authors?: string[];
	updated: number;
	chapters_num?: number;
	last_update_name?: string;
	tags?: string[];
	content: string;
}

export interface ICachedJSONRowPlus extends ICachedJSONRow
{
	pathMain: string;
	pathMain_real: string;
	titles: string[];
	epub_basename: string;
}

export const pathPrefix = {
	github: 'https://github.com/bluelovers/ws-rest/raw/master/packages/%40node-novel/',
	cache: join(__rootCache, 'cached') + '/',
};
