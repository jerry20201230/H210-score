import * as React from 'react'
import TopBar from '../Topbar'
import { Box } from '@mui/material';
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

export function SearchScoreSheet({ data, user }) {

    const [scoreList, setScoreList] = React.useState(
        { title: "", id: "" }
    )

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



    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"成績管理"} />
            <Box sx={{ p: 3 }}>
                <h1>所有成績</h1>
                <nav aria-label="main mailbox folders">
                    <List>{scoreList.map((d, i) => {
                        return (

                            <ListItem disablePadding key={d.id}>
                                <ListItemButton component={Link} to={`/score/?q=${d.id}`}>
                                    <ListItemText primary={d.title} />
                                </ListItemButton>
                            </ListItem>

                        )
                    })}</List>
                </nav>
            </Box>
        </>
    )
}