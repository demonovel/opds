import { removeZeroWidth, nbspToSpace } from 'zero-width/lib';
import hashSum from 'hash-sum';

export function trim(input: string)
{
	return removeZeroWidth(nbspToSpace(input))
		.replace(/^[\s　\u00A0]+|[\s　\u00A0]+$/g, '')
	;
}

export function newUUID(siteID: string, id: string): string
{
	return hashSum(siteID + '#' + id)
}
