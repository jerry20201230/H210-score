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

export function AllScoreSheet({ data, user }) {


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"成績管理"} />
            <Grid container spacing={2} >
                <Grid xs={6}>
                    <Item><h1>查詢成績</h1>查詢現有成績</Item>
                </Grid>
                <Grid xs={6}>
                    <Item><h1>新增成績</h1></Item>
                </Grid>

            </Grid>
        </>
    )
}