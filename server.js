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

    if (user) {
        // 登录成功，返回认证令牌或其他信息
        req.session.loggedin = true;
        res.send(JSON.stringify({ message: 'Login successful', data: { userid: user.userid, username: user.username }, ok: true }));
    } else {
        // 登录失败
        res.status(401).json({ message: 'Invalid credentials', ok: false });
    }
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
