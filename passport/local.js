const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        // req.body.email, password
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        // 서버에러를 대비하여 try ~ catch
        try {
            // login 전략
            // 1. email 검사
            // findOne - sql 문법 대신 사용
            const user = await User.findOne({
                where: { email }  // email: email을 es6 문법으로 줄였다.
            });
            if (!user) {
                //  서버에러, 성공, 클라이언트 에러(보낸측 실수)
                return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
            }
            // email이 존재한다면 비밀번호 비교
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                //          실패,  성공
                return done(null, user);
            }
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }));
};