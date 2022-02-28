const express = require('express');
// 구조분해할당 - models의 db.User를 사용하는데 { User }를 사용하여 바로 가져온다.
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');

const router = express.Router();

// 로그인 전략 실행                
// middleware 확장하여 req, res, next 사용할 수 있게 한다
// -> 원래 passport.authenticate는 req, res, next를 사용할 수 없는 미들웨어인데 사용할 수 있게 확장
router.post('/login', (req, res, next) => {
  //     done에서 전달 -> ( 서버에러, 성공객체, 클라이언트 에러 )
  passport.authenticate('local', (err, user, info) => {
    // server error
    if (err) {
      console.error(err);
      // express 에게 error 넘긴다 = next()
      return next(err);
    }
    // client error
    if (info) {
      return res.status(401).send(info.reason);
    }
    // 성공시 passport 에서 login 연결 -> 사이트 login 성공 후 passport login 실행
    // req.login() 실행 후 index.js 의 serializeUser() 실행
    return req.login(user, async (loginErr) => {
      // passport login 실패 시
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // password는 빼고 Posts 정보는 넣어준 FullUser를 db에서 가져온다.
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // 원하는 것만 받는 방법
        // => attributes: ['id', 'nickname', 'email'],
        // 비밀번호만 제외하고 받는 방법
        attributes: {
          exclude: ['password']
        },
        include: [{
          // hasMany라서 Post가 복수형이 되어 me.Posts 가 된다.
          // model 폴더 안에 작성한 소스형태 그대로 가져오면 된다.
          model: Post,
        }, {
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }]
      })

      // 사용자 정보를 front에 넘겨준다.
      return res.status(200).json(user);
    });
  })(req, res, next);
}); // POST /user/login

// 로그아웃 실행
router.post('/user/logout', (req, res) => {
  // session 연결 해제 필요
  req.logout();
  req.session.destroy();
  res.send('ok');
});

// 회원가입
router.post('/', async (req, res, next) => {    // POST /user
  // 비동기이므로  try ~ catch로 감싼다.
  try {
    // email 중복 체크 (비동기이므로 await 사용)
    const exUser = await User.findOne({
        where: {
            email: req.body.email,
        }
    });
    if (exUser) {
        // 응답 두 번 보내면 안되므로 return 사용
        return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    // password hash 화
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // 201은 잘 생성됨을 의미
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    // next는 브라우저에게 error를 한 번에 보내준다.
    next(error);  // status 500
  }
 
});

module.exports = router;