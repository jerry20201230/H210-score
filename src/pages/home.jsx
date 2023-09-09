import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Paper } from '@mui/material'

export function Homepage({ user, data }) {

    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"首頁"} />
            <Box sx={{ p: 3 }}>
                <Paper></Paper>
            </Box>
        </>
    )
}