import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button } from '@mui/material';
import "../App.css"
import { red, yellow, green } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ScoreTabs from '../tabs';

export function SearchScoreSheet({ data, user }) {

	const [scoreList, setScoreList] = React.useState(
		[{ title: "", id: "" }]
	)
	const [scoreTab, setScoreTab] = React.useState("loading")

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));



	React.useEffect(() => {
		fetch("/api/getscoremap", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		})
			.then(res2 => res2.json())
			.then(res2 => {
				console.log(res2)
				var list = []
				for (let i = 0; i < res2.data.result.length; i++) {
					list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
				}
				setScoreList(list)
			})
	}, [])


	React.useEffect(() => {
		if (scoreList.length < 1) {
			setScoreTab("沒有可查詢的資料")
		} else {
			setScoreTab(<ScoreTabs data={scoreList} role={"teacher"} />)
		}
	}, [scoreList])


	return (
		<>
			<TopBar logined={true} data={data.data} user={user} title={"成績管理"} />
			<Box sx={{ p: 3 }}>
				<h1>所有成績</h1>
				{scoreTab}
			</Box>
		</>
	)
}