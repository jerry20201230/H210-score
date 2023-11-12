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
import dayjs from 'dayjs';

export function ParentAccountMonitor({ data, user }) {
  function createData(time, action, status) {
    return { time, action, status };
  }


  const [countdown, setCountdown] = React.useState(15)
  const [times, setTimes] = React.useState(0)
  const [progress, setProgress] = React.useState(0)

  var rows = [
    createData(dayjs().format("YYYY/MM/DD HH:mm:ss"), "", "連線中")
  ];

  function getData() {
    fetch("/api/getparentaccountlogs", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then(res => res.json())
      .then(res => {

      })
  }



  React.useEffect(() => {

    if (times < 20) {
      if (countdown === 0) {
        getData()
        setCountdown(15)
      } else if (countdown > 0) {
        setProgress((15 - countdown) * (100 / 15))
      } else {

      }
    }
  }, [countdown]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };

  }, []);


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
                  key={row.time}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.status}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}