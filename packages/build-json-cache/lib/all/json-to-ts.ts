/**
 * Created by user on 2020/2/23.
 */

import { readJSON, outputJSON, outputFile } from 'fs-extra';
import { join } from "path";
import { __root } from '../../__root';

readJSON(join(__root, '.cache', `./build.all.array.json`))
	.then(data => outputFile(join(__root, '.cache', `./build.all.array.ts`), `export default ${JSON.stringify(data)}`))
;

readJSON(join(__root, '.cache', `./build.all.json`))
	.then(data => outputFile(join(__root, '.cache', `./build.all.ts`), `export default ${JSON.stringify(data)}`))
;

readJSON(join(__root, '.cache', 'temp', `./titles.json`))
	.then(data => outputFile(join(__root, '.cache', 'temp', `./titles.ts`), `export default ${JSON.stringify(data)}`))
;
