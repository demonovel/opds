import React, { SyntheticEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import GridList from '@material-ui/core/GridList';
import getGridListCols from '../grid/getGridListCols';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import moment from 'moment-timezone';
import Container from '@material-ui/core/Container';
import withWidth from '@material-ui/core/withWidth';
import imgUnsplash from '../../lib/util/img/unsplash';
import { Chip } from '@material-ui/core';
import { EnumHandleClickType, INovelListComponentType } from './types';
import Tooltip from '@material-ui/core/Tooltip';
import LinkBreak from 'jsx-linebreak/react';
import { novelLink } from '../../lib/novel/util';

const useStyles = makeStyles((theme: Theme) => createStyles({

	root: {
//		'&:hover $cover': {
//			opacity: 0.5,
//		},
//		'& $cover': {
//			opacity: 1,
//		},
	},

	box: {
		alignItems: "center",
		justifyContent: "center",
		overflow: 'hidden',
		resize: 'both',
	},

	tagBox: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 1,
	},

	cover: {
		'&:hover': {
			opacity: 0.5,
		},
		objectFit: 'cover',
		width: '100%',
		height: '100%',
//		'&[src*="unsplash"]': {
//			objectFit: 'cover',
//		},
	},

	tipRoot: {
		zIndex: theme.zIndex.tooltip,
	},

	tip: {
		maxHeight: 500,
		overflow: 'hidden',
		zIndex: theme.zIndex.tooltip,
//		'& $popper': {
//			maxHeight: 500,
//			overflow: 'hidden',
//		}
	}

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

					<div
						className={classes.box}
					>
						<div
							className={classes.tagBox}
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

						<Tooltip
							PopperProps={{
								// @ts-ignore
								className: classes.tip
							}}
							placement={"right-start"}
							title={<>
								<Typography>
									<LinkBreak>{(novel.content ? novel.content : '無簡介')}</LinkBreak>
								</Typography>
							</>}>
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
							onClick={() => {
								let href =  novelLink(novel, prop.novelOpdsNowServer);

								if (href)
								{
									window.open(href, href);
								}
							}}
						/>
						</Tooltip>
					</div>

					<Tooltip
						placement="top"
						title={<>
					<Typography>
						<LinkBreak>{(novel?.titles?.length ? novel.titles.join('\n') : novel.title)}</LinkBreak>
					</Typography>
					</>}>
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
						// @ts-ignore
						onClick={(event) => handleClick(event, EnumHandleClickType.title_full, novel.titles || novel.title, novel)}
					/>
					</Tooltip>
				</GridListTile>)
			})}
		</GridList>
	</Container>
});

export default ListCard
