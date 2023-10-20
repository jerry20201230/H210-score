const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());
app.use(express.static('./build'));
//const serverless = require('serverless-http');
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
const mysql = require('mysql2');
var sql_Connect = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,

  // 無可用連線時是否等待pool連線釋放(預設為true)
  waitForConnections: true,
  // 連線池可建立的總連線數上限(預設最多為10個連線數)
  connectionLimit: 15
});

// app.use(express.json());
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './build' });
})


app.post('/api/login', async (req, res) => {
  const { userid, password, recaptcha } = req.body;
  const secretKey = process.env.recaptcha
  await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`
  ).then(gres => gres.json())
    .then(googleRes => {
      if (googleRes.success) {
        sql_Connect.getConnection(function (err, connection) {
          connection.query('SELECT * FROM userData WHERE userid = ? AND userpassword = ?', [userid, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
              req.session.loggedin = true;
              req.session.username = results[0].username;
              req.session.userid = results[0].userid
              req.session.role = results[0].role
              res.send(JSON.stringify({ message: '登入成功', data: { userid: results[0].userid, username: results[0].username, role: results[0].role }, ok: true }));
            } else {
              req.session.destroy()
              res.status(401).json({ message: '帳號或密碼錯誤\n如果持續無法登入，請聯絡老師重設密碼', ok: false, code: 401 });
            }
            res.end();
            connection.release();
          })
        })
      } else {
        res.status(403).json({ message: 'recaptcha驗證失敗，請重新驗證', ok: false, code: 401 });
      }
    })
});

app.post("/api/getscore", (req, res) => {

  if (req.session.role) {
    sql_Connect.getConnection(function (err, connection) {
      connection.query('SELECT * FROM scoreData WHERE stdId = ? ', [req.session.userid.replace("p", "s")], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {

          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
        connection.release();
      })
    })
  } else {
    res.status(403).json({ message: 'Invalid credentials', ok: false, code: 403 });
    res.end();
  }


})

app.post("/api/getallstudents", (req, res) => {
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query('SELECT id,username,userid,userpassword FROM userData', function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
        connection.release();
      })
    })
  } else {
    res.status(403).json({ message: 'Invalid credentials', ok: false, code: 403 });
    res.end();
  }
})


app.post("/api/getallstudentsforscore", (req, res) => {
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`SELECT id,username,userid,role FROM userData WHERE role = 'std' `, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
        connection.release();
      })
    })
  } else {
    res.status(403).json({ message: 'Invalid credentials', ok: false, code: 403 });
    res.end();
  }
})

app.post("/api/getallstudentscorebyid", (req, res) => {
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`SELECT id,stdId,${req.body.uid} FROM scoreData`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          console.log(`[SQL RESULT]\n/api/getallstudentscorebyid\nRESULT:\n${results}\nUser:${req.session.username}`)
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
        connection.release();
      })
    })
  } else {
    res.status(403).json({ message: 'Invalid credentials', code: 403, ok: false });
    res.end();
  }
})

app.post("/api/changepassword/student", (req, res) => {
  console.log(`[HTTP POST]\n/api/changepassword/student\n${req.body}\nUser:${req.session.username}`)
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE userData
            SET userpassword = "${req.body.password}"
            WHERE id = ${req.body.id}
            `, function (error, results, fields) {
        if (error) throw error;

        console.log(`[SQL RESULT]\n/api/changepassword/student\nRESULT:\n${results}\nUser:${req.session.username}`)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();

        connection.release();

      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})




app.post("/api/updatescore", (req, res) => {
  console.log(`[HTTP POST]\n/api/updatescore\n${req.body}\nUser:${req.session.username}`)

  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE scoreData
            SET ${req.body.scoreid} = "${req.body.scoreData}"
            WHERE id = ${req.body.id}
            `, function (error, results, fields) {
        if (error) throw error;

        console.log(`[SQL RESULT]\n/api/updatescore\nRESULT:\n${results}\nUser:${req.session.username}`)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();

        connection.release();

      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})




app.post("/api/updatescoresetting", (req, res) => {
  console.log(`[HTTP POST]\n/api/updatescoresetting\n${req.body}\nUser:${req.session.username}`)

  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE scoreUid
            SET scoreName = "${req.body.title}", subject = "${req.body.tags}", summery = "${req.body.annousment}"
            WHERE uid = "${req.body.scoreid}"
            `, function (error, results, fields) {
        if (error) throw error;

        console.log(`[SQL RESULT]\n/api/updatescoresetting\nRESULT:\n${results}\nUser:${req.session.username}`)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();

        connection.release();

      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})

app.post("/api/deletescore", (req, res) => {
  console.log(`[HTTP POST]\n/api/deletescore\n${req.body}\nUser:${req.session.username}`)
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            ALTER TABLE scoreData
            DROP COLUMN ${req.body.scoreid}
            `, function (error, results, fields) {
        if (error) throw error;


        console.log(`[SQL RESULT]\n/api/deletescore\nRESULT:\n${results}\nUser:${req.session.username}`)


        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
            DELETE FROM scoreUid
            WHERE uid = "${req.body.scoreid}"
            `, function (error2, results2, fields) {
            if (error2) throw error2;

            console.log(`[SQL RESULT]\n/api/deletescore\nRESULT:\n${results2}\nUser:${req.session.username}`)

            res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

            res.end();

            connection2.release();

          })
        })

        connection.release();

      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})



