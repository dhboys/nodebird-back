const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

// 보안을 위한 설정 (db password, session secret 등)
dotenv.config();
const app = express();

// server 실행 시 db 연결 (express에 sequelize 연결)
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);
// passport / index와 연결 (passport설정)
passportConfig();

// 모든 요청에 대해 cors 허용
app.use(cors({
    origin: true,
    credentials: false,
}));
// json 타입을 저장해준다.
app.use(express.json());
// form submit을 했을 때 데이터를 처리해준다.
app.use(express.urlencoded({ extended: true }));
// cookie 설정
app.use(cookieParser('nodebirdsecret'));
// session 설정
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

// http.createServer
app.get('/', (req, res) => {
    res.send('hello api');
  });
// pre-fix를 붙여줄 수 있다.(경로 설정)
app.get('/posts', (req, res) => {
    res.json([
        { id: 1, content: 'hello'},
        { id: 2, content: 'hello2'},
        { id: 3, content: 'hello3'},
    ]);
});

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중');
});