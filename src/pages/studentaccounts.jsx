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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function StudentAccounts({ data, user }) {
    const [students, setStudents] = React.useState([
        { username: "", userpassword: "" }
    ])
    const [password, setPassword] = React.useState('');
    const [auth, setAuth] = React.useState(false)

    const authBtnRef = React.useRef()
    const newPasswordInputRef = React.useRef()
    const [newPass, setNewPass] = React.useState()
    const [dialogSubmitBtnText, setDialogSubmitBtnText] = React.useState(<>更新</>)

    const [accountValues, setaccountValues] = React.useState(Array(45));
    const [passwordValue, setPasswordValue] = React.useState(Array(45))
    /*const handleInputChange = (index, value) => {
      console.log(index, value, "000151656464")
      var updatedValues = [...];
      updatedValues[index] = value;
      console.log(updatedValues[index])
      console.log(inputValues, updatedValues)
      (updatedValues);
    };*/
    const [open, setOpen] = React.useState(false);
    const [openingId, setOpeningId] = React.useState(0)

    const handleClickOpen = (n) => {
        setOpen(true);
        setOpeningId(n)
    };

    const handleClose = (n) => {
        console.log(newPass, openingId, "8878686464")
        setDialogSubmitBtnText(<><CircularProgress size="1rem" /> 更新中</>)
        if (n === "update") {
            fetch('/api/changepassword/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: (openingId + 1), password: (newPass) }),
            })
                .then(res => res.json())
                .then(
                    (res) => {
                        setDialogSubmitBtnText("更新完畢")
                        setOpen(false)
                        getAllStdPass()
                        setNewPass("")
                    }
                ).catch((e) => {
                    getAllStdPass()
                    setNewPass("")
                    setDialogSubmitBtnText("更新失敗，請重試")
                })

        } else {
            setOpen(false)
        }
    };

    const handleSubmit = () => {
        // 在這裡處理提交操作，您可以使用inputValues數組中的值
        console.log('輸入框的值：', passwordValue);
    };

    const editPass = (i, p) => {
        console.log(i, p)
        handleClickOpen(i - 1)
    }

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
                        setAuth(true)
                    } else {
                        alert("密碼錯誤!!\n你已經被自動登出，請重新登入")
                        window.location.reload()
                    }
                }
            )

    };

    function getAllStdPass() {
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
                        object.accountInput = res.data.result[i].userid
                        object.passwordInput = res.data.result[i].userpassword

                        object.changePasswordBtn = <Button variant='contained' onClick={() => { editPass(i) }}>編輯密碼</Button>

                        list.push(object)
                    }
                }
                setStudents(list)
                console.log(students, list)
            })

    }


    React.useEffect(() => {
        if (auth) {
            getAllStdPass()
        } else {

        }
    }, [auth])

    React.useEffect(() => {

        const handleKeyDown = (event) => {
            if (event.keyCode === 13 && authBtnRef.current && !auth) {
                authBtnRef.current.click()
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [authBtnRef])


    return (
        <>

            <Box sx={{
                width: "100%", height: "100%", position: "fixed", left: 0, top: 0, zIndex: 99999, display: (!auth ? "flex" : "none"), alignItems: "center", textAlign: "center", color: "#000", backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: " blur(5px)",
                flexDirection: "column", justifyContent: "center"
            }}>
                <h1>身分驗證</h1>
                <p>即將顯示所有學生的帳號密碼，因此，我們需要先驗證你的身分，確保你是 {data.data.username} 本人</p>
                <p>請輸入你的密碼，一旦輸入錯誤，將被強制登出</p>
                <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} id="userpassword-input" label="密碼" variant="standard" />
                <p>
                    <Button variant='outlined' onClick={() => { window.location.href = "/" }}>取消</Button>
                    &nbsp;
                    <Button variant='contained' onClick={handleLogin} ref={authBtnRef}>確定</Button>
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
                                <TableCell>動作</TableCell>
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
                                    <TableCell>{row.accountInput}</TableCell>
                                    <TableCell>{row.passwordInput}</TableCell>
                                    <TableCell>{row.changePasswordBtn}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>





            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"更新 " + (students[openingId].username ? students[openingId].username : "") + " 的密碼"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        目前密碼:{students[openingId].userpassword ? students[openingId].userpassword : "" || "???"}<br />
                        <p></p>
                        <TextField type='text' variant="standard" label="輸入新密碼" ref={newPasswordInputRef} value={newPass} onInput={(e) => setNewPass(e.target.value)} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={() => handleClose("update")}>
                        {dialogSubmitBtnText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}