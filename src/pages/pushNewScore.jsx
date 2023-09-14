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
import { InputForm } from '../inputBoxs';

export function PushNewScore({ data, user }) {
    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"新增成績"} />
            <Box sx={{ p: 3 }}>
                <InputForm i={45}></InputForm>
            </Box>

        </>
    )
}