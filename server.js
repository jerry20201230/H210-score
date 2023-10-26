const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')

var cron = require('node-cron');


app.use(bodyParser.json());
app.use(express.static('./build'));
app.set('trust proxy', true)
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
  var passlen = ""
  for (i = 0; i < password.length; i++) {
    passlen = passlen + "●"
  }
  console.log(`[USER TRYING LOGIN] IP:${req.ip} User:${userid} Pass:${passlen}`)

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
              console.log(`[USER LOGIN (SUCCESS)] IP:${req.ip} User:${req.session.username}`)
              res.send(JSON.stringify({ message: '登入成功', data: { userid: results[0].userid, username: results[0].username, role: results[0].role }, ok: true }));
            } else {
              req.session.destroy()
              console.log(`[USER LOGIN (FAILED) ] IP:${req.ip} reason:incorrect password or id`)
              res.status(401).json({ message: '帳號或密碼錯誤\n如果持續無法登入，請聯絡老師重設密碼', ok: false, code: 401 });
            }
            res.end();
            connection.release();
          })
        })
      } else {
        console.log(`[USER LOGIN (FAILED) ] IP:${req.ip} reason:recaptcha verify error`)
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
      connection.query(`SELECT id,stdId, ${req.body.uid} FROM scoreData`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          console.log(`[SQL RESULT] /api/getallstudentscorebyid\nUser:${req.session.username} \nResult:`)
          console.log(results)
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
  // console.log(`[HTTP POST] /api/changepassword/student User:${req.session.username}`)
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE userData
            SET userpassword = ?
            WHERE id = ?
            `, [req.body.password, req.body.id], function (error, results, fields) {
        if (error) throw error;

        // console.log(`[SQL RESULT] /api/changepassword/student\nUser:${req.session.username}\n`)
        console.log(results)
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
  console.log(`[HTTP POST] /api/updatescore\nUser:${req.session.username}`)

  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE scoreData
            SET ${req.body.scoreid} = "${req.body.scoreData}"
            WHERE id = ${req.body.id}
            `, function (error, results, fields) {
        if (error) throw error;

        console.log(`[SQL RESULT] /api/updatescore\nRESULT:\nUser:${req.session.username}\n`)
        console.log(results)
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
  console.log(`[HTTP POST] /api/updatescoresetting User:${req.session.username}`)

  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            UPDATE scoreUid
            SET scoreName = "${req.body.title}", subject = "${req.body.tags}", summery = "${req.body.annousment}"
            WHERE uid = "${req.body.scoreid}"
            `, function (error, results, fields) {
        if (error) throw error;

        console.log(`[SQL RESULT] /api/updatescoresetting\nUser:${req.session.username}\n`)
        console.log(results)
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
  console.log(`[HTTP POST] /api/deletescore\n${req.body}\nUser:${req.session.username}`)
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            ALTER TABLE scoreData
            DROP COLUMN ${req.body.scoreid};
            `, function (error, results, fields) {
        if (error) throw error;


        console.log(`[SQL RESULT] /api/deletescore\nUser:${req.session.username}\n`)
        console.log(results)

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
            DELETE FROM scoreUid
            WHERE uid = ?;
            `, [req.body.scoreid], function (error2, results2, fields) {
            if (error2) throw error2;

            console.log(`[SQL RESULT] /api/deletescore\nUser:${req.session.username}\n`)
            console.log(results2)
            res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

            res.end();





            sql_Connect.getConnection(function (err, connection3) {
              connection3.query(`
              ALTER TABLE parentAccountCtrl 
              DROP COLUMN ${req.body.scoreid};
            `, function (error3, results3, fields) {
                console.log("[REMOVED DATA] parentAccountCtrl / ", req.body.scoreid)
                connection3.release()
              })
            })





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
    var theUUID = uuidv4().slice(0, 7)
    //create uuid
    //add new column
    //put all data
    if (Number(theUUID) !== NaN) {
      theUUID = uuidv4().slice(0, 7)
      if (Number(theUUID) !== NaN) {
        theUUID = uuidv4().slice(0, 7)
        if (Number(theUUID) !== NaN) {
          theUUID = uuidv4().slice(0, 7)
          if (Number(theUUID) !== NaN) {
            theUUID = uuidv4().slice(0, 7)
            if (Number(theUUID) !== NaN) {
              theUUID = uuidv4().slice(0, 7)
            }
          }
        }
      }
    }

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            INSERT INTO scoreUid (uid,scoreName,scoresetuid,subject,summery,publish)
            VALUES(?,?,?,?,?,?)
            `, [theUUID, req.body.score.title, theUUID, req.body.score.subject, req.body.score.annousment, req.body.method === "publish"], function (error, results, fields) {
        if (error) throw error;

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
                    ALTER TABLE scoreData
                    ADD COLUMN ${theUUID} TEXT;
                    `, function (error, results, fields) {
            if (error) throw error;
            req.body.score.scoreData.forEach((score, i) => {
              console.log("[SQL DATA WRITING]", theUUID, " ", i + 1, " STILL PROCESSING")
              sql_Connect.getConnection(function (err, connection3) {

                var index = i,
                  text = `${req.body.score.scoreData[index] !== null && req.body.score.scoreData[index] ? req.body.score.scoreData[index] : null}%|%${req.body.score.summeryData[index] !== null && req.body.score.summeryData[index] ? req.body.score.summeryData[index] : null}`

                connection3.query(`
                  UPDATE scoreData
                  SET ${theUUID} = "${req.body.score.scoreData[index] !== null && req.body.score.scoreData[index] ? req.body.score.scoreData[index] : null}%|%${req.body.score.summeryData[index] !== null && req.body.score.summeryData[index] ? req.body.score.summeryData[index] : null}"
                  WHERE id = ${index};`, function (error, results, fields) {
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




        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
                  ALTER TABLE parentAccountCtrl
                    ADD COLUMN ${theUUID} TEXT;
                    `, function (error, results, fields) {
            connection2.release()
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
      connection.query(`SELECT * FROM scoreData WHERE stdId = "${req.session.userid.replace("p", "s")}" `, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {

          //繼續查最高/最低/平均

          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`SELECT ${req.body.id} FROM scoreData`, function (error2, results2, fields2) {
              if (error2) {
                res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
              };

              sql_Connect.getConnection(function (err, connection3) {
                connection3.query(`SELECT * FROM parentAccountCtrl WHERE stdId = "${req.session.userid.replace("s", "p")}"`, function (error3, results3, fields3) {
                  if (error3) {
                    res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
                  };

                  var queryTimes
                  console.log(results3[req.body.id], "reqbodyid")
                  console.log(results3[0], "reqbodyid")

                  if (results3[0][req.body.id] == null || results3[0][req.body.id] == undefined) {
                    sql_Connect.getConnection(function (err, connection4) {
                      connection4.query(`
                      UPDATE parentAccountCtrl
                      SET ${req.body.id} = "0%|%null%|%3%|%null"
                      WHERE stdId = "${req.session.userid.replace("s", "p")}";
                    `, function (error4, results4, fields4) {
                        console.log("parent data writed")
                        connection4.release()
                      })
                    })
                  } else {
                    if (req.session.role == "std") {
                      queryTimes = results3
                    } else {
                      queryTimes = false
                      sql_Connect.getConnection(function (err, connection4) {
                        connection4.query(`
                      UPDATE parentAccountCtrl
                      SET ${req.body.id} = "${Number(results3[0][req.body.id].split("%|%")[0]) + 1}%|%${dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss")}%|%${results3[0][req.body.id].split("%|%")[2]}%|%${results3[0][req.body.id].split("%|%")[3]}"
                      WHERE stdId = "${req.session.userid}";
                    `, function (error4, results4, fields4) {
                          console.log("parent data uploaded")
                          //////////////   console.log(`${Number(results3[0][req.body.id].split("%|%")[0]) + 1}%|%${dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss")}`)
                          connection4.release()
                        })
                      })
                    }
                  }


                  if (results2.length > 0) {

                    if (req.session.role === "par" && dayjs().isBefore(dayjs(results3[0][req.body.id].split("%|%")[3]))) {
                      res.status(404).json({ message: '暫時無法查詢這筆成績，請過幾分鐘再試一次', ok: false, code: 404 });

                    } else {
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

                      console.log(`[SCORE COUNTING] ${req.body.id} User:${req.session.username}\n${scoreList}\n`)
                      res.send(JSON.stringify({ message: 'Login successful', data: { hi: hi, lo: lo, avg: avg, your: results[0][req.body.id].split("%|%")[0], privateMsg: results[0][req.body.id].split("%|%")[1], queryTimes: queryTimes ? queryTimes[0][req.body.id] : null }, ok: true }));
                    }
                  } else {
                    res.status(404).json({ message: '暫時無法查詢這筆成績，請過幾分鐘再試一次', ok: false, code: 404 });
                  }

                  res.end();



                  connection3.release()
                })
              })


              connection2.release();
            })
          })

          //    console.log(results)
          //    res.send(JSON.stringify({ message: 'Login successful', data: { result: {yourScore:results[i][req.id],} }, ok: true }));
        } else {
          res.status(404).json({ message: '請刷新網站', ok: false, code: 404 });
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
  console.log("[CHANGE PASSWORD] \nUser: ", req.session.username, "\n")
  if (req.session.userid === req.body.userid) {
    //要再檢查一遍舊密碼

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
    SELECT * FROM userData
    WHERE userid = ?
    `, [req.body.userid], function (error, results, fields) {
        if (error) throw error;
        //   console.log(`[SQL RESULT] /api/changepass\nUser:${req.session.username}`)
        console.log(results)
        if (results[0].userpassword === req.body.oldpass) {


          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
          UPDATE userData
          SET userpassword = ?
          WHERE userid = ?
          `, [req.body.newpass, req.body.userid], function (error, results2, fields) {
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

app.post("/api/blocksearch", (req, res) => {
  if (req.session.role === "std") {

    sql_Connect.getConnection(function (err, connection3) {
      connection3.query(`
      SELECT * FROM parentAccountCtrl 
      WHERE stdId = "${req.session.userid.replace("s", "p")}"
    `, function (error3, results3, fields) {

        console.log(results3)
        var data = results3[0][req.body.id].split("%|%")

        if (Number(data[2]) <= 0) {
          res.status(404).json({ message: '今天機會已經用完', ok: false, code: 404 });
        } else {
          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
      UPDATE parentAccountCtrl
      SET ${req.body.id} = "${data[0]}%|%${data[1]}%|%${Number(data[2]) - 1}%|%${dayjs().add(10, "minute").format("YYYY/MM/DD HH:mm:ss")}"
      WHERE stdId = "${req.session.userid.replace("s", "p")}";
    `, function (error2, results2, fields) {
              res.status(200).json({ message: '開啟成功', ok: true, code: 200 });
              console.log("opened")
              connection2.release()
            })
          })
        }


        connection3.release()
      })
    })

  } else {

    res.status(403).json({ code: 403, message: 'error 403', ok: false });
    res.end();

  }
})



app.post("/api/checklogin", (req, res) => {
  console.log(`[CHECK LOGIN] Page:${req.body.page} User:${req.session.username} IP:${req.ip}`)

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
  console.log(`[USER LOGOUT] User:${req.session.username} IP:${req.ip}`)

  req.session.destroy()
  res.send(JSON.stringify({ message: 'logout successful', ok: true }))

  sql_Connect.getConnection(function (err, connection) {
    connection.query(`
      SELECT * FROM parentAccountCtrl 
    `, function (error, results, field) {
      console.log(results)
    })
  })
})

var refreshData = cron.schedule('00 00 00 * * * ', () => {
  sql_Connect.getConnection(function (err, connection) {
    connection.query(`
      SELECT * FROM parentAccountCtrl 
    `, function (error, results, field) {

      sql_Connect.getConnection(function (err, connection2) {
        connection2.query(`
      SELECT * FROM scoreUid 
    `, function (error, results2, field) {


          results.forEach((r, i) => {
            var index = i
            console.log("[SQL DATA WRITING]", " ", i + 1, " STILL PROCESSING")
            sql_Connect.getConnection(function (err, connection3) {

              results2.forEach((r, k) => {

                var data = results2[index][req.body.id].split("%|%")

                connection3.query(`
                  UPDATE parentAccountCtrl 
                
                  SET ${k.uid} = "${data[0]}%|%${data[1]}%|%${3}%|%${data[3]}"
                  WHERE id = ${index};`, function (error, results, fields) {
                  if (error) throw error;
                  console.log("SQL DATA WRITING : ", " ", index, " COMPLETE [SUCCESS]")
                  connection3.release();
                })

              })

            })
          })





        })
      })




    })
  })
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  refreshData.start()
  console.log(`Server is running on port ${PORT}`);
});


//module.exports.handler = serverless(app);
