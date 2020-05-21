export function isZeitNow(ctx: any): string
{
	if (!('headers' in ctx) && ctx.ctx)
	{
		ctx = ctx.ctx;
	}

	if (!('headers' in ctx) && ctx.req)
	{
		ctx = ctx.req;
	}

	if (ctx.headers)
	{
		ctx = ctx.headers;
	}

	return ctx['x-now-deployment-url']
}
