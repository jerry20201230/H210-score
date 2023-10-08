import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { CheckLogin } from './checklogin';

export default function TopBar({ logined, title, data }) {
  const [auth, setAuth] = React.useState(logined);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    if (e === "logout") {
      fetch("/api/logout", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(res => res.json())
        .then((res) => {
          if (res.ok) {
            window.location.href = "/"
          } else {
            alert("登出失敗，請再試一次")
          }
        })
    } else if (e === "profile") {
      window.location.href = "/profile"
    }
  };

  React.useEffect(() => {
    document.title = title + " - H210成績查詢系統"
  }, [title])

  return (
    <>
      <CheckLogin />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              onClick={() => window.location.href = "/"}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {auth && (
              <div>
                <Button
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle /> {data.username}

                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >

                  <MenuItem onClick={() => { handleClose("profile") }}>個人資料</MenuItem>
                  <MenuItem onClick={() => { handleClose("setting") }}>系統設定</MenuItem>
                  <MenuItem onClick={() => { handleClose("logout") }}>登出</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
    </>
  );
}