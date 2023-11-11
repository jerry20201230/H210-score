import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import { Alert, Paper, Typography, CircularProgress } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef } from 'react';
import "../src/app.css"
import ReCAPTCHA from "react-google-recaptcha";
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertDialog } from './alertDialog';
import dayjs from 'dayjs';

function LoginForm({ set, callback }) {
  const [userid, setuserid] = useState(localStorage.getItem("loginedUserid") ? localStorage.getItem("loginedUserid") : "");
  const [password, setPassword] = useState('');
  const [showDialog, setShowDialog] = useState(false)
  const [showDialog2, setShowDialog2] = useState(false)

  const [recaptcha, setRecaptcha] = useState("")
  const [serverAnnouncement, setServerAnnouncement] = React.useState(
    { title: "null", body: null, type: "info", updateTime: "now" }
  )
  const submitButttonRef = useRef()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [isLogining, setIsLogining] = React.useState(false)

  const theme = (
    localStorage.getItem("theme") == "light" ? "light" :
      localStorage.getItem("theme") == "dark" ? "dark" :
        prefersDarkMode ? "dark" : "light"
  )

  const handleLogin = async () => {
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid, password, recaptcha }),
    })
      .then(res => res.json())
      .then(
        (res) => {
          if (res.ok) {
            //alert("登入成功")
            set(true)
            localStorage.setItem("loginedUserid", userid)
            callback(res)
            //window.location.reload()
          } else {
            alert(res.message)
            window.location.reload()
            // AlertDialog({ title: "登入失敗", message: res.message })
          }
        }
      )

  };

  function showDialogF() {
    setShowDialog(true)
  }
  React.useEffect(() => {
    document.title = "登入 - H210成績查詢系統"
    fetch(
      '/api/service/annoucement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
    ).then(res => res.json())
      .then(res => {
        setServerAnnouncement(res)
        console.log("serverAnnouncement updated")
      })
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 13 && submitButttonRef.current) {
        submitButttonRef.current.click()
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitButttonRef, userid, password])

  return (
    <>

      <Paper sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "column",
        flexWrap: "wrap",
        alignContent: "space-around",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: " blur(5px)",
        width: "fit-content",
        height: "fit-content",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}>
        <center>

          <div hidden={serverAnnouncement.title == "null" || serverAnnouncement.title == null}>
            <Alert severity={serverAnnouncement.type ? serverAnnouncement.type : "info"}
              action={<Button onClick={() => setShowDialog2(true)} size='small' color={serverAnnouncement.type ? serverAnnouncement.type : "info"}>更多</Button>}>
              {serverAnnouncement.title}
            </Alert></div>

          <h1 style={{ margin: 0 }}>H210</h1>
          <h2 style={{ marginTop: 0 }}>成績查詢系統</h2>
          <TextField type='text' value={userid} id="userid-input" label="帳號" variant="standard" onChange={(e) => setuserid(e.target.value)} />
          <p></p>
          <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} id="userpassword-input" label="密碼" variant="standard" />
          <p></p>
          <ReCAPTCHA
            sitekey="6LeoWJ0oAAAAAN9LRkvYIdq3uenaZ6xENqSPLr9_"
            onChange={e => { console.log(e); setRecaptcha(e) }}
            onExpired={e => { setRecaptcha("") }}
            theme={theme}
          />
          <p></p>
          <Button ref={submitButttonRef} variant="contained" onClick={handleLogin}
            disabled={recaptcha == "" || isLogining}>{isLogining ? <><CircularProgress size={"1rem"} /> 正在登入</> : "開始查詢"}</Button>
          &nbsp;
          <Button variant="outlined" sx={{ ml: 1, display: "none" }} onClick={() => showDialogF()}>帳密提示</Button>
        </center>
      </Paper >

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"帳密提示"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            〈學生〉<br />
            帳號為s加學號，密碼為身份證後四碼
            <p></p>
            〈家長〉
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={() => setShowDialog(false)} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={showDialog2}
        onClose={() => setShowDialog2(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {serverAnnouncement.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>{serverAnnouncement.body}</p>
            <Typography variant="button" display="block">最後更新於{serverAnnouncement.updateTime == "now" ? dayjs(new Date()).format("YYYY-MM-DD HH:mm") : serverAnnouncement.updateTime}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={() => setShowDialog2(false)} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginForm;
