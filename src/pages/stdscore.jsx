import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button, Alert } from '@mui/material';
import "../App.css"
import { red, yellow, green, grey, blue } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { List, ListItem, ListItemText, Switch } from "@mui/material"

import 'dayjs/plugin/relativeTime'
import 'dayjs/plugin/utc'
import 'dayjs/locale/zh-tw'

import 'dayjs/plugin/timezone' // dependent on utc plugin



export function StdScore({ data, user }) {


  const [scoreData, setScoreData] = React.useState(
    { your: -1, avg: -1, hi: -1, lo: -1, privateMsg: null, queryTimes: "0%|%2023/1/1 00:00:00%|%0%|%2023/1/1 00:00:00" }
  )

  const [scoreTitle, setScoreTitle] = React.useState({ title: "", id: "" })

  const [annousment, setAnnousment] = React.useState(<></>)


  const [loading, setLoading] = React.useState(true)
  const [loadingState, setLoadingState] = React.useState("")

  const [isrank, setIsRank] = React.useState(false)

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    overflow: "auto",
    color: theme.palette.text.secondary,
  }));


  const [setting_1, setSetting_1] = React.useState(false)

  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }

  function getScore(id) {
    fetch("/api/getscoremap", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: UrlParam("q") }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {

          var list = [], k = false
          for (let i = 0; i < res.data.result.length; i++) {
            list.push(res.data.result[i].uid)

            if (res.data.result[i].uid == UrlParam("q")) {
              k = true


              setAnnousment(
                res.data.result[i].summery
              )

              setIsRank(res.data.result[i].isrank > 0)
              setScoreTitle({ title: res.data.result[i].scoreName, id: res.data.result[i].uid })
              fetch("/api/getscorebyid", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },

                body: JSON.stringify({ id: UrlParam("q"), isrank: res.data.result[i].isrank > 0 }),
              })
                .then(res2 => res2.json())
                .then(res2 => {
                  if (res2.ok) {
                    setScoreData(res2.data)
                    setLoading(false)
                  } else {
                    alert("發生錯誤，請刷新網站!!")
                  }
                })
                .catch(() => {

                  setLoadingState("發生錯誤")
                })
            }
          }
          if (!k) {
            alert("找不到考試")
            setLoadingState("發生錯誤")
            // setLoading(false)
          }
        } else {
          alert("發生錯誤，請刷新網站!!")
        }

      })
    //  list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
  }

  React.useEffect(() => {

    getScore(UrlParam("q"))
    dayjs.locale('zh-tw')
  }, [])
  // React.useEffect(() => {
  //   console.log(scoreData.queryTimes.split("%|%")[1])

  //   console.log(dayjs().tz(dayjs(scoreData.queryTimes.split("%|%")[1]), 'Asia/Taipei'))
  //   console.log(dayjs(new Date()).from(dayjs.utc(dayjs(scoreData.queryTimes.split("%|%")[1])).tz('Asia/Taipei')))
  // }, [scoreData])

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: "column" }}
        open={loading}
      >
        <p>{loadingState}</p>
        {loadingState.includes("發生錯誤") ?
          <>
            <Button component={Link} to="/" variant="contained">回首頁</Button>
          </> :
          <CircularProgress color="inherit" />

        }
        <br />

      </Backdrop>

      <TopBar logined={true} data={data.data} user={user} title={"學生專屬功能"} />

      <div className='backdrop-slash'>
        <Box sx={{ p: 3 }}>

          <h2>{scoreTitle.title ? scoreTitle.title : "資料讀取中..."}</h2>

          <Paper sx={{ p: 2 }}>
            <h2>家長查詢狀態</h2>
            <p>
              {
                scoreData.queryTimes == null ? <>暫時無資料，請刷新網站</> :
                  Number(scoreData.queryTimes.split("%|%")[0]) > 0 ?
                    <>
                      家長已經看過這筆成績 {Number(scoreData.queryTimes.split("%|%")[0])}次<br />
                      最近一次在 {dayjs(new Date()).from(dayjs.tz(dayjs(scoreData.queryTimes.split("%|%")[1]), 'Asia/Taipei'))}
                    </>
                    :
                    <>家長還沒看過這筆成績</>
              }
            </p>
          </Paper>
          <p></p>
          <Paper sx={{ p: 2 }}>
            <h2>進階設定</h2>
            <div hidden>
              <Alert severity="warning">
                <b>警告</b><br />
                請確定你身邊沒有大人、監控攝影機與錄音設備，再繼續下一步
              </Alert>
              <Button color="error" variant="contained" >下一步</Button>
            </div>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
              <ListItem>

                <ListItemText id="switch-list-label-wifi" primary="短暫維持家庭和睦" secondary={"暫停家長的查詢這筆成績的權限10分鐘，期間將在家長的裝置上顯示錯誤訊息。每筆成績每天限用3次，你今天用了"} />
                <Switch
                  edge="end"
                  onChange={setSetting_1(!setting_1)}
                  checked={setting_1}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </div>

    </>
  )
}