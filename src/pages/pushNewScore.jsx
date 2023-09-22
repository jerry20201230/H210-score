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
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function PushNewScore({ data, user }) {
  const [students, setStudents] = React.useState([])
  const [open, setOpen] = React.useState(false);

  function handleClose() {
    setOpen(false)
  }

  const [inputValues, setInputValues] = React.useState(Array(45));
  const [summeryValue, setSummeryValue] = React.useState(Array(45))

  const [gradeTitle, setGradeTitle] = React.useState()
  const [gradeSubject, setGradeSubject] = React.useState()
  const [annousment, setAnnousment] = React.useState()

  function handleChange(input, value) {
    if (input === "gradeTitle") {
      setGradeTitle(value)
    }
    else if (input === "gradeSubject") {
      setGradeSubject(value)
    }
    else if (input === "annousment") {
      setAnnousment(value)
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
  };
  const handleSummeryChange = (index, newValue) => {
    const newSummery = summeryValue;
    newSummery[index] = newValue;
    setSummeryValue(newSummery);
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
    console.log('輸入框的值：', inputValues, summeryValue);
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
        setOpen(false)
        window.location.href = "/backend/score/search"
      })
      .catch(() => {
        alert("發生錯誤")
      })
  };



  React.useEffect(() => {
    fetch("/api/getallstudents", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(res => {
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
        console.log(students, list)
      })
  }, [])


  return (
    <>
      <TopBar logined={true} data={data.data} user={user} title={"新增成績"} />

      <Box sx={{ p: 3 }}>
        <h1>輸入新的成績資料</h1>
        <p>
          輸入每位同學的成績，然後儲存或發布
        </p>
        <TextField label="成績標題" variant="standard"
          value={gradeTitle}
          onInput={(e) => handleChange("gradeTitle", e.target.value)}
        />
        <p></p>
        <Autocomplete
          value={gradeSubject}
          onChange={(event, newValue) => {
            handleChange(newValue);
          }}
          disablePortal
          freeSolo
          options={["國文", "數學", "物理", "化學", "地理", "公民", "英文"]}
          renderInput={(params) => <TextField {...params} label="科目" variant="standard" />}
        />
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
        <p>
          儲存:學生與家長暫時無法查到這筆成績<br />
          發布:學生與家長可立即查到這筆成績
        </p>

        <Button variant='contained' onClick={() => handleSubmit("save")}>儲存</Button>
        &nbsp;
        <Button variant='contained' onClick={() => handleSubmit("publish")}>直接發布</Button>
      </Box>

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
    </>
  )
}