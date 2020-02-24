import React, { SyntheticEvent } from 'react';
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
import { EnumHandleClickType } from './types';

export interface INovelListComponentType
{
	dataList: ICachedJSONRowPlus[];

	handleClick?(type: string, value, novel?: ICachedJSONRowPlus),
}

const useStyles = makeStyles((theme: Theme) => createStyles({

	root: {
		'&:hover $cover': {
			opacity: 0.5,
		},
		'& $cover': {
			opacity: 1,
		},
	},

	cover: {
		'&:hover': {
			opacity: 0.5,
		},
	},

}));

export const ListCard = withWidth()((prop: INovelListComponentType) =>
{
	const classes = useStyles();

	return <Container maxWidth="xl">
		<GridList cellHeight={180} cols={getGridListCols(prop)}>
			{prop.dataList.map((novel) =>
			{

				//console.log(tile.title, tile.updated, moment.unix(tile.updated).format());

				const handleClick = (event: SyntheticEvent, type: EnumHandleClickType, ...argv) =>
				{
					event && event.stopPropagation();

					// @ts-ignore
					return prop.handleClick && prop.handleClick(type, ...argv)
				};

				return (<GridListTile
					key={novel.uuid}
					cols={1}
					className={classes.root}
					onClick={(event) => handleClick(event, EnumHandleClickType.novel, novel.uuid, novel)}
				>

					<div>
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								zIndex: 10000,
							}}
						>
							<Chip
								size="small"
								label={novel.siteID}
								color="secondary"
								onClick={(event) => handleClick(event, EnumHandleClickType.siteID, novel.siteID, novel)}
							/>
							{(() =>
							{
								if (novel.authors)
								{
									return <Chip
										size="small"
										label={novel.authors[0]}
										clickable
										onClick={(event) => handleClick(event, EnumHandleClickType.authors, novel.authors[0], novel)}
										color="primary"
									/>
								}
							})()}
							{(() =>
							{
								if (novel.pathMain)
								{
									return <Chip
										size="small"
										label={novel.pathMain}
										onClick={(event) => handleClick(event, EnumHandleClickType.pathMain, novel.pathMain, novel)}
									/>
								}
							})()}
						</div>

						<img
							className={classes.cover}
							src={novel.cover}
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
						/>
					</div>

					<GridListTileBar
						title={novel.title}
						subtitle={novel.updated ? moment.unix(novel.updated).format() : ''}
						actionPosition="left"
						actionIcon={
							<IconButton
								aria-label="add to favorites"
								onClick={(event) => handleClick(event, EnumHandleClickType.Favorite, novel.uuid, novel)}
							>
								<FavoriteIcon />
							</IconButton>
						}
					/>
				</GridListTile>)
			})}
		</GridList>
	</Container>
});

export default ListCard
