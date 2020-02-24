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
import React, { useState, useEffect, createRef } from 'react';
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
import SearchBar from '../../components/SearchBar';
import fetchNovelSearch from '../../lib/util/fetch/fetchNovelSearch';
import DialogSelect from '../../components/novel/DialogSelect';
import { useSwipeable } from "react-swipeable";
import useEventListener from '@use-it/event-listener'
import { EnumHandleClickType } from '../../components/novel/types';

interface INoveIndexComponentType extends INovelListComponentType
{
	defaultPage?: number,
	isAll?: boolean,
}

const Index = (prop?: INoveIndexComponentType) =>
{
	let [dataList, setDataList] = useState([] as ICachedJSONRowPlus[]);
	let [perPage, setPerPage] = useState(6);
	let [page, setPage] = useState(prop.defaultPage | 0 || 1);
	let [count, setCount] = useState(1);
	let [searchType, changeSearchType] = useState('title');
	let [isAll, setIsAll] = useState(prop.isAll);

	let [fullMathSearch, changeFullMathSearch] = useState(false);

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

	const handlers = useSwipeable({
		onSwipedLeft: () => updatePage(page + 1),
		onSwipedRight: () => updatePage(page - 1),
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	});

	// @ts-ignore
	useEventListener('keydown', ({ key }) =>
	{

		switch (key)
		{
			case 'ArrowRight':
			case 'PageDown':
				updatePage(page + 1);
				break;
			case 'ArrowLeft':
			case 'PageUp':
				updatePage(page - 1);
				break;
		}
	});

	const changePage = (event, newPage: number) =>
	{
		updatePage(newPage)
	};

	const searchRef = createRef<HTMLInputElement>();

	const doSearch = async (options?: {
		reset?: boolean,
		field?: {
			[k in keyof ICachedJSONRowPlus]: unknown
		}
	}) =>
	{

		//console.log(searchRef.current);

		if (options?.reset)
		{
			searchRef.current.value = '';

			if (isAll)
			{
				return;
			}
			else
			{
				let newDataList = await fetchNovelSearch({
						all: 1,
					})
				;

				setIsAll(true);
				prop.dataList.splice(0, prop.dataList.length);
				prop.dataList.push(...newDataList);
				updatePage(1);
				return;
			}
		}

		let body: Record<string, any>;

		if (options.field)
		{
			body = {
				...options.field,
				full: fullMathSearch,
			}
		}
		else if (searchRef.current.value)
		{
			body = {
				[searchType]: searchRef.current.value,
				full: fullMathSearch,
			}
		}

		if (body)
		{
			let newDataList = await fetchNovelSearch(body)
				.catch(e => [])
			;

			setIsAll(false);
			prop.dataList.splice(0, prop.dataList.length);
			prop.dataList.push(...newDataList);
			updatePage(1)
		}
	};

	useEffect(() =>
	{
		updatePage(page)
	}, [perPage]);

	const handleClick = async (type: EnumHandleClickType, value, novel?: ICachedJSONRowPlus) =>
	{

		console.log({
			type,
			value,
			siteID: novel.siteID,
			title: novel.title,
		})

		switch (type)
		{
			case EnumHandleClickType.Favorite:
			case EnumHandleClickType.novel:
			case EnumHandleClickType.unknown:
				break;
			default:
				if (novel && type in novel)
				{
					await doSearch({
						// @ts-ignore
						field: {
							[type]: value,
						}
					})
				}
		}

	};

	return (<AppBarWithDrawer
		barChildren={() =>
		{
			return (<>
				<Typography variant="h6" noWrap>

				</Typography>

				<SearchBar inputRef={searchRef} onClose={() => doSearch({
					reset: true,
				})} />

				<IconButton type="submit" aria-label="search" color="secondary" onClick={() => doSearch()}>
					<SearchIcon />
				</IconButton>

				<Divider />

				<DialogSelect
					perPage={perPage}
					searchType={searchType}
					changeSearchType={changeSearchType}
					changePerPage={setPerPage}

					fullMathSearch={fullMathSearch}
					changeFullMathSearch={changeFullMathSearch}
				/>

			</>)
		}}
		drawerChildren={() =>
		{
			return (<>
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
			</>)
		}}
	>
		<div {...handlers}>


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

				<ListCard
					dataList={dataList}
					handleClick={handleClick}
				/>

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

		</div>
	</AppBarWithDrawer>)
};

(Index as NextComponentType).getInitialProps = async function (_ctx)
{
	let ctx = getCTX(_ctx);

	if (!ctx.req)
	{
		return {};
	}

	let body: RequestInit["body"] | Record<string, any>;

	if (0)
	{
		body = new URLSearchParams();
		body.set('all', '1');
	}
	else
	{
		body = {
			all: 1,
		}
	}

	let dataList: ICachedJSONRowPlus[];
	let isAll: boolean;

	if (0)
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
		dataList = await fetchNovelSearch(body, {}, ctx)
			.catch(e => [])
		;

		isAll = !!dataList.length;
	}

	return {
		defaultPage: (ctx?.query?.page as any) | 0 || 1,
		dataList,
		isAll,
	} as INoveIndexComponentType
};

export default Index;
