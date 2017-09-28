const express = require('express');
const router = express.Router();
const db = require('../models');
const article = require('../models').Article;
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('./../libs/passport');
const secretOrPublicKey =config.get('jwtSecret');
const pick = require('lodash/pick');
const params = require('params');

module.exports = function (app) {
  app.use('/article', router);
};

router.get('/', passport.authenticate('jwt', { session: false }), (req, res)=>{
    article.findAll().then(function (articles) {
      res.render('articles', {
        title: 'Generator-Express MVC',
        articles: articles
      });
    });
  });

router.post('/', passport.authenticate('jwt', { session: false }), (req, res)=>{
    article.create({
        title: req.body.title,
        url: req.body.url,
        text: req.body.text
    }).then(article=>{
        res.status(200).send(article)
    }).catch(err=>{
        err.status = 400;
        res.send(err);
    })
})

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res)=>{
    article.findOne({
        where: {
            id: req.params.id
        }
    }).then(article=>{
        //var body = params(req.body);
        article.updateAttributes(req.body)
        .then(_article=>{
            res.send(_article)
        }).catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.status(404).send(err)
    })
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res)=>{
    article.findOne({
        where: {
            id: req.params.id
        }
    }).then(article=>{
        article.destroy()
        .then(rowsDelete=>{
            res.status(200).send({"message": "success"})
        })
        .catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.status(404).send({"message": "Not found"})
    })
})