import './App.css';
import LoginForm from './LoginForm';
import React, { useState } from 'react';
import { Homepage } from './pages/home';
import { Route, Routes } from 'react-router-dom'
import { Score } from './pages/score';
import { TeacherHomePage } from './pages/teacherHome';
import { AllScoreSheet } from './pages/allscores';
import { PushNewScore } from './pages/pushNewScore';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem(""));
  const [userData, setUserData] = useState([])
  function handleCallBack(data) {
    console.log(data)
    setUserData(data)
  }

  React.useEffect(() => {
    fetch("/api/checklogin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(res => { setIsLoggedIn(res.logined) })
  }, [])

  return (
    isLoggedIn ?
      <Routes>
        {userData.data.role === "teacher" ?
          <Route path='/' element=<TeacherHomePage data={userData} /> ></Route>
          : <Route path='/' element=<Homepage data={userData} /> ></Route>
        }

        <Route path='/score' element=<Score data={userData} /> ></Route>

        {userData.data.role === "teacher" ?
          <>
            <Route path='/backend' element=<TeacherHomePage data={userData} />></Route>
            <Route path='/backend/score' element=<AllScoreSheet data={userData} />></Route>
            <Route path='/backend/score/push' element=<PushNewScore data={userData} />></Route>

          </>
          : <></>}
        <Route path='*' element=<h1>ERROR 404</h1>></Route>

      </Routes>
      :
      <Routes>
        <Route path='*' element=<LoginForm set={setIsLoggedIn} callback={handleCallBack} /> ></Route>
      </Routes>

  );
}

export default App;
