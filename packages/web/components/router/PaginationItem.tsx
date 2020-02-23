import Link from './Link';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { PropsWithChildren, Props } from 'react';
import { LinkProps } from 'next/link';

export default (item: LinkProps & Record<string, any>) => (<PaginationItem
	{...item}
	//component={Link}
/>)
