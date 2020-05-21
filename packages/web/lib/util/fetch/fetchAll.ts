import { isZeitNow } from '../nextjs/zeit-now';
import { IArrayCachedJSONRow } from '@demonovel/cached-data/types';
import { fetchApi } from './index';

async function fetchAll(options: {
	ctx?: any,

} = {})
{
	let { ctx } = options;
	let dataList: IArrayCachedJSONRow = [];
	let isAll = false;
	let fetchFn: () => Promise<IArrayCachedJSONRow>;
	let fallbackFn: () => Promise<IArrayCachedJSONRow>;

	if (typeof window === 'undefined')
	{
		if (ctx && !isZeitNow(ctx))
		{
			fallbackFn = async () => {
				let dataList = await import('@demonovel/cached-data');
				isAll = true;
				return dataList
			}
		}
		else
		{
			fallbackFn = async () => {
				let dataList = await import('@demonovel/cached-data/cache/build/demonovel.json')
					.then((data: any) => Object.values(data) as IArrayCachedJSONRow)
				;
				isAll = false;
				return dataList
			}

			fetchFn = async () => {
				let dataList = await fetchApi(null, "https://github.com/bluelovers/ws-rest/raw/master/packages/%40demonovel/cached-data/cache/build/demonovel.json")
					.then(r => r.json())
					.then((data: any) => Object.values(data) as IArrayCachedJSONRow)
				;

				if (!dataList.length)
				{
					return Promise.reject()
				}

				isAll = false;
				return dataList
			}
		}
	}

	if (!fetchFn)
	{
		fetchFn = async () => {
			let dataList = await fetchApi(null, "https://github.com/bluelovers/ws-rest/raw/master/packages/%40demonovel/cached-data/cache/pack/array.json")
				.then(r => r.json())
			;

			if (!dataList.length)
			{
				return Promise.reject()
			}

			isAll = true;
			return dataList
		}
	}

	dataList = await fetchFn()
		.catch(fallbackFn)
	;

	console.log(dataList.length)

	return {
		dataList,
		isAll,
	}
}

export default fetchAll
