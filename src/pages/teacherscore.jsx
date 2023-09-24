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
import { InputForm } from '../inputBoxs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function TeacherScore({ data, user }) {
  const [students, setStudents] = React.useState([
    { username: "" }
  ])
  var idList = [0]
  const [auth, setAuth] = React.useState(true)
  const [scoreData, setScoreData] = React.useState([
    { id: 1, [UrlParam("q")]: "null" }
  ])
  const [tbody, setTbody] = React.useState(<>Loading</>)
  const newPasswordInputRef = React.useRef()
  const [newPass, setNewPass] = React.useState()
  const [dialogSubmitBtnText, setDialogSubmitBtnText] = React.useState(<>更新</>)

  const [accountValues, setaccountValues] = React.useState(Array(45));
  const [passwordValue, setPasswordValue] = React.useState(Array(45))

  const [scoreSetting, setScoreSetting] = React.useState([])


  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }


  const [open, setOpen] = React.useState(false);
  const [openingId, setOpeningId] = React.useState(
    { username: "", userpassword: "" }
  )

  const handleClickOpen = (n) => {
    setOpen(true);
    setOpeningId(n)
  };

  const handleClose = (n) => {

    setDialogSubmitBtnText(<><CircularProgress size="1rem" /> 更新中</>)
    if (n === "update") {
      fetch('/api/updatescore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ std: (openingId.id), password: (newPass) }),
      })
        .then(res => res.json())
        .then(
          (res) => {
            setDialogSubmitBtnText("更新完畢")
            setOpen(false)
            getAllStdPass()
            setNewPass("")
            setDialogSubmitBtnText("更新")

          }
        ).catch((e) => {
          getAllStdPass()
          setNewPass("")
          setDialogSubmitBtnText("更新失敗，請重試")
        })

    } else {
      setOpen(false)
      setDialogSubmitBtnText("更新")
    }
  };


  function getAllStdPass() {
    fetch("/api/getallstudentscorebyid", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: UrlParam("q")
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(".......0", res)
        setScoreData(res.data.result)
        fetch("/api/getallstudents", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

          }),
        })
          .then(res => res.json())
          .then(res => {
            var list = []
            for (let i = 0; i < res.data.result.length; i++) {
              if (res.data.result[i].userid.includes("s")) {

                var object = res.data.result[i]
                object.changeBtn = <Button variant="contained" onClick={() => handleClickOpen(res.data.result[i])}>編輯成績</Button>
                list.push(object)
              }
            }
            console.log(list)
            setStudents(list)
          })

      })

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
            setScoreSetting(res.data.result[i])
            console.log(res.data.result[i])
          }
        }
        if (!k) alert("找不到成績")
      })
  }

  React.useEffect(() => {
    getAllStdPass()
  }, [])

  React.useEffect(() => {
    console.log(students, scoreData, ".____.")
    if (students.length > 1 && scoreData.length > 1 && students.length == scoreData.length) {
      setTbody(
        <>
          <TableBody>
            {scoreData.map((row, i) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >

                <TableCell>{row.id}</TableCell>
                <TableCell>{students[i].username}</TableCell>
                <TableCell>{row[UrlParam("q")].split("%|%")[0] == "null" || row[UrlParam("q")].split("%|%")[0] == "undefined" ? "缺考" : row[UrlParam("q")].split("%|%")[0]}</TableCell>
                <TableCell>{row[UrlParam("q")].split("%|%")[1] == "null" || row[UrlParam("q")].split("%|%")[1] == "undefined" ? "(無資料)" : row[UrlParam("q")].split("%|%")[1]}</TableCell>
                <TableCell>{row.changeBtn}</TableCell>
              </TableRow>

            ))}
          </TableBody>

        </>
      )
    }
  }, [students, scoreData])



  return (
    <>

      <TopBar logined={true} data={data.data} user={user} title={"成績資料"} />
      <Box sx={{ p: 3 }}>
        <h1>{scoreSetting.scoreName}</h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>

                <TableCell>座號</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>成績</TableCell>
                <TableCell>備註</TableCell>
                <TableCell>動作</TableCell>
              </TableRow>
            </TableHead>
            {tbody}
          </Table>
        </TableContainer>
      </Box>

      <Button onClick={getAllStdPass}>重新整理</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"更新 " + (openingId.username ? openingId.username : "") + " 的成績資料"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            目前成績:{openingId.userpassword ? openingId.userpassword : "" || "???"}<br />
            <p></p>
            <TextField type='text' variant="standard" label="輸入新密碼" ref={newPasswordInputRef} value={newPass} onInput={(e) => setNewPass(e.target.value)} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={() => handleClose("update")}>
            {dialogSubmitBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}