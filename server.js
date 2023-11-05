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
const session = require('cookie-session');
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
            if (error) {
              res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
              console.warn("[SEVER ERROR]", error)
              return
            }
            if (results.length > 0) {
              req.session.loggedin = true;
              req.session.username = results[0].username;
              req.session.userid = results[0].userid
              req.session.role = results[0].role
              console.log(`[USER LOGIN (SUCCESS)] IP:${req.ip} User:${req.session.username}`)
              res.send(JSON.stringify({ message: '登入成功', data: { userid: results[0].userid, username: results[0].username, role: results[0].role }, ok: true }));
            } else {
              req.session = null
              console.log(`[USER LOGIN (FAILED) ] IP:${req.ip} reason:incorrect password or id`)
              res.status(401).json({ message: '帳號或密碼錯誤\n如果持續無法登入，請聯絡老師重設密碼', ok: false, code: 401 });
            }
            res.end();
          })
          connection.release();

        })
      } else {
        console.log(`[USER LOGIN (FAILED) ] IP:${req.ip} reason:recaptcha verify error`)
        res.status(403).json({ message: 'recaptcha驗證失敗，請重新驗證', ok: false, code: 401 });
      }
    })
});

app.post("/api/getscore", (req, res) => {

  if (req.session.role) {
    // sql_Connect.getConnection(function (err, connection) {
    //   connection.query('SELECT * FROM scoreData WHERE stdId = ? ', [req.session.userid.replace("p", "s")], function (error, results, fields) {
    //     if (error) throw error;
    //     if (results.length > 0) {

    //       res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
    //     } else {
    //       res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
    //     }

    //     res.end();
    //     connection.release();
    //   })
    // })
    res.status(200).json({ message: '', ok: true, code: 200 });

  } else {
    res.status(403).json({ message: 'Invalid credentials', ok: false, code: 403 });
    res.end();
  }
})

