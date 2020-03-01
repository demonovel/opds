import Axios from 'axios';
import { outputJSON, readJSON } from 'fs-extra';
import { join } from "path";
import { pathPrefix } from '../types';
import { stat } from 'fs-extra';
import { readJSONWithFetch } from '../util/fs';

let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;
const siteID = 'demonovel';

export function fetch()
{
	return Axios.get( url, {
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

export function fetchFile()
{
	return readJSONWithFetch(join(pathPrefix.cache, `./${siteID}.json`), fetch)
}
