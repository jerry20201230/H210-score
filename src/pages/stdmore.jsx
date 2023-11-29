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
    { field: '編號', headerName: 'id', width: 90, editable: false, },
    {
      field: '成績名稱',
      headerName: 'scoreTitle',
      width: 150,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: false,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
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

  const rows = [
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

  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />
      <Box sx={{ p: 3 }}>
        <h1>學生專屬功能</h1>
        <Alert severity="info">
          <AlertTitle>說明</AlertTitle>
          這個頁面顯示每筆成績的查詢狀態<br />
        </Alert>
        <p></p>
        <Box sx={{ height: 400, width: '100%' }}>
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