app.post("/api/getallstudents", (req, res) => {
  if (req.session.role === "teacher") {
    sql_Connect.getConnection(function (err, connection) {
      connection.query('SELECT id,username,userid,userpassword FROM userData', function (error, results, fields) {
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)
          return
        }
        if (results.length > 0) {
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)
          return
        }
        if (results.length > 0) {
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }

        res.end();
      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }
        if (results.length > 0) {
          console.log(`[SQL RESULT] /api/getallstudentscorebyid\nUser:${req.session.username} \nResult:`)
          console.log(results)
          res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
        } else {
          res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
        }
        res.end();
      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }

        // console.log(`[SQL RESULT] /api/changepassword/student\nUser:${req.session.username}\n`)
        // console.log(results)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();


      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }

        console.log(`[SQL RESULT] /api/updatescore\nRESULT:\nUser:${req.session.username}\n`)
        console.log(results)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();


      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }

        console.log(`[SQL RESULT] /api/updatescoresetting\nUser:${req.session.username}\n`)
        console.log(results)
        res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

        res.end();
      })
      connection.release();

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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }

        console.log(`[SQL RESULT] /api/deletescore\nUser:${req.session.username}\n`)
        console.log(results)
        connection.release();

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
            DELETE FROM scoreUid
            WHERE uid = ?;
            `, [req.body.scoreid], function (error2, results2, fields) {
            if (error2) {
              res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
              console.warn("[SEVER ERROR]", error2)

              return
            }

            console.log(`[SQL RESULT] /api/deletescore\nUser:${req.session.username}\n`)
            console.log(results2)
            res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

            res.end();
            connection2.release();


            sql_Connect.getConnection(function (err, connection3) {
              connection3.query(`
              ALTER TABLE parentAccountCtrl 
              DROP COLUMN ${req.body.scoreid};
            `, function (error3, results3, fields) {
                if (error3) {
                  console.warn("[SEVER ERROR]", error3)

                }
                console.log("[REMOVED DATA] parentAccountCtrl / ", req.body.scoreid)
                connection3.release()
              })
            })

          })
        })


      })
    })
  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})



app.post("/api/uploadnewscore", (req, res) => {
  function getRandomLatter() {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
    var a = ["g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ""]
    return a[getRandomInt(0, (a.length - 1))]
  }

  if (req.session.role === "teacher") {
    var theUUID = uuidv4().slice(0, 7).replace("e", "k") + getRandomLatter()
    //create uuid
    //add new column
    //put all data
    if (Number(theUUID) !== NaN) {
      theUUID = uuidv4().slice(0, 7).replace("e", "k").replace("0", "p") + "m"
    }

    console.log("[FINAL UUID] ", theUUID)

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
            INSERT INTO scoreUid (uid,scoreName,scoresetuid,subject,summery,publish)
            VALUES(?,?,?,?,?,?)
            `, [theUUID, req.body.score.title, theUUID, req.body.score.subject, req.body.score.annousment, req.body.method === "publish"], function (error, results, fields) {
        if (error) {
          // res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }
        connection.release();

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
                    ALTER TABLE scoreData
                    ADD COLUMN ${theUUID} TEXT;
                    `, function (error2, results, fields) {
            if (error2) {
              // res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });

              console.warn("[SEVER ERROR]", error2)
              return
            }
            req.body.score.scoreData.forEach((score, i) => {
              console.log("[SQL DATA WRITING]", theUUID, " ", i + 1, " STILL PROCESSING")
              sql_Connect.getConnection(function (err, connection3) {

                var index = i,
                  text = `${req.body.score.scoreData[index] !== null && req.body.score.scoreData[index] ? req.body.score.scoreData[index] : null}%|%${req.body.score.summeryData[index] !== null && req.body.score.summeryData[index] ? req.body.score.summeryData[index] : null}`

                connection3.query(`
                  UPDATE scoreData
                  SET ${theUUID} = "${req.body.score.scoreData[index] !== null && req.body.score.scoreData[index] ? req.body.score.scoreData[index] : null}%|%${req.body.score.summeryData[index] !== null && req.body.score.summeryData[index] ? req.body.score.summeryData[index] : null}"
                  WHERE id = ${index};`, function (error3, results, fields) {
                  if (error3) {
                    //   res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
                    console.warn("[SEVER ERROR]", error3)

                    return
                  }
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
      })
    })

  } else {
    res.status(403).json({ code: 403, message: 'Invalid credentials', ok: false });
    res.end();
  }
})

app.post("/api/getscorebyid", (req, res) => {
  function resScore(results, results2, results3, results4, queryTimes) {
    if (req.body.countScore) {


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
    } else {
      console.log(`[ADVANCED DATA ] ${req.body.id} User:${req.session.username}\nrequest advanced data only\n`)
      res.send(JSON.stringify({ message: 'Login successful', data: { queryTimes: queryTimes ? queryTimes[0][req.body.id] : null }, ok: true }));

    }
  }


  if (req.session.role) {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`SELECT * FROM scoreData WHERE stdId = "${req.session.userid.replace("p", "s")}" `, function (error, results, fields) {
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }
        if (results.length > 0) {

          //繼續查最高/最低/平均

          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`SELECT ${req.body.id} FROM scoreData`, function (error2, results2, fields2) {
              if (error2) {
                res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
                console.warn("[SEVER ERROR]", error2)

              };
              connection2.release();


              sql_Connect.getConnection(function (err, connection3) {
                connection3.query(`SELECT * FROM parentAccountCtrl WHERE stdId = "${req.session.userid.replace("s", "p")}"`, function (error3, results3, fields3) {
                  if (error3) {
                    res.status(404).json({ message: 'Invalid credentials', ok: false, code: 404 });
                    console.warn("[SEVER ERROR]", error3)

                  };

                  var queryTimes
                  console.log(`[CHECKING PERMISSIONS] User:${req.session.username} IP:${req.ip} Query:${req.body.id}`)

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
                          console.log("parent data updateed")
                          //////////////   console.log(`${Number(results3[0][req.body.id].split("%|%")[0]) + 1}%|%${dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss")}`)
                          connection4.release()
                        })
                      })
                    }
                  }



                  if (results3[0][req.body.id]) {
                    if (results2.length > 0) {

                      if (req.session.role === "par" && dayjs().isBefore(dayjs(results3[0][req.body.id].split("%|%")[3]))) {

                        res.status(404).json({ message: '暫時無法查詢這筆成績，請過幾分鐘再試一次', ok: false, code: 404 });
                        console.log(`[PERMISSIONS DENIED] User:${req.session.username} IP:${req.ip} Query:${req.body.id}`)

                      } else {
                        resScore(results, results2, results3, null, queryTimes)
                      }
                    } else {
                      res.status(404).json({ message: '暫時無法查詢這筆成績，請過幾分鐘再試一次', ok: false, code: 404 });
                      console.warn(`[SEVER ERROR] User:${req.session.username} IP:${req.ip} Query:${req.body.id}`)

                    }
                  } else {
                    resScore(results, results2, results3, null, queryTimes)

                  }

                  connection3.release()
                  res.end();
                })
              })
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
      if (error) {
        res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
        console.warn("[SEVER ERROR]", error)

        return
      };
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
        if (error) {
          res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
          console.warn("[SEVER ERROR]", error)

          return
        }
        //   console.log(`[SQL RESULT] /api/changepass\nUser:${req.session.username}`)

        if (results[0].userpassword === req.body.oldpass) {


          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
          UPDATE userData
          SET userpassword = ?
          WHERE userid = ?
          `, [req.body.newpass, req.body.userid], function (error, results2, fields) {
              if (error) {
                res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
                console.warn("[SEVER ERROR]", error)

                return
              }


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

    req.session = null
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
        var data = results3[0][req.body.id].split("%|%")
        if (Number(data[2]) <= 0) {
          res.status(404).json({ message: '今天機會已經用完', ok: false, code: 404 });
          console.log(`[FEATURE OPENED FAILED] ${req.session.username} (IP:${req.ip}) opened 短暫維持家庭和睦 (Failed : 今日機會已用完)`)

        } else {
          sql_Connect.getConnection(function (err, connection2) {
            connection2.query(`
      UPDATE parentAccountCtrl
      SET ${req.body.id} = "${data[0]}%|%${data[1]}%|%${Number(data[2]) - 1}%|%${dayjs().add(10, "minute").format("YYYY/MM/DD HH:mm:ss")}"
      WHERE stdId = "${req.session.userid.replace("s", "p")}";
    `, function (error2, results2, fields) {
              res.status(200).json({ message: `短暫維持家庭和睦 到 ${dayjs().add(10, "minute").add(8, "hours").format("YYYY/MM/DD HH:mm:ss")} 為止`, ok: true, code: 200 });
              console.log(`[FEATURE OPENED SUCCESS] ${req.session.username} (IP:${req.ip}) opened 短暫維持家庭和睦 (until ${dayjs().add(10, "minute").add(8, "hours").format("YYYY/MM/DD HH:mm:ss")})`)
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

  req.session = null
  res.send(JSON.stringify({ message: 'logout successful', ok: true }))
})

var refreshData = cron.schedule('0 16 * * * ', () => {
  sql_Connect.getConnection(function (err, connection) {
    connection.query(`
      SELECT * FROM parentAccountCtrl 
    `, function (error, results, field) {

      sql_Connect.getConnection(function (err, connection2) {
        connection2.query(`
      SELECT * FROM scoreUid 
    `, function (error, results2, field) {
          results.forEach((k, i) => {
            var index = i
            console.log("[CRON]SQL DATA WRITING", " ", i + 1, " STILL PROCESSING")
            sql_Connect.getConnection(function (err, connection3) {

              results2.forEach((r, j) => {

                var data = String(results[index][r.uid]).split("%|%")

                //console.log(data, " ", r, " ", results[index])

                if (data.length > 1) {
                  connection3.query(`
                  UPDATE parentAccountCtrl 
                
                  SET ${r.uid} = "${data[0]}%|%${data[1]}%|%${3}%|%${data[3]}"
                  WHERE id = ${index + 1};`, function (error, results, fields) {
                    if (error) {
                      res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
                      console.warn("[SEVER ERROR]", error)

                      return
                    }

                    console.log("[CRON]SQL DATA WRITING : ", " ", index, " COMPLETE [SUCCESS] with code 0")
                    connection3.release();
                  })
                } else {
                  connection3.query(`
                  UPDATE parentAccountCtrl 
                
                  SET ${r.uid} = "0%|%null%|%3%|%null"
                  WHERE id = ${index + 1};`, function (error, results, fields) {
                    if (error) {
                      res.status(500).json({ message: 'sever error 500', ok: false, code: 500 });
                      console.warn("[SEVER ERROR]", error)

                      return
                    }

                    console.log("[CRON]SQL DATA WRITING : ", " ", index, " COMPLETE [SUCCESS] with code 1")
                    connection3.release();
                  })
                }
              })

            })
          })
        })
      })
    })
  })
});


app.post("/api/sqltest", (req, res) => {
  console.log(`[HTTP POST] /api/sqltest User:${req.session.username} Page:${req.body.page}`)

  if (req.session.loggedin) {
    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
       
        SELECT * FROM connectionTest
        `, function (error, results, fields) {
        if (error) {
          console.log("[SQL TEST] get SQL data : [ERR!]", error)
          res.status(500).json({ message: "測試讀取資料時發生錯誤", ok: false, code: 500 })
          connection.release()
          res.end()
          return
        }
        else {
          console.log("[SQL TEST] get SQL data : SUCCESS")
        }
        connection.release()

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
           DELETE FROM connectionTest
            WHERE id > 1;
       
        `, function (error2, results2, fields) {
            if (error2) {
              console.log("[[SQL TEST] delete SQL data : [ERR!]", error2)
              res.status(500).json({ message: "測試刪除資料時發生錯誤", ok: false, code: 500 })
              connection2.release()
              res.end()
              return
            } else {
              console.log("[SQL TEST] delete SQL data : SUCCESS")
            }
            connection2.release()

            sql_Connect.getConnection(function (err, connection3) {
              connection3.query(`
            INSERT INTO connectionTest (k,time)
            VALUES(${0},"${dayjs().add(8, "hours").format("YYYY/MM/DD HH:mm:ss")}")

        `, function (error3, results3, fields) {
                if (error3) {
                  console.log("[SQL TEST] insert SQL data : [ERR]", error3)
                  res.status(500).json({ message: "測試寫入資料時發生錯誤", ok: false, code: 500 })
                  connection3.release()
                  res.end()
                  return
                } else {
                  console.log("[SQL TEST] insert SQL data : SUCCESS")
                  res.status(200).json({ message: "伺服器連線測試成功", ok: true, code: 200 })
                }
                connection3.release()
              })
            })
          })
        })
      })
    })
  } else {
    res.status(404).json({ message: "not found", ok: false, code: 404 })

  }
})




var connectionTest =
  cron.schedule('0 */2 * * *', () => {

    sql_Connect.getConnection(function (err, connection) {
      connection.query(`
       
        SELECT * FROM connectionTest
        `, function (error, results, fields) {
        if (error) { console.log("[CRON][SQL TEST] get SQL data : [ERR!]", error) }
        else {
          console.log("[CRON][SQL TEST] get SQL data : SUCCESS")
        }
        connection.release()

        sql_Connect.getConnection(function (err, connection2) {
          connection2.query(`
           DELETE FROM connectionTest
            WHERE id > 1;
       
        `, function (error2, results2, fields) {
            if (error2) {
              console.log("[CRON][SQL TEST] delete SQL data : [ERR!]", error2)
            } else {
              console.log("[CRON][SQL TEST] delete SQL data : SUCCESS")
            }
            connection2.release()

            sql_Connect.getConnection(function (err, connection3) {
              connection3.query(`
            INSERT INTO connectionTest (k,time)
            VALUES(${1},"${dayjs().add(8, "hours").format("YYYY/MM/DD HH:mm:ss")}")

        `, function (error3, results3, fields) {
                if (error3) {
                  console.log("[CRON][SQL TEST] insert SQL data : [ERR]", error3)

                } else {
                  console.log("[CRON][SQL TEST] insert SQL data : SUCCESS")
                }
                connection3.release()
              })
            })
          })
        })
      })
    })


  })


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  refreshData.start()
  connectionTest.start()

  console.log(`Server is running on port ${PORT}`);
});


//module.exports.handler = serverless(app);
