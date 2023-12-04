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
import ReCAPTCHA from 'react-google-recaptcha';
import useMediaQuery from '@mui/material/useMediaQuery';

export function Score({ data, user, handleError }) {

  const [scoreData, setScoreData] = React.useState(
    { your: -1, avg: -1, hi: -1, lo: -1, privateMsg: null, queryTimes: "0%|%2023/1/1 00:00:00%|%0%|%2023/1/1 00:00:00" }
  )

  const [scoreTitle, setScoreTitle] = React.useState({ title: "", id: "" })

  const [annousment, setAnnousment] = React.useState(<></>)
  const [annousmentWid, setAnnousmentWid] = React.useState(12)
  const [isAnnousment, setIsAnnousment] = React.useState(false)

  const [privateTalk, setPrivateTalk] = React.useState(<></>)
  const [privateTalkWid, setPrivateTalkWid] = React.useState(12)

  const [loading, setLoading] = React.useState(true)
  const [loadingState, setLoadingState] = React.useState("")
  const [loadingState2, setLoadingState2] = React.useState("")

  const [recaptcha, setRecaptcha] = React.useState("")
  const [isrank, setIsRank] = React.useState(false)

  function delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    overflow: "auto",
    color: theme.palette.text.secondary,
  }));

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = (
    localStorage.getItem("theme") == "light" ? "light" :
      localStorage.getItem("theme") == "dark" ? "dark" :
        prefersDarkMode ? "dark" : "light"
  )

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

                body: JSON.stringify({ id: UrlParam("q"), isrank: res.data.result[i].isrank > 0, countScore: true }),
              })
                .then(res2 => res2.json())
                .then(res2 => {
                  if (res2.ok) {
                    setScoreData(res2.data)
                    setLoading(false)
                  } else {
                    console.log(res2.code)

                    handleError([true, res2.code])
                    setLoadingState("發生錯誤")
                    setLoadingState2(<>暫時無法查詢這筆成績<br />請過幾分鐘再試一次</>)
                  }
                })
                .catch(() => {
                  console.log(res.code)
                  handleError([true, res.code])
                  setLoadingState("發生錯誤")
                  setLoadingState2(<>暫時無法查詢這筆成績<br />請過幾分鐘再試一次</>)
                })
            }
          }
          if (!k) {
            handleError([true, 404])
            setLoadingState("發生錯誤")
            setLoadingState2("成績不存在")

            // setLoading(false)
          }
        } else {
          handleError([true, 700])
          alert("發生錯誤，請刷新網站!!")
        }

      })
    //  list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
  }

  React.useEffect(async () => {


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

  }, [scoreData, annousmentWid, privateTalkWid])

  return (
    <>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: "column" }}
        open={loading}
      >
        <h2>{loadingState}</h2>
        <h3 style={{ margin: 0, padding: 0 }}>{loadingState2}</h3>

        {loadingState.includes("發生錯誤") ?
          <p>
            <Button component={Link} to="/" variant="contained">回首頁</Button>
          </p> :
          <CircularProgress color="inherit" />
        }
        <br />

      </Backdrop>



      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={scoreTitle.title ? scoreTitle.title : "資料讀取中..."} />
      {true ?


        <Box sx={{ p: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {annousment ? annousment : <></>}{privateTalk ? privateTalk : <></>}
              <Grid xs={6}>
                <Item>
                  <h3>{data.data.userid.toLowerCase().includes("s") ? "你" : "孩子"}的{isrank ? "名次" : "成績"}</h3>
                  <p>{(scoreData.your !== 'null' && scoreData.your !== 'undefined') ? scoreData.your : "缺考"}</p>
                </Item>
              </Grid>
              {
                isrank ? <></> : <Grid xs={6}>
                  <Item>
                    <h3>全班平均</h3>
                    <p>{scoreData.avg}</p>
                  </Item>
                </Grid>
              }
              <Grid xs={6}>
                <Item>
                  <h3>{isrank ? "班級最低名次" : "班級最高分"}</h3>
                  <p>{scoreData.hi}</p>
                </Item>
              </Grid>
              <Grid xs={6}>
                <Item>
                  <h3>{isrank ? "班級最高名次" : "班級最低分"}</h3>
                  <p>{scoreData.lo}</p>
                </Item>
              </Grid>

              {
                data.data.role == "std" ?

                  <Grid xs={6}>
                    <Item sx={{ background: scoreData.queryTimes ? (Number(scoreData.queryTimes.split("%|%")[0]) > 0 ? blue[500] : green[600]) : blue[500], color: "#fff" }}>
                      <h3>學生專屬功能</h3>
                      <p>
                        {
                          scoreData.queryTimes == null ? <>暫時無資料</> :
                            Number(scoreData.queryTimes.split("%|%")[0]) > 0 ? <>家長已經看過這筆成績</> : <>家長還沒看過這筆成績</>
                        }</p>
                      <Button variant="contained" component={Link} to={`/score/more?q=${UrlParam("q")}`} color={
                        scoreData.queryTimes ? (Number(scoreData.queryTimes.split("%|%")[0]) > 0 ? "primary" : "success") : "primary"
                      }>{scoreData.queryTimes == null ? "重新讀取" : "更多"}</Button>
                    </Item>
                  </Grid>
                  : <></>
              }
            </Grid>
          </Box>
        </Box>

        : <>
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress color="secondary" />
            <h3>正在連線到資料庫</h3>
            <p>連線完成後就可以查看成績</p>
            {/* <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <ReCAPTCHA
                sitekey="6LeoWJ0oAAAAAN9LRkvYIdq3uenaZ6xENqSPLr9_"
                onChange={async e => { await delay(1); setRecaptcha(e) }}
                onExpired={e => { setRecaptcha("") }}
                theme={theme}
              />
            </Box> */}
            <p></p>
          </Box>
        </>
      }
    </>
  )
}