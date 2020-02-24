/**
 * Created by user on 2020/2/24.
 */

export function importBuildJsonCache<T>(type: 'titles' | 'build.all' | 'build.all.array'): Promise<T>
{
	let p: Promise<any>;
	if (type === 'titles')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/temp/titles')
		p = import('../../cache/temp/titles')
	}
	else if (type === 'build.all' || type === 'build.all.array')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/build.all')
		p = import('../../cache/build.all')
	}
	/*
	else if (type === 'build.all.array')
	{
		// @ts-ignore
		//p = import('build-json-cache/.cache/build.all.array')
		p = import('../../cache/build.all.array')
	}
	 */

	return p
		.then((list: any) => list.default || list)
		.then((data) =>
		{

			if (type === 'build.all.array')
			{
				return Object.values(data)
			}

			return data
		})
		;
}
