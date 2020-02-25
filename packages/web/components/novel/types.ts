/**
 * Created by user on 2020/2/24.
 */

import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';

export enum EnumHandleClickType
{
	'unknown' = 'unknown',
	'novel' = 'novel',
	'siteID' = 'siteID',
	'authors' = 'authors',
	'pathMain' = 'pathMain',
	'Favorite' = 'Favorite',
	'title' = 'title',
	'title_full' = 'title_full',
}

export interface INovelListComponentType
{
	dataList: ICachedJSONRowPlus[];

	handleClick?(type: string, value, novel?: ICachedJSONRowPlus),

	novelOpdsNowServer: string,
}

export enum EnumSiteID
{
	'dmzj' = 'dmzj',
	'esjzone' = 'esjzone',
	'demonovel' = 'demonovel',
	'masiro' = 'masiro',
	'wenku8' = 'wenku8',
}
