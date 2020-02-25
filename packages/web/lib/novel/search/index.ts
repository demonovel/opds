/**
 * Created by user on 2020/2/24.
 */

import { handleSearchInput } from '../../util/search';
import zhRegExp from '../../zhRegExp';
import { array_unique_overwrite } from 'array-hyper-unique';

export function toRe(input: string | string[], options: {
	full?: boolean,
	or?: boolean,
} = {}): zhRegExp[]
{
	let arr = (Array.isArray(input) ? input : [input])
		.filter(v => typeof v !== 'undefined')
		.map(s =>
		{
			s = handleSearchInput(String(s));

			if (s === '.*' || s === '' || !s.length)
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

export function testRe(rs: RegExp[], target: string | string[])
{
	if (rs.length === 0)
	{
		return true;
	}

	if (Array.isArray(target))
	{
		return target
			.some(target =>
			{
				let bool = rs.some(r => r.test(target))

				target.includes('狼') && console.log(bool, rs, target)

				if (!bool)
				{
					let target2 = handleSearchInput(target)
						.replace(/[\.*]+/g, '')
					;

					if (target2 !== target && target2.length)
					{
						bool = rs.some(r => r.test(target2))
					}
				}

				return bool;
			})
	}

	return rs.some(r => r.test(target))
}

