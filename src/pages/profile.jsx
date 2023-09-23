import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button, TextField } from '@mui/material';
import "../App.css"
import { red, yellow, green } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';

export function Profile({ data, user }) {


    function UrlParam(name) {
        var url = new URL(window.location.href),
            result = url.searchParams.get(name);
        return result
    }

    React.useEffect(() => {
        console.log(user, data)
    }, [])


    return (
        <>


            <TopBar logined={true} data={data.data} user={user} title={"個人資料"} />

            <Box sx={{ p: 3 }}>
                <h1>個人資料</h1>

                <Paper>
                    <div style={{ display: "flex" }}>
                        <FaceIcon />
                        <h2>{data.data.username}
                            &nbsp;
                            {
                                data.data.role === "std" ?
                                    <Chip label="學生" color="primary" />
                                    :
                                    data.data.role === "par" ?
                                        <Chip label="家長" color="secondary" />
                                        :
                                        <Chip label="老師" color="success" />
                            }</h2>
                        <h3>{data.data.userid}</h3>
                    </div>
                </Paper>
                <p></p>
                <Paper>
                    <h2>變更密碼</h2>
                    <TextField type='password' label="輸入原本密碼" />
                    <TextField type='password' label="輸入新密碼" />
                    <TextField type='password' label="再次輸入新密碼" />
                    <Button variant='contained'>送出</Button>
                </Paper>

            </Box>
        </>
    )
}