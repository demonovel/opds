/**
 * Created by user on 2020/2/23.
 */
import { Router } from 'next/router';
//import Pagination from '@material-ui/lab/Pagination';
//import PaginationItem from '@material-ui/lab/PaginationItem';
import Link3 from 'next/link';
import { Link as Link2 } from 'react-router-dom';
import Link from '../../components/router/Link';
//import { MemoryRouter as Router } from 'react-router';
import { withRouter } from 'next/router'
import PaginationItem from '../../components/router/PaginationItem';
import Pagination from '../../components/router/Pagination';
import { Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ICachedJSONRowPlus } from 'build-json-cache/lib/types';
import moment from 'moment-timezone';
import CardActionArea from '@material-ui/core/CardActionArea';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import GridList from '@material-ui/core/GridList';
import InfoIcon from '@material-ui/icons/Info';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Container from '@material-ui/core/Container';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import getGridListCols from '../../components/grid/getGridListCols';
import ListCard, { INovelListComponentType } from '../../components/novel/ListCard';
import { NextComponentType } from 'next';
import getCTX from '../../lib/util/nextjs/getCTX';
import { fetchApi } from '../../lib/util/fetch';
import imgUnsplash from '../../lib/util/img/unsplash';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Select from '@material-ui/core/Select';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AppBarWithDrawer from '../../components/layout/AppBarWithDrawer';

interface INoveIndexComponentType extends INovelListComponentType
{
	defaultPage?: number,
}

const useStyles = makeStyles((theme: Theme) =>
		createStyles({

			search: {
				position: 'relative',
				borderRadius: theme.shape.borderRadius,
				backgroundColor: fade(theme.palette.common.white, 0.15),
				'&:hover': {
					backgroundColor: fade(theme.palette.common.white, 0.25),
				},
				marginRight: theme.spacing(2),
				marginLeft: 0,
				width: '100%',
				[theme.breakpoints.up('sm')]: {
					marginLeft: theme.spacing(3),
					//width: '60%',
				},
			},
			searchIcon: {
				width: theme.spacing(7),
				height: '100%',
				position: 'absolute',
				pointerEvents: 'none',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
			inputRoot: {
				color: 'inherit',
			},
			inputInput: {
				padding: theme.spacing(1, 1, 1, 7),
				transition: theme.transitions.create('width'),
				width: '100%',
//			[theme.breakpoints.up('md')]: {
//				width: 300,
//			},
			},
		}),
);

const Index = (prop?: INoveIndexComponentType) =>
{
	const classes = useStyles();

	let [dataList, setDataList] = useState([] as ICachedJSONRowPlus[]);
	let [perPage, setPerPage] = useState(6);
	let [page, setPage] = useState(prop.defaultPage | 0 || 1);
	let [count, setCount] = useState(1);

	const updatePage = (newPage: number) =>
	{
		let newCount = Math.ceil(prop.dataList.length / perPage);
		newPage = Math.max(1, Math.min(newCount, newPage));

		let idx = (perPage * (newPage - 1));

		let newDataList = prop.dataList.slice(idx, idx + perPage);

		newDataList.forEach(item =>
		{
			if (!item.cover)
			{
				item.cover = imgUnsplash();
			}
		});

		if (newDataList !== dataList)
		{
			setDataList(newDataList);
		}
		if (newPage !== page)
		{
			setPage(newPage);
		}
		if (newCount !== count)
		{
			setCount(newCount);
		}

		return newDataList
	};

	const changePage = (event, newPage: number) =>
	{
		updatePage(newPage)
	};

	const changePerPage = (event: React.ChangeEvent<{ value: unknown }>) =>
	{
		setPerPage(event.target.value as number);
	};

	useEffect(() =>
	{
		updatePage(page)
	}, [perPage]);

	return (<AppBarWithDrawer
			barChildren={() =>
			{
				return <>
					<Typography variant="h6" noWrap>

					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							inputProps={{ 'aria-label': 'search' }}
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
						/>
					</div>
					<Select
						value={perPage}
						onChange={changePerPage}
					>
						<MenuItem value={4}>4</MenuItem>
						<MenuItem value={6}>6</MenuItem>
						<MenuItem value={9}>9</MenuItem>
						<MenuItem value={10}>10</MenuItem>
						<MenuItem value={15}>15</MenuItem>
						<MenuItem value={25}>25</MenuItem>
						<MenuItem value={30}>30</MenuItem>
						<MenuItem value={34}>34</MenuItem>
						<MenuItem value={36}>36</MenuItem>
					</Select>
				</>
			}}
			drawerChildren={() =>
			{
				return <>
					<List>
						{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
							<ListItem button key={text}>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
					</List>
					<Divider />
					<List>
						{['All mail', 'Trash', 'Spam'].map((text, index) => (
							<ListItem button key={text}>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
					</List>
				</>
			}}
		>
			<Box display="flex" justifyContent="center" m={1} p={1}>
				<Pagination
					color="secondary"
					count={count}
					page={page}
					renderItem={item => ({
						...item,
						//href: `?page=${item.page}`,
						//as: `?page=${item.page}`,
					})}
					onChange={changePage}
				/>
			</Box>


			<Box display="flex" justifyContent="center" m={1} p={1}>

				<ListCard dataList={dataList} />

			</Box>

			<Box display="flex" justifyContent="center" m={1} p={1}>

				<Pagination
					color="secondary"
					count={count}
					page={page}
					renderItem={item => ({
						...item,
						//href: `?page=${item.page}`,
						//as: `?page=${item.page}`,
					})}
					onChange={changePage}
				/>

			</Box>
		</AppBarWithDrawer>)
};

(Index as NextComponentType).getInitialProps = async function (_ctx)
{
	let ctx = getCTX(_ctx);

	if (!ctx.req)
	{
		return {};
	}

	let body = new URLSearchParams();

	body.set('all', '1');

	let dataList: ICachedJSONRowPlus[];

	if (1)
	{
		dataList = [];

		for (let i = 0; i < 50; i++)
		{
			let item = {
				title: String(i),
				uuid: String(i + Math.random()),
				updated: Date.now(),
			} as any;
			item.cover = imgUnsplash();

			dataList.push(item)
		}
	}
	else
	{
		dataList = await fetchApi(ctx, '/api/search', {
			method: 'GET',
			body,
		})
			.then(v => v.json())
			.then(v =>
			{
				if (Array.isArray(v))
				{
					return v
				}

				console.error(v);

				return Promise.reject(v)
			})
		;
	}

	return {
		defaultPage: (ctx?.query?.page as any) | 0 || 1,
		dataList,
	} as INoveIndexComponentType
};

export default Index;
