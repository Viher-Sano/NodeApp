var express = require('express'),
  router = express.Router(),
  db = require('../models');
  auth = require('../auth/passport');

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

router.post('/register', auth.registration)

/*router.post('/register', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.send({'email': req.body.email});
  });
});*/

router.post('/login', auth.login)

router.get('/profile', auth.instance, (req, res)=>{
    res.status(200).send(req.user)
})