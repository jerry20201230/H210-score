const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
// 假设这是用户数据
const users = [
    { userid: 'user1', password: '', username: "測試人員1" },
    // ...
];

app.post('/api/login', (req, res) => {
    const { userid, password } = req.body;

    const user = users.find((user) => user.userid === userid && user.password === password);

    sql_Connect.getConnection(function (err, connection) {
        connection.query('SELECT * FROM userData WHERE userid = ? AND userpassword = ?', [userid, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = results[0].username;
                req.session.role = results[0].role
                res.send(JSON.stringify({ message: 'Login successful', data: { userid: results[0].userid, username: results[0].username, role: results[0].role }, ok: true }));
            } else {
                res.status(401).json({ message: 'Invalid credentials', ok: false });
            }

            res.end();
            connection.release();
        })
    })

});

app.post("/api/checklogin", (req, res) => {
    res.send(JSON.stringify({ logined: req.session.loggedin }))
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
