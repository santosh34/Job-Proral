
const express = require('express');
var User = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();




router.get('/resetpw',  passwordvalidate,function(req, res) {
      var success = "password updated succssfully";
      var errors = req.flash('error');
      res.render('/auth/changepw',{title:'ejs',user:req.user,success:'', messages:errors,
      hasErrors:errors.length>0});
    });
  
    router.post('/resetpw',function(req,res,next){
      //checking session maintain or not
      let session = req.session;
      if(session.email){
          var oldpw = req.body.oldpw;
          var newpw = req.body.newpw;
          var confirmpw = req.body.changepw;
          //searching for email if user exists
          User.findOneAndUpdate({"email":session.email},(user)=>{
              if(user!==null){
                  var hash = user.password
                  bcrypt.compare(oldpw,hash)
                  .then(isMatch=>{
                      if(isMatch){
                          console.log('passowrd match')
                          if(newpw == confirmpw){
                              bcrypt.hash(newpw,12)
                              .then(hashed=>{
                                  user.password= hashed;
                                  user.save();
                                  console.log(hased)
                              })
                              .then(newuser=>{
                                var success = "password updated succssfully";
                                var errors = req.flash('error');
                                console.log(newuser)
                                res.render('auth/changepw',{title:'changepw',user:req.user,newuser:newuser,success:success, messages:errors,
                                hasErrors:errors.length>0});
                               
                              })
                          }
                      }
                  })
              }

          })
      }
     
  })

module.exports =router;



function passwordvalidate(req, res, next){
  req.checkBody('oldpw', 'Oldpw is Required').notEmpty();
  req.checkBody('newpw', 'new pw is Invalid').notEmpty();
  req.checkBody('changepw', 'changepw do not match').notEmpty();
  req.checkBody('cpassword', 'Passwords do not match').equals(req.body.newpw)
  

  

  var passwordErrors = req.validationErrors();

  if(passwordErrors){
      var messages = [];
      passwordErrors.forEach((error) => {
          messages.push(error.msg);
      });

      req.flash('error', messages);
      var success = "password updated succssfully";
      var errors = req.flash('error');
      res.render('auth/changepw',{title:'ejs',user:req.user,success:success, messages:errors,
      hasErrors:errors.length>0});
  }else{
      return next();
  }
}
