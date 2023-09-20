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

export function PushNewScore({ data, user }) {
  const [students, setStudents] = React.useState([])

  function createData(seatnum, name, scoreInput, summeryInput) {
    return { seatnum, name, scoreInput, summeryInput };
  }
  const [inputValues, setInputValues] = React.useState(Array(45));
  const [summeryValue, setSummeryValue] = React.useState(Array(45))
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
  const handleSubmit = () => {
    // 在這裡處理提交操作，您可以使用inputValues數組中的值
    console.log('輸入框的值：', inputValues, summeryValue);
    console.log(inputValues[10])
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
        <TextField label="成績標題" variant="standard" />
        <p></p>
        <Autocomplete
          disablePortal
          freeSolo
          options={["國文", "數學", "物理", "化學", "地理", "公民", "英文"]}
          renderInput={(params) => <TextField {...params} label="Movie" variant="standard" />}
        />
        <p></p>
        <TextField
          label="對全班的公告"
          multiline


          sx={{ width: "100%" }}
          rows={2}
          variant="standard"
        />
        <p></p>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>座號</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>成績</TableCell>
                <TableCell>備註</TableCell>
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

        <Button variant='contained' onClick={handleSubmit}>送出</Button>
      </Box>

    </>
  )
}