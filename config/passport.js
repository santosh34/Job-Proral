var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var secrete = require('../secrete/secrete')
var User = require('../models/user');




 // used to serialize the user for the session
passport.serializeUser((user,done)=>{
   
    done(null,user.id);
});

// retrieve the whole object via the deserializeUser function  
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{

        done(err,user);
    });

});



/* ==========================================================================
                       signup  usign passport
   ========================================================================== */
passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', 
    passReqToCallback: true // allows us to pass back the entire request to the callback
},(req,email,password,done) => {
    
    //check by email
    User.findOne({'email':email},(err,user) => {
        if(err){
            return done(err);
        }
        //if user exists
        if(user){
           return done(null,false,{message:'Already exists : '+email});
        }
             // set the  new user's local credentials
            var newUser = new User();
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);

            //save the user
            newUser.save((err)=>{
                if(err)
                throw err;
                return done(null, newUser);
            });
          
    });
}));



/* ==========================================================================
                       Login  usign passport
   ========================================================================== */

   passport.use('local.login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', 
    passReqToCallback: true
},(req,email,password,done) => {

    //check email exist or not
    User.findOne({'email':email},(err,user) => {
        if(err){
            return done(err);
        }
      
        var messages=[]
        
        //checking user name exists or not
        if(!user){
            messages.push('Email does not exists')
            return done(null,false, req.flash('error',messages));
        }
        //checking password valid or not
        if(!user.validPassword(password)){
            messages.push(' Invalid password')
            return done(null,false, req.flash('error',messages));
        }

         return done(null,user)
          
    });
}));



/* ==========================================================================
                     Google  Login  usign passport
   ========================================================================== */
   

passport.use(new GoogleStrategy(secrete.google, (req, token, refreshToken, profile, done) => {
    User.findOne({google:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }
        //already exists
        if(user){
            done(null, user);
        }else{
            //if not create new user
            var newuser = new User();
            newuser.google = profile.id;
            newuser.username = profile.displayName;
            newuser.email = profile._json.email;
            newuser.tokens.push({token:token});
            console.log(newuser);
            
           


            newuser.save(function(err,newuser) {
                if(err){
                    console.log(err);
                }
                done(null,newuser);
            });
        }
    })
}));


