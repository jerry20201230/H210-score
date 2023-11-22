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

export function ErrorPage({ errorId, errorSummery, data, user }) {
    // ERRORID LIST
    // 0: no error
    // 403: blocked
    // 404: score not found
    // 500: server error
    // 700: blocked via student's feature or something went wrong
    // 1000:network error
    const errorIdList = [0, 403, 404, 500, 700, 1000]
    const errorDefSummery = [["未偵測到錯誤", ": )"], ["沒有權限使用", "請確定你登入的帳號是否正確"], ["找不到成績", "請確定你的網址是否正確，或聯絡老師取得新網址"], ["內部伺服器錯誤", "對不起，我們正在努力修復，稍後將恢復正常"], ["暫時性錯誤", "請等待幾分鐘，然後再試一次"], ["網路錯誤", "請檢查你的網路連線，然後再試一次"]]

    const [pageContent, setPageContent] = React.useState(["正在偵測錯誤類型", "正在偵測錯誤類型"])


    return (
        <>
            <TopBar needCheckLogin={false} logined={true} data={data.data} user={user} title={"發生錯誤"} />
            <Box sx={{ p: 3 }}>
                <center>
                    <h2>
                        {errorDefSummery[errorIdList.indexOf(errorId)][0]}
                    </h2>
                    <p>
                        {errorDefSummery[errorIdList.indexOf(errorId)][1]}
                    </p>
                    <p>
                        <Button variant="contained" onClick={() => window.location.reload()}>重新整理</Button>
                        <Button component={Link} to="/" variant="outlined">回首頁</Button>
                    </p>
                    <pre>
                        錯誤代碼: {errorId}
                    </pre>
                </center>
            </Box>
        </>
    )
}
