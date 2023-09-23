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

export function Score({ data, user }) {

  const [scoreData, setScoreData] = React.useState(
    { your: -1, avg: -1, hi: -1, lo: -1 }
  )

  const [scoreTitle, setScoreTitle] = React.useState({ title: "", id: "" })

  const [loading, setLoading] = React.useState(true)
  const [loadingState, setLoadingState] = React.useState("")

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
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
        console.log(res)
        var list = [], k = false
        for (let i = 0; i < res.data.result.length; i++) {
          list.push(res.data.result[i].uid)

          if (res.data.result[i].uid == UrlParam("q")) {
            k = true
            setScoreTitle({ title: res.data.result[i].scoreName, id: res.data.result[i].uid })
            fetch("/api/getscorebyid", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: UrlParam("q") }),
            })
              .then(res2 => res2.json())
              .then(res2 => {
                setScoreData(res2.data)
                setLoading(false)

              })
          }
        }
        if (!k) {
          alert("找不到考試")
          setLoadingState("發生錯誤")
          // setLoading(false)
        }





      })
    //  list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
  }

  React.useEffect(() => {
    getScore(UrlParam("q"))
  }, [])

  return (
    <>


      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        {loadingState.includes("發生錯誤") ?
          <></> :
          <CircularProgress color="inherit" />

        }
        <br />
        <p>{loadingState}</p>
      </Backdrop>



      <TopBar logined={true} data={data.data} user={user} title={scoreTitle.title ? scoreTitle.title : "資料讀取中..."} />

      <Box sx={{ p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Item>
                <h3>{data.data.userid.toLowerCase().includes("s") ? "你" : "孩子"}的成績</h3>
                <p>{scoreData.your ? scoreData.your : "缺考"}</p>
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item>
                <h3>全班平均</h3>
                <p>{scoreData.avg}</p>
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item>
                <h3>班級最高分</h3>
                <p>{scoreData.hi}</p>
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item>
                <h3>班級最低分</h3>
                <p>{scoreData.lo}</p>
              </Item>
            </Grid>
          </Grid>
        </Box>

      </Box>
    </>
  )
}