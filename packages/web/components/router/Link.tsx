import Link, { LinkProps } from 'next/link';
import { withRouter } from 'next/router'
import { PropsWithChildren } from 'react';

/**
 * for Pagination React component - Material-UI
 *
 * https://material-ui.com/api/pagination/
 * https://material-ui.com/components/pagination/
 * https://material-ui.com/api/pagination-item/
 */
export default (prop: PropsWithChildren<LinkProps>) =>
{
	let {
		// @ts-ignore
		href,
		as,
		replace,
		scroll,
		shallow,
		passHref,
		prefetch,
	} = prop;

	prop = {
		...prop,
	};

	delete prop.href;
	// @ts-ignore
	delete prop.to;
	delete prop.as;

	return (<Link {...{
			href,
			as,
			replace,
			scroll,
			shallow,
			passHref,
			prefetch,
		}}><a {...prop as any} /></Link>)
}
