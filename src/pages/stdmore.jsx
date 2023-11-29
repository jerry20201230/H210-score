import * as React from 'react'
import TopBar from '../Topbar'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { red, yellow, orange, green } from '@mui/material/colors';
import "../App.css"

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
      width: 170,
      editable: false,
    },
    {
      field: 'querytimes',
      headerName: '家長查詢次數',
      type: 'text',
      width: 130,
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
      width: 230,
      type: 'text',

      editable: false,
    },
    {
      field: 'long_block',
      headerName: '家長查詢權限',
      type: 'text',
      width: 230,
      editable: false,
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',

    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];


  const [rows, setRows] = React.useState(null)
  const [score, setScore] = React.useState(null)

  const [finalRows, setFinalRows] = React.useState([])


  function FsetRows(rows) {
    setRows(rows)
    console.log(rows)
  }
  function FsetScore(score) {
    setScore(score)
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

  React.useEffect(() => {
    if (rows && score) {
      var tempRows = [];
      for (let i = 0; i < score.length; i++) {
        let PACrow = rows[score[i].uid].split("%|%")
        let tempBlockTxt = ""
        let longBlockTxt = ""

        if (dayjs().isBefore(dayjs(PACrow[3]).add(8, "hours"))) {
          tempBlockTxt = `到 ${dayjs(PACrow[3]).add(8, "hours").format("HH:mm:ss")} 為止`
        } else {
          tempBlockTxt = "未開啟"
        }

        if (PACrow[6] == "1") {
          longBlockTxt = "關閉 | "
        } else {
          longBlockTxt = "開啟 | "
        }

        tempRows.push(
          { id: i + 1, scoreTitle: score[i].scoreName, querytimes: PACrow[0], lastquery: dayjs(PACrow[1]).add(8, "hours").format("MM/DD HH:mm:ss"), temp_block: tempBlockTxt + " | " + `還有 ${PACrow[2]}次機會`, long_block: longBlockTxt + `還有 ${PACrow[5]}次機會` },
        )
      }
      setFinalRows(tempRows)
    }
  }, [rows, score])

  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5'>家長查詢狀態總表</Typography>
        <Alert severity="info">
          <AlertTitle>說明</AlertTitle>
          這個頁面顯示家長查詢每筆成績的狀態<br />
          系統<b>不會</b>自動刷新
        </Alert>
        <p></p>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            sx={{
              height: 300,
              width: '100%',
              '& .green': {
                backgroundColor: green[100],

              },
              '& .red': {
                backgroundColor: red[100],

              },
              '& .yellow': {
                backgroundColor: yellow[100],

              },
            }}
            rows={finalRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            getCellClassName={(params) => {
              if (!params.field.includes("block") || params.value == null) {
                return '';
              }
              return params.value.includes("未開啟") || (params.value.includes("開啟") && params.field == "long_block") ? "yellow" : "green";
            }}
            pageSizeOptions={[10]}
            localeText={zhTW.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Box>
    </>
  );
}


