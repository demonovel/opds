import React, { SyntheticEvent, ReactNode } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GridList from '@material-ui/core/GridList';
import getGridListCols from '../grid/getGridListCols';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import moment from 'moment-timezone';
import Container from '@material-ui/core/Container';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import withWidth from '@material-ui/core/withWidth';
import fetch from 'isomorphic-unfetch';
import { NextComponentType } from 'next';
import { NextPageContext } from 'next/dist/next-server/lib/utils';
import getCTX from '../../lib/util/nextjs/getCTX';
import { fetchApi } from '../../lib/util/fetch';
import { URLSearchParams } from 'url';
import ImgWithFallback from '../img/ImgWithFallback';
import imgUnsplash from '../../lib/util/img/unsplash';
import { Chip } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { EnumHandleClickType, INovelListComponentType } from './types';
import Tooltip from '@material-ui/core/Tooltip';
import LinkBreak from 'jsx-linebreak/react';
import MaterialTable from 'material-table';
import ListTableIcons from '../icons/ListTableIcons';
import useTheme from '@material-ui/core/styles/useTheme';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { epubLink, novelLink, ipfsLink } from '../../lib/novel/util';
import Link from '@material-ui/core/Link';
import domOpenLink from '../../lib/dom/domOpenLink';

const useStyles = makeStyles((theme: Theme) => createStyles({

	cover: {
		objectFit: 'cover',
		width: 40,
		height: 40,
		borderRadius: 5,
	},

	linkButton: {
		//color: theme.palette.secondary.contrastText,
		//backgroundColor: theme.palette.secondary.main,
		//padding: 3,
		margin: theme.spacing(1),
		//borderRadius: 5,
	}

}));

declare module 'material-table'
{
	interface Column<RowData extends object>
	{
		width?: string | number;
	}
}

interface INovelListTableComponentType extends INovelListComponentType
{
	pageSize: number,
	onChangeRowsPerPage(pageSize: number): void;
}

export const ListTable = withWidth()((prop: INovelListTableComponentType) =>
{
	const theme = useTheme();
	const classes = useStyles();

	return (<>
		<MaterialTable
			theme={theme}
			// @ts-ignore
			icons={ListTableIcons}
			onChangeRowsPerPage={prop.onChangeRowsPerPage}
			options={{
				showTitle: false,
				pageSize: prop.pageSize,

				pageSizeOptions: [8, 5, 10, 20, 4, 6, 9, 15, 25, 30, 34, 36, 50, 100],
				//paginationType: 'stepped',
				search: false,
				padding: 'dense',
				toolbar: false,
				header: false,
			}}
			columns={[
				{
					title: 'Cover',
					field: 'cover',
					render: novel => (<img
						src={novel.cover}
						className={classes.cover}
						onError={e =>
						{
							// @ts-ignore
							if (e.target.src)
							{
								// @ts-ignore
								e.target.onerror = null;
								// @ts-ignore
								e.target.src = imgUnsplash();
							}
						}}
					/>),
					width: 40,
					cellStyle: {
						//padding: 0,
						paddingRight: 0,
					},
					headerStyle: {
						//padding: 0,
						paddingRight: 0,
					},
				},
				{
					title: 'Title',
					field: 'title',
					render: novel =>
					{

						const handleClick = (event: SyntheticEvent, type: EnumHandleClickType, ...argv) =>
						{
							event && event.stopPropagation();

							// @ts-ignore
							return prop.handleClick && prop.handleClick(type, ...argv)
						};

						return (<>

							<Tooltip
								placement="top-start"
								title={<>
									<Typography>
										<LinkBreak>{(novel?.titles?.length ? novel.titles.join('\n') : novel.title)}</LinkBreak>
									</Typography></>}
							>
								<>

									<Box
										style={{
											float: 'right',
											textAlign: 'right',
										}}>
										<Typography
											color="secondary"
										>
											{novel.siteID}
										</Typography>

										{(novel.authors ? (<Typography
											color="primary"
										>
											{novel.authors[0]}
										</Typography>) : '')}


									</Box>

									<Typography
										variant={'subtitle1'}
										color={'primary'}
									>
										<Box
											component="span"
											mr={1}
										>{novel.title}</Box>
									</Typography>

									<Typography
										display={"block"}
										noWrap
										color={'textSecondary'}
									>{novel.updated ? moment.unix(novel.updated).format() : ''}</Typography>

								</>

							</Tooltip>
						</>)
					},
				},
			]}
			detailPanel={novel => {

				let epub = epubLink(novel, prop.novelOpdsNowServer);

				let href =  novelLink(novel, prop.novelOpdsNowServer);

				let ipfs =  ipfsLink(novel, prop.novelOpdsNowServer);

				return (<Box
					component="div"
					p={1}
				>

					{epub ? <Button
						href={epub}
						size={'small'}
						variant="contained"
						color={'secondary'}
						target={"_blank"}
						className={classes.linkButton}
						onClick={(event) => ipfs && fetch(ipfs, {
							cache: 'default',
							// @ts-ignore
							timeout: 1000,
						}).catch(() => null)}
					>
						EPUB
					</Button> : undefined}

					{href ? <Button
						href={href}
						size={'small'}
						variant="contained"
						color={'primary'}
						//onClick={domOpenLink}
						target={"_blank"}
						className={classes.linkButton}
					>
						LINK
					</Button> : undefined}

					{ipfs ? <Button
						href={ipfs}
						size={'small'}
						variant="contained"
						target={"_blank"}
						className={classes.linkButton}
					>
						IPFS
					</Button> : undefined}

					</Box>)
			}}
			data={prop.dataList}
		/>
	</>)
});

export default ListTable
