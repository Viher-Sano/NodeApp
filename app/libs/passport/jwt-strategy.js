const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const config = require('config');
const db = require('./../../models');

function fromHeader(header) {
    let token = null;
    return function (req) {
        if (req && req.headers) {
            token = req.headers[header];
        }
        return token;
    }
};
passport.use(new Strategy({
    secretOrKey: config.get('jwtSecret'),
    jwtFromRequest: fromHeader('token')
}, (jwtPayload, done) => {
    db.users.findById(jwtPayload.id)
        .then((user) => {
            done(null, user);
        }).catch((err) => {
            done(err, false);
        });
}))