import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button } from '@mui/material';
import "../App.css"
import { red, yellow, green, grey, blue } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { Announcement } from '@mui/icons-material';

export function StdScore({ data, user }) {

  const [scoreData, setScoreData] = React.useState(
    { your: -1, avg: -1, hi: -1, lo: -1, privateMsg: null, queryTimes: "0%|%0" }
  )

  const [scoreTitle, setScoreTitle] = React.useState({ title: "", id: "" })

  const [annousment, setAnnousment] = React.useState(<></>)
  const [annousmentWid, setAnnousmentWid] = React.useState(12)
  const [isAnnousment, setIsAnnousment] = React.useState(false)

  const [privateTalk, setPrivateTalk] = React.useState(<></>)
  const [privateTalkWid, setPrivateTalkWid] = React.useState(12)

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
  }, [])

  React.useEffect(() => {
    var isAnnousment = annousment !== "null" && annousment !== "undefined" && annousment,
      isPrivateMsg = scoreData.privateMsg !== "null" && scoreData.privateMsg !== "undefined" && scoreData.privateMsg
    if (isAnnousment && isPrivateMsg) {
      setAnnousment(
        <>
          <Grid xs={6}>
            <Item>
              <h3>公告訊息</h3>
              <p>{annousment}</p>
            </Item>
          </Grid>
        </>
      )
      setPrivateTalk(
        <>
          <Grid xs={6}>
            <Item>
              <h3>私人留言</h3>
              <p>老師: {scoreData.privateMsg}</p>
            </Item>
          </Grid>
        </>
      )
    } else if (isPrivateMsg && !isAnnousment) {

      setPrivateTalk(
        <>
          <Grid xs={12}>
            <Item>
              <h3>私人留言</h3>
              <p>老師: {scoreData.privateMsg}</p>
            </Item>
          </Grid>
        </>
      )
      setAnnousment(<></>)

    } else if (isAnnousment && !isPrivateMsg) {
      setAnnousment(
        <>
          <Grid xs={12}>
            <Item>
              <h3>公告訊息</h3>
              <p>{annousment}</p>
            </Item>
          </Grid>
        </>
      )
      setPrivateTalk(<></>)
    }
    else {
      setAnnousment(<></>)
      setPrivateTalk(<></>)
    }

  }, [scoreData, annousmentWid, Announcement, privateTalkWid])

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



      <TopBar logined={true} data={data.data} user={user} title={scoreTitle.title ? scoreTitle.title : "資料讀取中..."} />

      <div className='backdrop-slash'>
        <Box sx={{ p: 3 }}>
<Paper>
  <h2>
    學生專屬功能
  </h2>
</Paper>
       </Box>
      </div>

    </>
  )
}