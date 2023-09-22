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


app.post('/api/login', (req, res) => {
    const { userid, password } = req.body;

    sql_Connect.getConnection(function (err, connection) {
        connection.query('SELECT * FROM userData WHERE userid = ? AND userpassword = ?', [userid, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = results[0].username;
                req.session.userid = results[0].userid
                req.session.role = results[0].role
                res.send(JSON.stringify({ message: 'Login successful', data: { userid: results[0].userid, username: results[0].username, role: results[0].role }, ok: true }));
            } else {
                req.session.destroy()
                res.status(401).json({ message: 'Invalid credentials', ok: false });
            }

            res.end();
            connection.release();
        })
    })

});

app.post("/api/getscore", (req, res) => {

    if (req.session.role) {
        sql_Connect.getConnection(function (err, connection) {
            connection.query('SELECT * FROM scoreData WHERE stdId = ? ', [req.session.userid], function (error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    console.log(results)
                    res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
                } else {
                    res.status(404).json({ message: 'Invalid credentials', ok: false });
                }

                res.end();
                connection.release();
            })
        })
    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
        res.end();
    }


})

app.post("/api/getallstudents", (req, res) => {
    if (req.session.role === "teacher") {
        sql_Connect.getConnection(function (err, connection) {
            connection.query('SELECT id,username,userid,userpassword FROM userData', function (error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    console.log(results)
                    res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
                } else {
                    res.status(404).json({ message: 'Invalid credentials', ok: false });
                }

                res.end();
                connection.release();
            })
        })
    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
        res.end();
    }
})

app.post("/api/getallstudentscorebyid", (req, res) => {
    if (req.session.role === "teacher") {

    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
        res.end();
    }
})

app.post("/api/changepassword/student", (req, res) => {
    console.log("/api/changepassword/student", req.body)
    if (req.session.role === "teacher") {
        sql_Connect.getConnection(function (err, connection) {
            connection.query(`
            UPDATE userData
            SET userpassword = "${req.body.password}"
            WHERE id = ${req.body.id}
            `, function (error, results, fields) {
                if (error) throw error;

                console.log(results)
                res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));

                res.end();
                connection.release();

            })
        })
    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
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
                    ALTER COLUMN ${theUUID} json
                    `, function (error, results, fields) {
                        if (error) throw error;
                        res.status(200).json({ message: 'ok', ok: true, uuid: theUUID });
                        connection2.release();

                    })
                })
                connection.release();
            })
        })

    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
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
                                res.status(404).json({ message: 'Invalid credentials', ok: false });
                            };
                            if (results2.length > 0) {
                                var hi = 0, lo = 0, avg = 0, tot = 0, scoreList = []

                                for (i = 0; i < results2.length; i++) {
                                    tot += results2[i][req.body.id]
                                    scoreList.push(results2[i][req.body.id])
                                }
                                hi = Math.max(...scoreList)
                                lo = Math.min(...scoreList)

                                avg = (tot / results2.length).toFixed(2)

                                console.log(results2)
                                res.send(JSON.stringify({ message: 'Login successful', data: { hi: hi, lo: lo, avg: avg, your: results[0][req.body.id] }, ok: true }));
                            } else {
                                res.status(404).json({ message: 'Invalid credentials', ok: false });
                            }

                            res.end();
                            connection2.release();
                        })
                    })

                    //    console.log(results)
                    //    res.send(JSON.stringify({ message: 'Login successful', data: { result: {yourScore:results[i][req.id],} }, ok: true }));
                } else {
                    res.status(404).json({ message: 'Invalid credentials', ok: false });
                }

                ////     res.end();
                connection.release();
            })
        })
    } else {
        res.status(403).json({ message: 'Invalid credentials', ok: false });
        res.end();
    }

})

app.post("/api/getscoremap", (req, res) => {
    sql_Connect.getConnection(function (err, connection) {
        connection.query('SELECT * FROM scoreUid', function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                console.log(results)
                res.send(JSON.stringify({ message: 'Login successful', data: { result: results }, ok: true }));
            } else {
                res.status(404).json({ message: 'Invalid credentials', ok: false });
            }

            res.end();
            connection.release();
        })
    })
})

app.post("/api/checklogin", (req, res) => {
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
    req.session.destroy()
    res.send(JSON.stringify({ message: 'logout successful', ok: true }))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//module.exports.handler = serverless(app);