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

            </Box>
        </>
    )
}