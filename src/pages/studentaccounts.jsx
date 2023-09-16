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

export function StudentAccounts({ data, user }) {
    const [students, setStudents] = React.useState([])
    const [password, setPassword] = useState('');

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

    const handleLogin = async () => {
        await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: (data.data.userid), password: password }),
        })
            .then(res => res.json())
            .then(
                (res) => {
                    if (res.ok) {

                    } else {
                        alert("帳號或密碼不正確!!\n你已經被自動登出，請重新登入")
                        window.location.reload()
                    }
                }
            )

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
                        object.scoreInput = <TextField value={inputValues[i]} onChange={(e) => handleGradeChange(i, e.target.value)} label="輸入成績" variant="standard" />
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

            <Box sx={{
                width: "100%", height: "100%", position: "fixed", left: 0, top: 0, zIndex: 99999, display: "flex", alignItems: "center", textAlign: "center", color: "#000", backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: " blur(5px)",
                flexDirection: "column", justifyContent: "center"
            }}>
                <h1>身分驗證</h1>
                <p>即將顯示所有學生的帳號密碼，因此，我們需要先驗證你的身分，確保你是 {data.data.username} 本人</p>
                <p>請輸入你的密碼，一旦輸入錯誤，將被強制登出</p>
                <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} id="userpassword-input" label="密碼" variant="standard" />
                <p>
                    <Button variant='outlined' onClick={() => { window.location.href = "/" }}>取消</Button>
                    &nbsp;
                    <Button variant='contained' onClick={handleLogin}>確定</Button>
                </p>
            </Box>


            <TopBar logined={true} data={data.data} user={user} title={"學生帳密"} />

            <Box sx={{ p: 3 }}>
                <h1>所有學生的帳號密碼</h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>座號</TableCell>
                                <TableCell>姓名</TableCell>
                                <TableCell>帳號</TableCell>
                                <TableCell>密碼</TableCell>
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

                <Button variant='contained' onClick={handleSubmit}>送出</Button>
            </Box>

        </>
    )
}