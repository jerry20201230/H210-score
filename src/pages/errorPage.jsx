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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
const { v4: uuidv4 } = require('uuid');

export function ErrorPage({ errorId, errorSummery, data, user }) {
    // ERRORID LIST
    // 0: no error
    // 403: blocked
    // 404: score not found
    // 500: server error
    // 700: blocked via student's feature(701/702) or something went wrong
    // 1000:network error
    const errorIdList = [0, 403, 404, 500, 700, 701, 702, 1000]
    const errorDefSummery = [
        ["未偵測到錯誤", ": )"],//0
        ["沒有權限使用", "請確定你登入的帳號是否正確"],//403
        ["找不到成績", "請確定你的網址是否正確，或聯絡老師取得新網址"],//404
        ["內部伺服器錯誤", "對不起，我們正在努力修復，稍後將恢復正常"],//500
        ["暫時性錯誤", "請等待幾分鐘，然後再試一次"],//700
        ["暫時性錯誤", "請等待幾分鐘，然後再試一次"],//701(block 5min)
        ["暫時性錯誤", "請等待幾分鐘，然後再試一次"],//702(block once)
        ["網路錯誤", "請檢查你的網路連線，然後再試一次"]]//1000

    const [pageContent, setPageContent] = React.useState(["正在偵測錯誤類型", "正在偵測錯誤類型"])

    const [randomCode, setRandomCode] = React.useState(uuidv4().slice(0, 4))
    const [reportState, setReportState] = React.useState("正在準備送出錯誤報告...")

    const [errorTime, setErrorTime] = React.useState(dayjs().format("YYYY/MM/DD HH:mm:ss"))
    React.useEffect(() => {
        fetch("/api/report/pusherrorlog", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                randomCode: randomCode,
                errorCode: errorId,
                time: errorTime,
                path: window.location.pathname + window.location.search
            }),
        })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    setReportState("錯誤報告回報成功，我們將盡速處理")
                } else {
                    setReportState("自動錯誤回報失敗")
                }
            })
    }, [])
    return (
        <>
            <TopBar needCheckLogin={false} logined={true} data={data.data} user={user} title={"發生錯誤"} />
            <Box sx={{ p: 3 }}>

                <Typography variant="h2" gutterBottom>
                    : (
                </Typography>
                <h2>
                    {errorDefSummery[errorIdList.indexOf(errorId)][0]}
                </h2>
                <p>
                    {errorDefSummery[errorIdList.indexOf(errorId)][1]}
                </p>
                <p>
                    <Button sx={{ m: 1 }} variant="contained" onClick={() => window.location.reload()}>重新整理</Button>
                    <Button sx={{ m: 1 }} color="secondary" variant="outlined" onClick={() => window.location.href = "/"}>回首頁</Button>
                </p>
                <hr />
                <code>
                    錯誤代碼: {errorId}
                    <p></p>
                    詳細資料如下:<br />
                    路徑:{window.location.pathname}{window.location.search}<br />
                    使用者:{data.data.username}<br />
                    時間:{errorTime}<br />
                    隨機碼:{randomCode}<br />
                    {reportState}
                </code>

            </Box>
        </>
    )
}
