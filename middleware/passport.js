const { ExtractJwt, Strategy } = require('passport-jwt');
const { User }      = require('../models');
const CONFIG        = require('../config/config');
const {to}          = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log(opts.jwtFromRequest);
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use('users', new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id));
        if(err) return done(err, false);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
    passport.use('admin', new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id));
        if(err) return done(err, false);
        if(user && user.dataValues.roleId == 1) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
}