/**
 * Created by user on 2020/2/23.
 */

import { readJSON, outputJSON, outputFile } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__rootCache';

export default Promise.all([
	readJSON(join(__rootCache, `./build.all.array.json`))
		.then(data => outputFile(join(__rootCache, `./build.all.array.js`), `module.exports = ${JSON.stringify(data)}`)),
	readJSON(join(__rootCache, `./build.all.json`))
		.then(data => outputFile(join(__rootCache, `./build.all.js`), `module.exports = ${JSON.stringify(data)}`)),
	readJSON(join(__rootCache, 'temp', `./titles.json`))
		.then(data => outputFile(join(__rootCache, 'temp', `./titles.js`), `module.exports = ${JSON.stringify(data)}`)),
])
