/**
 * Created by user on 2020/2/24.
 */

import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import sortUpdatedComp from 'build-json-cache/lib/util/sortUpdated';
import imgUnsplash from '../util/img/unsplash';

export function handleBuildJsonCacheList(data: ICachedJSONRowPlus[],
	sortComp?: (a: ICachedJSONRowPlus, b: ICachedJSONRowPlus) => number,
)
{
	if (sortComp)
	{
		let oldSortComp = sortComp;

		sortComp = (a, b) =>
		{
			return oldSortComp(a, b) || sortUpdatedComp(a, b)
		}
	}
	else
	{
		sortComp = sortUpdatedComp
	}

	return data
		.sort(sortComp)
		.map(novel =>
		{

			if (!novel.cover)
			{
				novel.cover = imgUnsplash()
			}

			return novel;
		})
		;
}
