import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';



function LoginForm({ set, callback }) {
  const [userid, setuserid] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid, password }),
    })
      .then(res => res.json())
      .then(
        (res) => {
          if (res.ok) {
            //alert("登入成功")
            set(true)
            callback(res)
          } else {
            alert("帳號或密碼不正確!!")
          }
        }
      )

  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "column",
      flexWrap: "wrap",
      alignContent: "space-around"
    }}>
      <center>
        <h1 style={{ margin: 0 }}>H210</h1>
        <h2 style={{ margin: 0 }}>成績查詢系統</h2>
        <TextField type='text' value={userid} id="userid-input" label="帳號" variant="standard" onChange={(e) => setuserid(e.target.value)} />
        <p></p>
        <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} id="userpassword-input" label="密碼" variant="standard" />
        <p></p>
        <Button variant="contained" onClick={handleLogin}>開始查詢</Button>
      </center>
    </div>
  );
}

export default LoginForm;
