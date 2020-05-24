/**
 * Created by user on 2020/2/25.
 */
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import { EnumSiteID } from '../../components/novel/types';
import hashSum from 'hash-sum';

const serverIPFSRecord = `https://api-file-server.now.sh`;

export function epubLink(novel: ICachedJSONRowPlus, server?: string)
{
	let rawUrl: string;

	switch (novel.siteID)
	{
		case EnumSiteID.dmzj:
		case EnumSiteID.esjzone:
		case EnumSiteID.wenku8:
			return `${server ?? ''}/file/${novel.siteID}/${novel.id}`;
		case EnumSiteID.demonovel:

			rawUrl = 'https://gitlab.com/demonovel/epub-txt/-/raw/master/';

			return new URL([
				//`demonovel/epub-txt/raw/master/`,
				novel.pathMain,
				novel.epub_basename,
			].join('/'), rawUrl).href
	}
}

export function novelLink(novel: ICachedJSONRowPlus, server?: string)
{
	let rawUrl: string;

	switch (novel.siteID)
	{
		case EnumSiteID.masiro:
			return `https://masiro.moe/forum.php?mod=forumdisplay&fid=${novel.id}`;
		case EnumSiteID.esjzone:
			return `https://www.esjzone.cc/detail/${novel.id}.html`;
		case EnumSiteID.wenku8:
			return `https://www.wenku8.net/book/${novel.id}.htm`;
		case EnumSiteID.demonovel:

			rawUrl = 'https://gitlab.com/';

			return new URL([
				`novel-group/txt-source/blob/master/`,
				novel.pathMain_real,
				novel.novelID,
			].join('/'), rawUrl).href
	}
}

export function ipfsLink(novel: ICachedJSONRowPlus, server?: string)
{
	switch (novel.siteID)
	{
		case EnumSiteID.masiro:
		case EnumSiteID.esjzone:
		case EnumSiteID.wenku8:
		case EnumSiteID.dmzj:
			return new URL(`file/${novel.siteID}/${hashSum(novel.id)}`, serverIPFSRecord).href
	}
}
