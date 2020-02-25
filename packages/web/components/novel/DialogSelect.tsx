import React, {
	PropsWithChildren,
	ReactNode,
	useState,
	ChangeEventHandler,
	InputHTMLAttributes,
	createRef, ChangeEvent, RefObject,
} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Button, Theme, createStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import DialogActions from '@material-ui/core/DialogActions';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import Divider from '@material-ui/core/Divider';
import WifiIcon from '@material-ui/icons/Wifi';
import TextField from '@material-ui/core/TextField';
import { AccountCircle } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		},
		formControl: {
			margin: theme.spacing(2),
			minWidth: 120,
		},
	}),
);

export default (prop: PropsWithChildren<{
	searchType: string,
	perPage: number,
	changeSearchType(value: string),
	changePerPage(value: number),

	fullMathSearch: boolean,
	changeFullMathSearch(value: boolean),

	displayMode: number,
	changeDisplayMode(value: number),

	novelOpdsNowServer: string,
	setNovelOpdsNowServer(value: string),
}>) =>
{
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	//const searchTypeRef = createRef<HTMLSelectElement>();
	//const perPageRef = createRef<HTMLSelectElement>();

	const handleClose = () =>
	{
		setOpen(false);
	};

	const handleApply = () =>
	{

		//prop.changeSearchType(searchTypeRef.current.value);
		//prop.changePerPage((perPageRef.current.value as any) | 0);

		handleClose();
	};

	return <>
		<Tooltip title="設定">
			<IconButton onClick={() => setOpen(true)}><SettingsIcon /></IconButton>
		</Tooltip>
		<Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
			<DialogTitle><SettingsIcon color={'secondary'} /> 設定</DialogTitle>
			<DialogContent>
				<form className={classes.container}>

					<FormGroup>

						<FormControl className={classes.formControl}>
							<InputLabel>搜尋目標</InputLabel>
							<Select
								value={prop.searchType}
								onChange={event => prop.changeSearchType(event.target.value as any)}
								//ref={searchTypeRef}
							>
								<MenuItem value="title">標題</MenuItem>
								<MenuItem value="content">簡介</MenuItem>
								<MenuItem value="authors">作者</MenuItem>
								<MenuItem value="tags">標籤</MenuItem>
							</Select>
						</FormControl>

						<FormControl className={classes.formControl}>
							<InputLabel>每頁顯示數量</InputLabel>
							<Select
								value={prop.perPage}
								onChange={event => prop.changePerPage(event.target.value as any)}
								//ref={perPageRef}
							>
								<MenuItem value={4}>4</MenuItem>
								<MenuItem value={5}>5</MenuItem>
								<MenuItem value={6}>6</MenuItem>
								<MenuItem value={8}>8</MenuItem>
								<MenuItem value={9}>9</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={15}>15</MenuItem>
								<MenuItem value={20}>20</MenuItem>
								<MenuItem value={25}>25</MenuItem>
								<MenuItem value={30}>30</MenuItem>
								<MenuItem value={34}>34</MenuItem>
								<MenuItem value={36}>36</MenuItem>
							</Select>
						</FormControl>

					</FormGroup>

					<Divider variant="middle" />

					<FormGroup>

						<FormControlLabel
							control={
								<Checkbox
									checked={prop.fullMathSearch}
									onChange={event => prop.changeFullMathSearch(event.target.checked)}
									value={true}
								/>
							}
							label="全字符合"
						/>

						<FormControl className={classes.formControl}>
							<InputLabel>顯示模式</InputLabel>
							<Select
								value={prop.displayMode}
								onChange={event => prop.changeDisplayMode(event.target.value as any)}
								//ref={perPageRef}
							>
								<MenuItem value={0}>預設</MenuItem>
								<MenuItem value={1}>列表</MenuItem>
							</Select>
						</FormControl>

					</FormGroup>

					<FormGroup>

						<FormControl className={classes.formControl}>
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<WifiIcon />
								</Grid>
								<Grid item>
									<TextField label="novel-opds-now server" placeholder={"http://127.0.0.1:3000"}
														 defaultValue={prop.novelOpdsNowServer}
														 onChange={(event => prop.setNovelOpdsNowServer(event.target.value))} />
									<IconButton
										color="primary"
										aria-label="novel-opds-now server"
										href={"https://www.npmjs.com/package/novel-opds-now"}
										target={"_blank"}
									>
										<LiveHelpIcon />
									</IconButton>
								</Grid>
							</Grid>
						</FormControl>

					</FormGroup>

				</form>

			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleApply} color="secondary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	</>
}
