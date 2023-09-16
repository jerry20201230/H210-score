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
import { Link } from 'react-router-dom';
import { InputForm } from '../inputBoxs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

export function PushNewScore({ data, user }) {
  const [students, setStudents] = React.useState([])

  function createData(seatnum, name, scoreInput, summeryInput) {
    return { seatnum, name, scoreInput, summeryInput };
  }
  const [inputValues, setInputValues] = React.useState(Array(45).fill(''));

  const handleInputChange = (index, value) => {
    console.log(index, value, "000151656464")
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    console.log(updatedValues[index])
    console.log(inputValues)
    setInputValues(updatedValues);
  };

  const handleSubmit = () => {
    // 在這裡處理提交操作，您可以使用inputValues數組中的值
    console.log('輸入框的值：', inputValues);
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
            object.scoreInput = <TextField value={inputValues[i]} onChange={(e) => handleInputChange(i, e.target.value)} label="輸入成績" variant="standard" />
            object.summeryInput = <TextField value={inputValues[i]} onChange={(e) => handleInputChange(i, e.target.value)} label="輸入備註" variant="standard" />

            list.push(object)
          }
        }
        setStudents(list)
      })
  }, [])


  return (
    <>
      <TopBar logined={true} data={data.data} user={user} title={"新增成績"} />

      <Box sx={{ p: 3 }}>
        <h1>輸入新的成績資料</h1>
        <TextField
          label="對全班的公告"
          multiline
          rows={3}
          variant="standard"
        />

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
      </Box>

    </>
  )
}