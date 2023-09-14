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

export function TeacherHomePage({ data, user }) {


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"教師後臺"} />
            <Box sx={{ p: 3 }}>
                <h1>歡迎使用 成績查詢系統 教師後臺</h1>
                <Grid container spacing={2} >
                    <Grid xs={6}>
                        <Item><h1>帳號管理</h1>更改密碼</Item>
                    </Grid>
                    <Grid xs={6}>
                        <Item><h1>成績管理</h1>新增成績</Item>
                    </Grid>

                </Grid>
            </Box>

        </>
    )
}