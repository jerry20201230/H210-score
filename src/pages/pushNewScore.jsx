import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button, Alert } from '@mui/material';
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
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SelectSubject from '../selectSubject';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


export function PushNewScore({ data, user }) {

  const [inputValues, setInputValues] = React.useState(Array(46));
  const [summeryValue, setSummeryValue] = React.useState(Array(46));

  const [gradeTitle, setGradeTitle] = React.useState()
  const [gradeSubject, setGradeSubject] = React.useState()
  const [annousment, setAnnousment] = React.useState()


  const [students, setStudents] = React.useState([])
  const [open, setOpen] = React.useState(false);

  function handleClose() {
    setOpen(false)
  }


  const [open2, setOpen2] = React.useState(false);

  function handleClose2(t) {
    setOpen2(false)

    if (t) {
      var localData = localScore("get")
      setAnnousment(localData.annousment ? localData.annousment : "")
      setGradeSubject(localData.gradeSubject)
      setGradeTitle(localData.gradeTitle)
      setInputValues(localData.inputValues)
      setSummeryValue(localData.summeryValue)
    }
  }



  function localScore(type) {
    if (type === "get") {
      return JSON.parse(localStorage.getItem("localScore"))
    }
    else if (type === "put") {

      localStorage.setItem("localScore", JSON.stringify(
        gradeTitle, gradeSubject, annousment, inputValues, summeryValue
      ))

      return true
    }
    else if (type === "delete") {
      localStorage.setItem("localScore", "null")
    }
  }

  function handleChange(input, value) {
    if (input === "gradeTitle") {
      setGradeTitle(value)
      localScore("put")

    }
    else if (input === "gradeSubject") {
      setGradeSubject(value)
      localScore("put")

    }
    else if (input === "annousment") {
      setAnnousment(value)
      localScore("put")

    }
  }
  /*const handleInputChange = (index, value) => {
    console.log(index, value, "000151656464")
    var updatedValues = [...];
    updatedValues[index] = value;
    console.log(updatedValues[index])
    console.log(inputValues, updatedValues)
    (updatedValues);
  };*/
  const handleGradeChange = (index, newValue) => {
    const newGrades = inputValues;
    newGrades[index] = newValue;
    setInputValues(newGrades);
    localScore("put")
  };
  const handleSummeryChange = (index, newValue) => {
    const newSummery = summeryValue;
    newSummery[index] = newValue;
    setSummeryValue(newSummery);
    localScore("put")
  };
  const handleSubmit = (m) => {
    setOpen(true)
    console.log({
      method: m,
      score: {
        title: gradeTitle,
        subject: gradeSubject,
        annousment: annousment,
        scoreData: inputValues,
        summeryData: summeryValue,
      }

    })

    fetch("/api/uploadnewscore", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: m,
        score: {
          title: gradeTitle,
          subject: gradeSubject,
          annousment: annousment,
          scoreData: inputValues,
          summeryData: summeryValue,
        }

      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          localScore("delete")
          setOpen(false)
          window.location.href = "/"

        }
        else {
          alert("發生錯誤，請刷新網站!!")
        }

      })
      .catch(() => {
        alert("發生錯誤")
      })
  };



  React.useEffect(() => {
    // alert("系統維護中，暫時無法輸入新成績")
    // window.location.href = "/"
    fetch("/api/getallstudents", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          console.log(".......0", res)
          var list = []
          for (let i = 0; i < res.data.result.length; i++) {
            if (res.data.result[i].userid.includes("s")) {
              var object = res.data.result[i]
              object.scoreInput = <TextField type='number' min="0" max="100" value={inputValues[i]} onChange={(e) => handleGradeChange(i, e.target.value)} label="輸入成績" variant="standard" />
              object.summeryInput = <TextField value={summeryValue[i]} onChange={(e) => handleSummeryChange(i, e.target.value)} label="輸入備註" variant="standard" />

              console.log(object, i, "nioh", inputValues[i])
              list.push(object)
            }
          }
          setStudents(list)

          if (localScore("get") !== null) {
            setOpen2(true)
          }

        } else {
          alert("發生錯誤，請刷新網站!!")
        }

      })
  }, [])


  return (
    <>
      <TopBar logined={true} data={data.data} user={user} title={"新增成績"} />
      <h1 style={{ color: "red" }}>系統測試中，建議先不要輸入新成績</h1>

      <div>
        <Box sx={{ p: 3 }}>
          <h1>輸入新的成績資料</h1>
          <p>
            輸入每位同學的成績<br />
            若該學生缺考，請將成績欄位留空即可
          </p>
          <TextField label="成績標題" variant="standard"
            value={gradeTitle}
            sx={{ width: "100%" }}
            onInput={(e) => handleChange("gradeTitle", e.target.value)}

          />
          <p></p>

          <SelectSubject onChangeFunc={handleChange} params={"gradeSubject"}
          />
          <MobileView>行動裝置目前只能選擇現有的標籤</MobileView>
          <Alert severity="error">為避免系統錯誤，請至少選擇1個標籤</Alert>
          <p></p>
          <TextField
            label="對全班的公告"
            multiline
            sx={{ width: "100%" }}
            rows={2}
            variant="standard"
            value={annousment}
            onInput={(e) => setAnnousment(e.target.value)}

          />
          <p></p>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>座號</TableCell>
                  <TableCell>姓名</TableCell>
                  <TableCell>成績</TableCell>
                  <TableCell>私人留言(僅該學生與家長可查看)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((row, i) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.scoreInput}</TableCell>
                    <TableCell>{row.summeryInput}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <p></p>

          <Button variant='contained' onClick={() => handleSubmit("save")}>送出</Button>
        </Box>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"正在寫入資料"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            正在將 {gradeTitle} 的資料寫入資料庫，請稍候...<br />
            完成後，頁面將自動重整
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
        </DialogActions>
      </Dialog>





      <Dialog
        open={open2}
        onClose={() => handleClose2(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"是否要復原未送出的資料?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            上次編輯的成績 {localScore("get") == null ? "" : localScore("get").gradeTitle}有未送出的資料，是否要復原這些資料，繼續編輯?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose2(false)}>取消</Button>
          <Button onClick={() => handleClose2(true)} variant="contained">確定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}