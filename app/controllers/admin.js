const express = require('express');
const router = express.Router();

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Generator-Express MVC'
    });
});