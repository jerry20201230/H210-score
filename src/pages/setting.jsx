import * as React from 'react'
import TopBar from '../Topbar'
import { Alert, AlertTitle, Box, Button, TextField } from '@mui/material';
import "../App.css"
import { red, yellow, green } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';
import ThemePicker from '../themePicker';

export function Setting({ data, user }) {


    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"系統設定"} />

            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 2 }}>
                    <div>色彩模式</div>
                    <ThemePicker />
                </Paper>
            </Box>
        </>
    )

}