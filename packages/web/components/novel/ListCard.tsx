import React from 'react';
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

export interface INovelListComponentType
{
	dataList: ICachedJSONRowPlus[];
}

export const ListCard = withWidth()((prop: INovelListComponentType) => {
	return <Container maxWidth="xl">
		<GridList cellHeight={180} cols={getGridListCols(prop)}>
			{prop.dataList.map(tile => (
				<GridListTile key={tile.uuid} cols={1}>

					<img
						src={tile.cover}
						onError={e => {
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

					<GridListTileBar
						title={tile.title}
						subtitle={moment(tile.updated).format()}
						actionPosition="left"
						actionIcon={
							<IconButton aria-label="add to favorites">
								<FavoriteIcon />
							</IconButton>
						}
					/>
				</GridListTile>
			))}
		</GridList>
	</Container>
});



export default ListCard
