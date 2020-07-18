const express = require('express');
var passport = require('passport');
const router = express.Router();

router.get('/', function (req, res) {
  if(req.session.email){
    res.redirect('/signlogin')
  }else{
    res.render('index',{title:'ejs'});
  }
   
  });


  
router.get('/signup',(req,res)=>{
  var errors = req.flash('error');
  res.render('auth/signup',{title:'signup form', messages:errors,
  hasErrors:errors.length>0});
}
);



router.post('/signup',signupvalidate,passport.authenticate('local.signup', {
      failureRedirect: '/signup',
      failureFlash : true
    }),(req,res)=>{
        req.session.email = req.body.email;
        req.session.username = req.body.username
        console.log(req.session);
        var errors = req.flash('error');
        res.render('auth/login',{title:'login form', messages:errors,
        hasErrors:errors.length>0,user:req.user});
      
  
});




  router.get('/login', function (req, res) {
    var errors = req.flash('error');
    res.render('auth/login',{title:'login form', messages:errors,
    hasErrors:errors.length>0,user:req.user});
  })

  router.post('/login', loginvalidate ,passport.authenticate('local.login', {

    failureRedirect:'login',
    failureFlash : true
}),(req,res)=>{
  req.session.email = req.body.email;
  res.redirect('/signlogin')
});


router.get('/auth/google', passport.authenticate('google', {scope: ['email','profile']}));
    router .get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signup',
        failureFlash: true
    }),(req,res)=>{
      req.session.email= req.user._doc.email;
      res.redirect('/signlogin')
    });



router.get('/signlogin',(req,res)=>{
  if(req.session.email){
    var errors = req.flash('error');
  res.render('auth/signlogin',{title:'login form', messages:errors,hasErrors:errors.length>0,user:req.user});
  }else{
    res.redirect('/login')
  }
});
    

    
router.get('/logout',(req,res,next) =>{
   req.logout();
  
   req.session.destroy();
  
   res.redirect('/login');
 });


router.get('/forget', function (req, res) {
    res.render('auth/forget',{title:'forget '})
  })
  

  


module.exports = router;



/* ==========================================================================
                      signup validation
   ========================================================================== */

function signupvalidate(req, res, next){
  req.checkBody('email', 'Email is Required').notEmpty();
  req.checkBody('email', 'Email is Invalid').isEmail();
  req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password)
  req.checkBody('password', 'Password is Required').notEmpty();
  req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});

  

  var signupErrors = req.validationErrors();

  if(signupErrors){
      var messages = [];
      signupErrors.forEach((error) => {
          messages.push(error.msg);
      });

      req.flash('error', messages);
      res.redirect('/signup');
  }else{
      return next();
  }
}




/* ==========================================================================
                       Login  validation
   ========================================================================== */
function loginvalidate(req, res, next){
  req.checkBody('email', 'Email is Required').notEmpty();
  req.checkBody('email', 'Email is Invalid').isEmail();
  req.checkBody('password', 'Password is Required').notEmpty();
  req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});
  

  var loginErrors = req.validationErrors();

  if(loginErrors){
      var messages = [];
      loginErrors.forEach((error) => {
          messages.push(error.msg);
      });

      req.flash('error', messages);
      res.redirect('/login');
  }else{
      return next();
  }
}