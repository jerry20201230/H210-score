import * as React from 'react'
import TopBar from '../Topbar'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { red, yellow, orange, green } from '@mui/material/colors';
import "../App.css"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { DataGrid, zhTW } from '@mui/x-data-grid';

export function StdMore({ data, user, handleError }) {
  const [rows, setRows] = React.useState(null)
  const [score, setScore] = React.useState(null)

  const [countdown, setCountdown] = React.useState(30)
  const [refTimes, setRefTimes] = React.useState(0)

  const [finalRows, setFinalRows] = React.useState([])
  function delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }

  const currentTheme = (
    localStorage.getItem("theme") == "light" ? "light" :
      localStorage.getItem("theme") == "dark" ? "dark" :
        "light"
  )

  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  const [open3, setOpen3] = React.useState(false)

  const [confirmChecked, setConfirmChecked] = React.useState(false)

  const [dialogObj, setDialogObj] = React.useState({ scoreName: "NULL", featureName: "NULL", remainTimes: "NULL" })
  const handleClickOpen = () => {
    setConfirmChecked(false)
    setOpen(true);
  };

  const handleClose = (n) => {
    setOpen3(false);
    if (n) {
      // blockScore()
    }
  };

  const handleRowClick = (params) => {
    if (params.field == "scoreTitle" || params.field == "scoreid") {
      window.location.href = `/score/more/?q=${params.row.scoreid}`
    }
    else if (params.field == "temp_block") {
      console.log(params.row.temp_block.split(" "))
      setDialogObj({ scoreName: params.row.scoreTitle, featureName: "短暫維持家庭和睦", remainTimes: params.row.temp_block.split(" ")[2] })
      setOpen(true)
    }
    else if (params.field == "long_block") {

    }

  };

  const handleCellClick = (params) => {
    console.log(params)
  };

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
      headerName: '查詢次數',
      type: 'number',
      width: 130,
      editable: false,
    },
    {
      field: 'lastquery',
      headerName: '最後查詢時間',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: 'temp_block',
      headerName: '短暫維持家庭和睦',
      width: 230,
      type: 'text',
      describe: "學生專屬功能中 短暫維持家庭和睦 功能的狀態",
      editable: false,
    },
    {
      field: 'long_block',
      headerName: '關閉家長查詢權限',
      describe: "學生專屬功能中 關閉家長查詢權限 功能的狀態",
      type: 'text',
      width: 230,
      editable: false,
    }, {
      field: 'scoreid',
      headerName: '成績ID',
      type: 'text',
      width: 110,
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




  function FsetRows(rows) {
    setRows(rows)
    console.log(rows)
  }
  function FsetScore(score) {
    setScore(score)
    console.log(score)
  }

  async function fetchData() {

    await fetch("/api/getparentaccountctrl/all", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

      }),
    }).then(res => res.json())
      .then(async (res) => {
        FsetRows(res.data)
        await fetch("/api/getscoremap", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
          .then(res2 => res2.json())
          .then(res2 => { FsetScore(res2.data.result); setCountdown(30) })
          .catch((err) => setCountdown(30))
      })
      .catch((err) => setCountdown(30))

  }

  function processData() {
    var tempRows = [];
    for (let i = 0; i < score.length; i++) {
      try {
        let PACrow = rows[score[i].uid].split("%|%")
        let tempBlockTxt = ""
        let longBlockTxt = ""

        if (dayjs().isBefore(dayjs(PACrow[3]).add(8, "hours"))) {
          tempBlockTxt = `到 ${dayjs(PACrow[3]).add(8, "hours").format("HH:mm:ss")} 為止`
        } else {
          tempBlockTxt = "未開啟"
        }

        if (PACrow[6] == "1") {
          longBlockTxt = "開啟 | "
        } else {
          longBlockTxt = "關閉 | "
        }

        tempRows.push(
          { id: i + 1, scoreid: score[i].uid, scoreTitle: score[i].scoreName, scoreTitle: score[i].scoreName, querytimes: Number(PACrow[0]), lastquery: dayjs(PACrow[1]).add(8, "hours").format("MM/DD HH:mm:ss"), temp_block: tempBlockTxt + " | " + `還有 ${PACrow[2]} 次機會`, long_block: longBlockTxt + `還有 ${PACrow[5]} 次機會` },
        )
      } catch (error) {
        tempRows.push(
          { id: i + 1, scoreid: score[i].uid, scoreTitle: score[i].scoreName, scoreTitle: score[i].scoreName, querytimes: 0, lastquery: "目前無資料", temp_block: "目前無資料", long_block: "目前無資料" },
        )
      }

    }
    setFinalRows(tempRows)
  }



  React.useEffect(() => {
    if (rows && score) {
      // fetchData()
      processData()
    }
  }, [rows, score])


  React.useEffect(async () => {
    await fetchData()
    setCountdown(30)
    for (let j = 0; j < 10; j++) {
      setRefTimes(j + 1)
      for (let i = 0; i < 30; i++) {
        await delay(1)
        setCountdown(o => o - 1)
      }

      await fetchData()
      setCountdown(30)

    }
  }, [])

  return (
    <>
      <TopBar needCheckLogin={true} logined={true} data={data.data} user={user} title={"學生專屬功能"} />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5'>家長查詢狀態總表</Typography>
        <Alert severity="info">
          <AlertTitle>說明</AlertTitle>
          這個頁面顯示家長查詢每筆成績的狀態<br />
          每隔30秒會自動刷新一次，持續5分鐘<br />
          {refTimes == 10 && countdown == 30 ? <>自動刷新已經結束</> : <>已經刷新過{refTimes}次 | 將在{countdown}秒後刷新</>}

        </Alert>
        <p></p>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            sx={{
              // height: 600,
              width: '100%',
              '& .green': {
                backgroundColor: green[100],
                color: "#000"
              },
              '& .red': {
                backgroundColor: red[100],
                color: "#000"
              },
              '& .yellow': {
                backgroundColor: yellow[100],
                color: "#000"
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
              return params.value.includes("未開啟") || (params.value.includes("關閉") && params.field == "long_block") ? "yellow" : "green";
            }}
            pageSizeOptions={[10]}

            onCellClick={handleCellClick}
            localeText={zhTW.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Box>





      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`要啟用 ${dialogObj.featureName} 嗎?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>
              <h3>⟪理性使用，請勿引發家長懷疑⟫</h3>

              開啟之後<b>無法中途取消</b>
              <p></p>

              請再次確認以下資訊:<br />
              你今天還有{dialogObj.remainTimes}次機會<br />
              這筆成績是 {dialogObj.scoreName}
              <p></p>
              <FormControlLabel control={
                <Checkbox
                  checked={confirmChecked}
                  onChange={() => setConfirmChecked(!confirmChecked)}
                />
              } label="我已詳細閱讀並同意上述說明" />
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => handleClose(false)}>
            取消
          </Button>
          <Button variant="outlined" disabled={!confirmChecked} onClick={() => handleClose(true)}>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


