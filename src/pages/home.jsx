import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button, Paper, Typography } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import Tabs from '../tabs';
import ScoreTabs from '../tabs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function Homepage({ user, data }) {

  const [scorelist, setScoreList] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const [scoreTab, setScoreTab] = React.useState("loading")
  React.useEffect(() => {
    getScore()
  }, [])

  function getScore() {
    setLoading(true)
    fetch("/api/getscore", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(res => {

        if (res.ok) {
          fetch("/api/getscoremap", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          })
            .then(res2 => res2.json())
            .then(res2 => {
              setLoading(false)
              if (res2.ok) {

                var list = []
                for (let i = 0; i < res2.data.result.length; i++) {
                  list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid, subject: res2.data.result[i].subject })
                }
                setScoreList(list)
              } else {
                alert("發生錯誤，請刷新網站!!")
              }

            })
        } else {
          setLoading(false)
          alert("發生錯誤，請刷新網站!!")
        }
      })
  }
  React.useEffect(() => {
    if (scorelist.length < 1) {
      setScoreTab(<p>沒有可查詢的資料</p>)
    } else {
      setScoreTab(<ScoreTabs data={scorelist} role={"std"} />)
    }
  }, [scorelist])

  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"首頁"} />
      <Box sx={{ p: 3 }}>

        <Typography variant='h5'> Hi, {data.data.username}</Typography>
        <Typography variant='h6'>選擇成績，開始查詢</Typography>
        {scoreTab}
        <Button sx={{ display: "none" }} onClick={() => getScore()}>重新整理</Button>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}