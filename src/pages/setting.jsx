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
import ToggleLabel from '../toggleLabel';

export function Setting({ data, user }) {


    return (
        <>
            <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"系統設定"} />

            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 2 }}>
                    <h2>色彩模式</h2>
                    <p>選擇顯示色彩的樣式</p>
                    <ThemePicker />
                </Paper>
                <p></p>
                <Paper sx={{ p: 2 }}>
                    <h2>標籤</h2>
                    <p>在成績列表上新增標籤，方便快速取得資訊</p>
                    {data.data.role == "std" ? <p>不用擔心，在開啟學生專屬功能時，標籤不會顯示該筆成績資料給家長</p> : <></>}
                    <ToggleLabel user={data.data} />
                </Paper>
                <p></p>
                <Paper sx={{ p: 2 }}>
                    <h2>關於</h2>
                    <code>
                        成績查詢系統 v1.0
                        BY Jerry <br />
                        2023.10<br />
                        SVG Background by <Button component="a" target="_blank" href="https://bgjar.com" variant="text">BGJar</Button>
                    </code>
                </Paper>
            </Box>
        </>
    )

}