import Bluebird from 'bluebird';
import { update, id_packs_map } from './lib/github/novel-cached';
import { update as updateDemonovel } from './lib/demonovel';

Bluebird.resolve()
	.thenReturn(Object.keys(id_packs_map))
	.mapSeries(k => update(k))
	.tap(updateDemonovel)
	.tap(v => import('./lib/all/merge'))
	.tap(v => import('./lib/all/titles'))
;

