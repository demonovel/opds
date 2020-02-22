/**
 * Created by user on 2020/2/23.
 */
import { ICachedJSONRow } from '../types';

export function sortUpdatedComp(a: ICachedJSONRow, b: ICachedJSONRow)
{
	return b.updated - a.updated
}

export function sortUpdated(list: ICachedJSONRow[])
{
	return list
		.sort(sortUpdatedComp)
	;
}

export default sortUpdatedComp
