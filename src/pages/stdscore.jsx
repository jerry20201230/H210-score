import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button, Alert, IconButton, Typography } from '@mui/material';
import "../App.css"
import { red, yellow, green, grey, blue } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { List, ListItem, ListItemText, Switch, } from "@mui/material"
import { relativeTime } from 'dayjs/locale/zh-tw';
import { utc } from 'dayjs/plugin/utc'
import { timezone } from 'dayjs/plugin/timezone' // dependent on utc plugin
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ScoreTabs from '../tabs';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export function StdScore({ data, user }) {


  const [scoreData, setScoreData] = React.useState(
    { your: -1, avg: -1, hi: -1, lo: -1, privateMsg: null, queryTimes: "0%|%2023/1/1 00:00:00%|%0%|%2023/1/1 00:00:00" }
  )

  const [scoreTitle, setScoreTitle] = React.useState({ title: "", id: "" })

  const [annousment, setAnnousment] = React.useState(<></>)


  const [loading, setLoading] = React.useState(true)
  const [loadingState, setLoadingState] = React.useState("")

  const [isrank, setIsRank] = React.useState(false)

  const [disableSetting1, setDisableSetting1] = React.useState(false)
  const [disableSetting2, setDisableSetting2] = React.useState(false)

  const [setting1Subtitle, setSetting1Subtitle] = React.useState(false)
  const [setting2Subtitle, setSetting2Subtitle] = React.useState(false)

  const [scorelist, setScoreList] = React.useState([])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    overflow: "auto",
    color: theme.palette.text.secondary,
  }));

  const [confirmChecked, setConfirmChecked] = React.useState(false)
  const [confirmChecked2, setConfirmChecked2] = React.useState(false)

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const [open3, setOpen3] = React.useState(false);

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = (n) => {
    setOpen3(false);
    if (n) {
      blockScore()
      setSetting_1(true)
      setDisableSetting1(true)
    }
  };

  const [open4, setOpen4] = React.useState(false);

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const handleClose4 = (n) => {
    setOpen4(false);
  };

  const [open5, setOpen5] = React.useState(false);

  const handleClickOpen5 = () => {
    setOpen5(true);
  };

  const handleClose5 = (n) => {
    setOpen5(false);
  };


  const [open6, setOpen6] = React.useState(false);

  const handleClickOpen6 = () => {
    setOpen6(true);
  };

  const handleClose6 = (n) => {
    setOpen6(false);
    if (n) {
      blockScore2()
      setSetting_2(true)
      setDisableSetting2(true)
    }
  };


  const [setting_1, setSetting_1] = React.useState(false)
  const [setting_2, setSetting_2] = React.useState(false)

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

          var list = []
          for (let i = 0; i < res.data.result.length; i++) {
            list.push({ title: res.data.result[i].scoreName, id: res.data.result[i].uid, subject: res.data.result[i].subject })
          }
          setScoreList(list)

          list = []
          var k = false
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

                body: JSON.stringify({ id: UrlParam("q"), isrank: res.data.result[i].isrank > 0, countScore: false }),
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
            alert("找不到成績")
            setLoadingState("發生錯誤")
            // setLoading(false)
          }
        } else {
          alert("發生錯誤，請刷新網站!!")
        }

      })
    //  list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
  }

  function blockScore() {
    fetch("/api/blocksearch", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: UrlParam("q") }),
    }).then(res => res.json())
      .then(res => {
        if (res.ok) {
          setSetting1Subtitle(res.message)
          getScore(UrlParam("q"))
        } else {
          alert(res.message)
          setSetting_1(false)
          setDisableSetting1(false)
        }
      })

  }

  function blockScore2() {
    fetch("/api/blocksearch2", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: UrlParam("q") }),
    }).then(res => res.json())
      .then(res => {
        if (res.ok) {
          setSetting2Subtitle(res.message)
          getScore(UrlParam("q"))
        } else {
          alert(res.message)
          setSetting_2(false)
          setDisableSetting2(false)
        }
      })

  }

  React.useEffect(() => {

    getScore(UrlParam("q"))
    // dayjs.locale('zh-tw')
    // dayjs.extend(relativeTime)
    // dayjs.extend(utc)
    // dayjs.extend(timezone)
  }, [])
  React.useEffect(() => {
    if (dayjs().isBefore(dayjs(scoreData.queryTimes.split("%|%")[3]).add(8, "hours"))) {
      setSetting1Subtitle(`短暫維持家庭和睦 到 ${dayjs(scoreData.queryTimes.split("%|%")[3]).add(8, "hours").format("YYYY/MM/DD HH:mm:ss")} 為止`)
      setSetting_1(true)
    }

    if (scoreData.queryTimes.split("%|%")[6] == "1" || scoreData.queryTimes.split("%|%")[5] == "0") {
      setDisableSetting2(true)
      if (scoreData.queryTimes.split("%|%")[6] == "1") {
        setSetting_2(true)
        setSetting2Subtitle(`已經封鎖家長的下一次查詢`)
      }
    }
  }, [scoreData])

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

      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />

      <div className='backdrop-slash'>
        <Box sx={{ p: 3 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <IconButton component={Link} to={`/score?q=${UrlParam("q")}`} sx={{ float: "left", marginTop: "-8px" }}><KeyboardBackspaceIcon /></IconButton>
            <Typography noWrap variant="h6" sx={{ marginTop: "-4px" }}>{scoreTitle.title ? scoreTitle.title : "資料讀取中..."}
            </Typography>

            <IconButton onClick={() => setOpen4(true)} sx={{ float: "right", marginTop: "-8px" }}><SyncAltIcon /></IconButton>


          </div>

          <Paper sx={{ p: 2 }}>
            <h2>家長查詢狀態(非即時) <IconButton variant="text" onClick={() => setOpen2(true)}><HelpOutlineIcon /></IconButton></h2>
            <p>
              {
                scoreData.queryTimes == null ? <>暫時無資料，請刷新網站</> :
                  Number(scoreData.queryTimes.split("%|%")[0]) > 0 ?
                    <>
                      家長已經看過這筆成績 {Number(scoreData.queryTimes.split("%|%")[0])}次<br />
                      最近一次在 {
                        (dayjs(scoreData.queryTimes.split("%|%")[1]).add(8, "hour")).format("YYYY/MM/DD HH:mm:ss")
                      }
                      <p>
                        {setting1Subtitle}<br />
                        {setting2Subtitle}</p>
                    </>
                    :
                    <>
                      家長還沒看過這筆成績
                      <p>
                        {setting1Subtitle}<br />
                        {setting2Subtitle}</p>
                    </>
              }
            </p>
            <Button variant="contained" onClick={() => { window.location.reload() }}>更新</Button>
          </Paper>
          <p></p>
          <Paper sx={{ p: 2 }}>
            <h2>進階設定</h2>
            <Alert severity="warning">
              <b>警告</b><br />
              以下選項請勿同時使用，以免發生錯誤
            </Alert>
            <div hidden>
              <Alert severity="warning">
                <b>警告</b><br />
                請確定你身邊沒有大人、監控攝影機與錄音設備，再繼續下一步
              </Alert>
              <Button color="error" variant="contained" >下一步</Button>
            </div>



            <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
              <ListItem>
                <ListItemText id="switch-list-label-wifi" secondary={<>還有{scoreData.queryTimes.split("%|%")[2]}次機會 ({(Number(scoreData.queryTimes.split("%|%")[2]) * 5)}分鐘)&nbsp;<IconButton variant="text" onClick={() => setOpen(true)}><HelpOutlineIcon /></IconButton></>} primary={<>短暫維持家庭和睦</>}
                ></ListItemText>
                <Switch
                  edge="end"
                  onChange={() => {
                    if (!setting_1 == true) {
                      handleClickOpen3()
                    }
                  }}
                  checked={setting_1}
                  disabled={disableSetting1 || Number(scoreData.queryTimes.split("%|%")[2]) < 1 || dayjs().isBefore(dayjs(scoreData.queryTimes.split("%|%")[3]).add(8, "hours"))}
                />
              </ListItem>

              <ListItem>
                <ListItemText id="switch-list-label-wifi" secondary={<>還有{scoreData.queryTimes.split("%|%")[5]}次機會 <IconButton variant="text" onClick={() => setOpen5(true)}><HelpOutlineIcon /></IconButton></>} primary={<>暫時關閉查詢權限</>}
                ></ListItemText>
                <Switch
                  edge="end"
                  onChange={() => {
                    if (!setting_2 == true) {
                      handleClickOpen6()
                    }
                  }}
                  checked={setting_2}
                  disabled={disableSetting2}
                />
              </ListItem>


            </List>
          </Paper>
        </Box >
      </div >

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"短暫維持家庭和睦 - 說明"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              <h3>⟪理性使用，請勿引發家長懷疑⟫</h3>
              <Alert severity='error'>警告: 請不要連續使用這項功能</Alert><br />
              <p></p>
              暫停家長查詢{scoreTitle.title ? scoreTitle.title : "資料讀取中..."}的權限5分鐘，期間家長的裝置上將顯示錯誤訊息。<br />每筆成績每天限用6次，你今天還有{scoreData.queryTimes.split("%|%")[2]}次機會
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"家長最後查詢狀態 - 說明"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              此處顯示的查詢次數包含家長查詢失敗的次數<br />
              在2023/10/27之前的最後查詢時間與次數<b>是由伺服器紀錄檔推算的大約值，並非實際值</b>
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open5}
        onClose={handleClose5}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"暫時關閉查詢權限 - 說明"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              <h3>⟪理性使用，請勿引發家長懷疑⟫</h3>
              開啟之後<b>無法取消</b>
              <p>
                讓家長下次無法查詢這筆成績(無論隔多久都有效)，但<b>家長刷新畫面之後就會正常</b><br />每筆成績每天有1次機會，你今天還有{scoreData.queryTimes.split("%|%")[5]}次機會
              </p>
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose5} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={open3}
        onClose={() => handleClose3(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"要啟用 短暫維持家庭和睦 嗎?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              <h3>⟪理性使用，請勿引發家長懷疑⟫</h3>

              開啟之後<b>無法取消</b>
              <p></p>

              請再次確認以下資訊:<br />
              你今天還有{scoreData.queryTimes.split("%|%")[2]}次機會<br />
              這筆成績是 {scoreTitle.title ? scoreTitle.title : "資料讀取中..."}
              <p></p>
              <FormControlLabel control={
                <Checkbox
                  checked={confirmChecked}
                  onChange={() => setConfirmChecked(!confirmChecked)}
                />
              } label="我已詳細閱讀並同意上述說明" />
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => handleClose3(false)}>
            取消
          </Button>
          <Button variant="outlined" disabled={!confirmChecked} onClick={() => handleClose3(true)}>
            確定
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open6}
        onClose={() => handleClose6(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"要啟用 暫時關閉查詢權限 嗎?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              <h3>⟪理性使用，請勿引發家長懷疑⟫</h3>

              開啟之後<b>無法取消</b>
              <p></p>

              請再次確認以下資訊:<br />
              你今天還有{scoreData.queryTimes.split("%|%")[5]}次機會<br />
              這筆成績是 {scoreTitle.title ? scoreTitle.title : "資料讀取中..."}
              <p></p>
              <FormControlLabel control={
                <Checkbox
                  checked={confirmChecked2}
                  onChange={() => setConfirmChecked2(!confirmChecked2)}
                />
              } label="我已詳細閱讀並同意上述說明" />
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => handleClose6(false)}>
            取消
          </Button>
          <Button variant="outlined" disabled={!confirmChecked2} onClick={() => handleClose6(true)}>
            確定
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog
        open={open4}
        onClose={handleClose4}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"快速切換成績"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            切換到其他成績的學生專屬功能頁面<br />
            <>
              {
                scorelist.length > 0 ? <ScoreTabs data={scorelist} role={"std"} href={"more"} /> : <>資料讀取中...</>
              }
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose4} autoFocus>
            關閉
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}