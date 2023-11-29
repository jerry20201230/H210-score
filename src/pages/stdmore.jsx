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
import { DataGrid, zhTW } from '@mui/x-data-grid';

export function StdMore({ data, user, handleError }) {
  function createData(time, action, status) {
    return { time, action, status };
  }



  const columns = [
    { field: 'id', headerName: '編號', width: 90, editable: false, },
    {
      field: 'scoreTitle',
      headerName: '成績名稱',
      width: 150,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: '家長查詢次數',
      width: 170,
      editable: false,
    },
    {
      field: 'lastquery',
      headerName: '家長最後查詢時間',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: 'temp_block',
      headerName: '短暫維持家庭和睦',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: 'long_block',
      headerName: '家長查詢權限',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: 'fullName',
      headerName: 'Full name',

      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  var temprows = [
    { id: 1, scoreTitle: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, scoreTitle: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, scoreTitle: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, scoreTitle: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, scoreTitle: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, scoreTitle: 'Melisandre', firstName: null, age: 150 },
    { id: 7, scoreTitle: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, scoreTitle: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, scoreTitle: 'Roxie', firstName: 'Harvey', age: 65 },
  ];


  const [rows, setRows] = React.useState(temprows)
  const [score, setScore] = React.useState([])


  function FsetRows(rows) {
    console.log(rows)
  }

  function FsetScore(score) {
    console.log(score)
  }


  React.useEffect(() => {
    fetch("/api/getparentaccountctrl/all", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

      }),
    }).then(res => res.json())
      .then((res) => FsetRows(res.data))

    fetch("/api/getscoremap", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res2 => res2.json())
      .then(res2 => FsetScore(res2.data.result))
  }, [])

  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />
      <Box sx={{ p: 3 }}>
        <h1>學生專屬功能</h1>
        <Alert severity="info">
          <AlertTitle>說明</AlertTitle>
          這個頁面顯示家長查詢每筆成績的狀態<br />
        </Alert>
        <p></p>
        <Box sx={{ height: 800, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            localeText={zhTW.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Box>
    </>
  );
}


