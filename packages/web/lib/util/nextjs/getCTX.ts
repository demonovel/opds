import { NextPageContext } from 'next/dist/next-server/lib/utils';

export default (_ctx) => {
	let ctx = (_ctx as any as NextPageContext);

	// @ts-ignore
	if (ctx.ctx)
	{
		// @ts-ignore
		ctx = ctx.ctx;
	}

	return ctx
};
