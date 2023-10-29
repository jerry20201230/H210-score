import * as React from 'react'
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import TopBar from '../Topbar'

export default function Routing({ data, user }) {
    function UrlParam(name) {
        var url = new URL(window.location.href),
            result = url.searchParams.get(name);
        return result
    }
    var theLoc = (window.location.pathname.replace("/route/to", "") + window.location.search)
    const linkRef = React.useRef(null)
    const [message, setMessage] = React.useState(<></>)
    const [title, setTitle] = React.useState("正在重新導向")
    const location = useLocation();
    React.useEffect(() => {
        if (linkRef.current) {
            linkRef.current.click()
        }
        console.log(location)
    }, [linkRef])
    return (
        <>
            <TopBar logined={true} data={data.data} user={user} title={"正在重新導向..."} />

            <Box sx={{ p: 3, overflow: "hidden" }}>
                正在將你重新導向到:
                <Typography noWrap title={location.state ? location.state.name : theLoc}>{location.state ? location.state.name : theLoc}</Typography>
                <p></p>
                如果沒有自動導向，請<Link to={theLoc} ref={linkRef} replace={true}>按這裡</Link><br />
                再按一次返回可以回上一頁
            </Box>
        </>
    )
}