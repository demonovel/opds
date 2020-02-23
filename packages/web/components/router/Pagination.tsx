import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from './PaginationItem';
import { PropsWithChildren } from 'react';
import { LinkProps } from 'next/link';

type PaginationItemProp = PropsWithChildren<LinkProps & {
	page: number
} & Record<string, any>>

export default (prop?: {
	color?: string | 'default' | 'primary' | 'secondary',
	count?: number,
	defaultPage?: number,
	page?: number,
	showFirstButton?: boolean,
	showLastButton?: boolean,
	variant?: 'text' | 'outlined',
	size?: 'small' | 'medium' | 'large',
	shape?: 'round' | 'rounded',
	renderItem?(item: PaginationItemProp): PaginationItemProp,
	onChange?(event: object, page: number),
}) => {

	const renderItem = (item: PaginationItemProp) => {

		if (prop && prop.renderItem) {
			item = prop.renderItem(item)
		}

		return <PaginationItem {...item} />
	};

	return <Pagination
			showFirstButton
			showLastButton
			{...prop}
			renderItem={renderItem}
		/>
};
