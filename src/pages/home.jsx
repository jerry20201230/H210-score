import * as React from 'react'
import TopBar from '../Topbar'
import { Box, Paper } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Link } from 'react-router-dom';


export function Homepage({ user, data }) {

  const [scorelist, setScoreList] = React.useState([
    { title: "", id: "" }
  ])

  React.useEffect(() => {
    fetch("/api/getscore", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json)
      .then(res => {
        console.log(res)
        //  setScoreList(res.data)
      })
  }, [])

  return (
    <>
      <TopBar logined={true} data={data.data} user={user} title={"首頁"} />
      <Box sx={{ p: 3 }}>



        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <nav aria-label="main mailbox folders">
            <List>{scorelist.map((d, i) => {
              return (

                <ListItem disablePadding key={d.id}>
                  <ListItemButton component={Link} to={`/score/?q=${data.id}`}>
                    <ListItemText primary={data.title} />
                  </ListItemButton>
                </ListItem>

              )
            })}</List>
          </nav>
        </Box>


      </Box>
    </>
  )
}