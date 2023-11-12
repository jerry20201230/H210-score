import * as React from 'react'
import TopBar from '../Topbar'
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import "../App.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function ParentAccountMonitor({ data, user }) {
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />

      <Box sx={{ p: 3 }}>
        <h1>開發進行中!</h1>
        <Alert severity="info">
          <AlertTitle>說明</AlertTitle>
          這個頁面顯示家長帳號的活動狀態<br />
          資料將持續自動更新5分鐘<br />
          <b>系統只會記錄最後一筆家長帳號的活動</b>
        </Alert>
        <p></p>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>時間</TableCell>
                <TableCell>家長操作</TableCell>
                <TableCell>操作狀態</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}