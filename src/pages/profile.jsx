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

export function Profile({ data, user }) {
  const [oldPassword, setOldPassword] = React.useState()
  const [newPassword, setNewPassword] = React.useState()
  const [confirmNewPassword, setConfirmNewPassword] = React.useState()


  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }

  React.useEffect(() => {
    console.log(user, data)
  }, [])

  function resetPassword() {
    if (newPassword !== confirmNewPassword) {
      alert("確認密碼不符，請重新輸入")
    } else {
      fetch("/api/changepass", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: data.data.userid,
          oldpass: oldPassword,
          newpass: newPassword,
        })
      })
        .then(res => res.json())
        .then(res => {
          alert("更改密碼成功，下次請用新密碼登入")
          setOldPassword("")
          setNewPassword("")
          setConfirmNewPassword("")
          window.location.href = "/"
        })
        .catch(() => {
          alert("更新密碼失敗")
        })
    }
  }


  return (
    <>


      <TopBar logined={true} data={data.data} user={user} title={"個人資料"} />

      <Box sx={{ p: 3 }}>
        <h1>個人資料</h1>

        <Paper sx={{ p: 2 }}>
          <div>

            <h2>
              <FaceIcon sx={{verticalAlign:"middle"}}/>
              &nbsp;
              {data.data.username}<br />
              {data.data.userid}
              <br />
              {
                data.data.role === "std" ?
                  <Chip label="學生" color="primary" />
                  :
                  data.data.role === "par" ?
                    <Chip label="家長" color="secondary" />
                    :
                    <Chip label="老師" color="success" />
              }</h2>

          </div>
        </Paper>
        <p></p>
        <Paper sx={{ p: 2 }}>
          <h2>變更密碼</h2>
          <Alert severity='warning' >
            <AlertTitle>請注意</AlertTitle>
            請妥善保管新密碼，如果忘記密碼，{data.data.role !== "teacher" ? "需要請老師協助重設密碼" : "就無法再使用此系統"}
          </Alert>
          <TextField type='password' label="輸入原本密碼" variant="standard" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <p></p>
          <TextField type='password' label="輸入新密碼" variant="standard" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <br />
          <TextField type='password' label="再次輸入新密碼" variant="standard" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          <p></p>
          <Button variant='contained' onClick={resetPassword}>送出</Button>
        </Paper>

      </Box>
    </>
  )
}