const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('./../libs/passport');
const secretOrPublicKey =config.get('jwtSecret');
const pick = require('lodash/pick');
const params = require('params');

module.exports = function (app) {
  app.use('/profile', router);
};

router.get('/', passport.authenticate('jwt', { session: false }), (req, res)=>{
    res.status(200).send(pick(req.user, db.users.publicFields))
})

router.put('/', passport.authenticate('jwt', { session: false }), (req, res)=>{
    db.users.findOne({
        where: {
            email: req.user.email
        }
    }).then(user=>{
        var body = params(req.body).except('roleId', 'email');
        if(body.password == null) delete user.dataValues.password;
            user.updateAttributes(body)
        .then(_user=>{
            res.send(pick(_user, db.users.publicFields))
        }).catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.status(404).send(err)
    })
})