import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Button } from '@mui/material';
import "../App.css"

export function ParentAccountMonitor({ data, user }) {
    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"學生專屬功能"} />

            <Box sx={{ p: 3 }}>
                <h1>功能開發中，敬請期待!</h1>
            </Box>
        </>
    )
}