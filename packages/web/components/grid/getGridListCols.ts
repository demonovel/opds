import { isWidthUp } from '@material-ui/core/withWidth';

export function getGridListColsCore(width)
{
	if (isWidthUp('xl', width))
	{
		return 6;
	}

	if (isWidthUp('lg', width))
	{
		return 5;
	}

	if (isWidthUp('md', width))
	{
		return 3;
	}

	if (isWidthUp('sm', width))
	{
		return 3;
	}

	if (isWidthUp('xs', width))
	{
		return 2;
	}

	return 1;
}

export function getGridListCols(prop)
{
	return getGridListColsCore(prop.width);
}

export default getGridListCols;
