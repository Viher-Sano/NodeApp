const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('./../libs/passport');
const secretOrPublicKey =config.get('jwtSecret');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.post('/register', (req, res) => {
  db.users.create({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }).then(user=>{
      user.dataValues.token = jwt.sign({id: user.id}, secretOrPublicKey, { expiresIn: "2 days" })
      res.status(201).send({token: user.dataValues.token})
  }).catch(err=>{
      err.status = 400;
      res.send(err);
  })
});

router.post('/login', (req, res) => {
  db.users.findOne({
    where: {
        email: req.body.email
    },
    attributes: ['id', 'password']
  }).then(user=>{
      if (user != null && db.users.isPassword(req.body.password, user.password)){
          user.dataValues.token = jwt.sign({id: user.id}, secretOrPublicKey, { expiresIn: "2 days" });
          console.log(user.dataValues.token);
          res.status(200).send({token: user.dataValues.token})
      }else {
          res.status(204).send({error: 'user not found'})
      }
  }).catch(err=>{
      res.send(err)
  })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res)=>{
    res.status(200).send(req.user)
})