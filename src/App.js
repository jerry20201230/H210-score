import './App.css';
import LoginForm from './LoginForm';
import React, { useState } from 'react';
import { Homepage } from './pages/home';
import { Route, Routes } from 'react-router-dom'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem(""));
  const [userData, setUserData] = useState([])
  function handleCallBack(data) {
    console.log(data)
    setUserData(data)
  }
  return (
    isLoggedIn ?
      <Routes>
        <Route path='*' element=<Homepage data={userData} /> ></Route>
      </Routes>
      :
      <Routes>
        <Route path='*' element=<LoginForm set={setIsLoggedIn} callback={handleCallBack} /> ></Route>
      </Routes>

  );
}

export default App;
