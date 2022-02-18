const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

// passport index는 결국 app.js 와 연결 (중앙통제실)
module.exports = () => {
    // passport login 실행 후 serializeUser 실행
    passport.serializeUser((user, done) => {
        // session에 너무 많은 데이터를 담으면 메모리 부족 -> user.id만 저장
        // 나중에 복원을 위해서는 id를 통해 deserializeUser에 id를 param으로 던져서 db에서 data 찾아온다.
        // (server Error, 성공시 받을 객체)
        done(null, user.id);
    });

    passport.deserializeUser( async(id, done) => {
        try {
            const user = await User.findOne({ where: { id }});
            done(null, user);  // req.user 에 담는다.
        } catch (err) {
            console.error(error);
            done(error);
        }
    });
    // passport / local 과 연결
    local();
}