app.post("/api/uploadnewscore", (req, res) => {
  if (req.session.role === "teacher") {
    const theUUID = uuidv4().slice(0, 7)
    //create uuid
    //add new column
    //put all data

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            INSERT INTO scoreUid (uid,scoreName,scoresetuid,subject,summery,publish)
            VALUES("${theUUID}","${req.body.score.title}","${theUUID}","${req.body.score.subject}","${req.body.score.annousment}",${req.body.method === "publish"})
            `, function (error, results, fields) {
        if (error) throw error;

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
                    ALTER TABLE scoreData
                    ADD COLUMN ${theUUID} TEXT
                    `, function (error, results, fields) {
            if (error) throw error;
            req.body.score.scoreData.forEach((score, i) => {


              console.log("[SQL DATA WRITING]", theUUID, " ", i + 1, " STILL PROCESSING")
              sql_Connect.getConnection(function (err, connection3) {

                var index = i

                connection3.query(`
                                UPDATE scoreData
                                SET ${theUUID} = "${req.body.score.scoreData[index] !== null && req.body.score.scoreData[index] ? req.body.score.scoreData[index] : null}%|%${req.body.score.summeryData[index] !== null && req.body.score.summeryData[index] ? req.body.score.summeryData[index] : null}"
                                WHERE id = ${index};
                                `, function (error, results, fields) {
                  if (error) throw error;
                  console.log("SQL DATA WRITING : ", theUUID, " ", index, " COMPLETE [SUCCESS]")
                  connection3.release();
                })
              })
            })
            connection2.release();
            res.status(200).json({ message: 'ok', ok: true, uuid: theUUID });
          })
        })
        connection.release();
      })
    })

  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})

app.post("/api/getscorebyid", (req, res) => {
  if (req.session.role) {
    sql_Connect.getConnection(function (err, connection) {
      connection.query('SELECT * FROM scoreData WHERE stdId = ? ', [req.session.userid.replace("p", "s")], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {

          //繼續查最高/最低/平均
          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`SELECT ${req.body.id.replace("p", "s")} FROM scoreData`, function (error2, results2, fields2) {
              if (error2) {
                res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
              };
              if (results2.length > 0) {
                var hi = 0, lo = 0, avg = 0, tot = 0, scoreList = []

                for (i = 0; i < results2.length; i++) {
                  if (results2[i][req.body.id].split("%|%")[0] !== 'null' && results2[i][req.body.id].split("%|%")[0] !== 'undefined') {
                    tot += Number(results2[i][req.body.id].split("%|%")[0])
                    scoreList.push(Number(results2[i][req.body.id].split("%|%")[0]))
                  }
                }
                hi = Math.max(...scoreList)
                lo = Math.min(...scoreList)

                avg = (tot / scoreList.length).toFixed(2)

                console.log(`[SCORE COUNTING] ${scoreList}\nUser:${req.session.userid}`)
                res.send(JSON.stringify({ message: 'Login successful', data: { hi: hi, lo: lo, avg: avg, your: results[0][req.body.id].split("%|%")[0], privateMsg: results[0][req.body.id].split("%|%")[1] }, ok: true }));
              } else {
                res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
              }

              res.end();
              connection2.release();
            })
          })

          //    console.log(results)
          //    res.send(JSON.stringify({ message: 'Login successful', data: { result: {yourScore:results[i][req.id],} }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        ////     res.end();
        connection.release();
      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }

})

app.post("/api/getscoremap", (req, res) => {
  sql_Connect.getConnection(function (err, connection) {
    connection.query('SELECT * FROM scoreUid', function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {

        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
      } else {
        res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
      }

      res.end();
      connection.release();
    })
  })
})

app.post("/api/changepass", (req, res) => {
  console.log("[CHANGE PASSWORD] \n-FROM: ", req.body, "\n -SESSION: ", req.session)
  if (req.session.userid === req.body.userid) {
    //要再檢查一遍舊密碼

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
    SELECT * FROM userData
    WHERE userid = "${req.body.userid}"
    `, function (error, results, fields) {
        if (error) throw error;
        console.log(`[SQL RESULT]\n/api/changepass\nRESULT:\n${results}\nUser:${req.session.username}`)

        if (results[0].userpassword === req.body.oldpass) {


          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
          UPDATE userData
          SET userpassword = "${req.body.newpass}"
          WHERE userid = "${req.body.userid}"
          `, function (error, results2, fields) {
              if (error) throw error;


              res.send(JSON.stringify({ message: 'Login successful', data: { result: results2 }, ok: true }));


              res.end();
              connection2.release();
            })
          })

        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        connection.release();
      })
    })




    req.session.destroy()
  } else {
    res.status(403).json({ code: 403, message: 'error 403', ok: false });
    res.end();

  }

})



app.post("/api/checklogin", (req, res) => {
  console.log(`[HTTP POST]\n/api/checklogin\n${req.body}\nUser:${req.session.username}`)

  res.send(JSON.stringify(
    {
      logined: req.session.loggedin,
      data: {
        data: {
          userid: req.session.userid,
          username: req.session.username,
          role: req.session.role
        }
      }
    }))
})

app.post("/api/logout", (req, res) => {
  console.log(`[USER LOGOUT]\n${req.body}\nUser:${req.session.username}`)

  req.session.destroy()
  res.send(JSON.stringify({ message: 'logout successful', ok: true }))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//module.exports.handler = serverless(app);