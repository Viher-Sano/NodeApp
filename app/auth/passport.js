const passport = require('passport'),
strategy = require('passport-http-bearer').Strategy,
db = require('../models'),
jwt = require('jsonwebtoken'),
async = require('async');


let secretOrPublicKey = 'i am sexy and i know it!'

module.exports.init = () => {
   passport.use('jwt-bearer', new strategy(
       function(token, cb) {
           jwt.verify(token, secretOrPublicKey, function(err, decoded) {
               if(err){
                   return cb(err)
               }
               db.users.findOne({
                   where : {
                       id: decoded.id
                   },
                   attributes: ['id', 'email', 'firstName', 'lastName']
               }).then(user => {
                   if(user != null){
                       cb(null, user)
                   }else{
                       cb({err: "User not found"})
                   }
               })
                   .catch(err => cb(err))
           });
       }));
};

module.exports.instance = passport.authenticate('jwt-bearer', { session: false });

module.exports.registration = (req, res, next) =>{
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
       next(err)
   })
}

module.exports.login = (req, res)=>{
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
}