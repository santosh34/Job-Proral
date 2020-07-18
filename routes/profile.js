const express = require('express');
const multer = require('multer');
var User = require('../models/user');
var user = User.find({});
const router = express.Router();
const fileStorage = multer.diskStorage({
  destination: (req,file,callback) =>{
      callback(null, 'images');
  },
  filename: function (req, file, cb) {
   
    cb(null, new Date().toDateString()+ "-" + file.originalname)
  }
})

const fileFilter = (req,file,callback) =>{
  if(
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
  ){
      callback(null, true);
  }
  else {
      callback(null, flase);
  }
};
var upload=(multer({storage: fileStorage,fileFilter: fileFilter,limits:{
  fileSize :1024 *1024*5
}}));




router.get('/update/:userid', function (req, res) {
  var errors = req.flash('error');
    res.render('auth/profile',{title:'ejs',user:req.user,messages:errors,success:'',
    hasErrors:errors.length>0});
  });



  router.post('/update/:userid',upload.single('file'), profilevalidate,(req,res,next)=>{
    User.findByIdAndUpdate(req.params.userid)
    .then(profile=>{
      if(req.file){
        profile.firstname = req.body.firstname;
        profile.lastname =req.body.lastname;
        profile.phoneno = req.body.phoneno;
        profile.username = req.body.username;
        profile.jobtitle =req.body.jobtitle;
        profile.skills = req.body.skills;
        profile.city = req.body.city;
        profile.image =req.file.filename
  }else{
      profile.firstname = req.body.firstname;
      profile.lastname =req.body.lastname;
      profile.phoneno = req.body.phoneno;
      profile.username = req.body.username;
      profile.jobtitle =req.body.jobtitle;
      profile.skills = req.body.skills;
      profile.city = req.body.city
  }
     profile.save()
     .then((profile)=>{
      var success = "updated succssfully";
      var errors = req.flash('error');
       res.render('auth/profile',{title:'forget ',user:req.user,profile:profile,success:success,messages:errors,
       hasErrors:errors.length>0});
      
     })
   .catch((err)=>{
     console.log(err)
     res.redirect('/login')
   })
   
  }) 
  });
  
router.post('/upload',upload.single('file'),function(req,res){
  var imagefile= req.file.filename;
  var imageupload= new User({
    imageupload:imagefile
  });
  imageupload.save(function(err,doc){
    if(err)
    throw err;
    var success = "updated succssfully";
    res.render('auth/profile',{title:'forget ',user:req.user,success:success,messages:errors,
    hasErrors:errors.length>0});

  })
})
module.exports= router;



function profilevalidate(req, res, next){
  req.checkBody('username', 'username is Required').notEmpty();
 
  req.checkBody('phoneno', 'phoneno Must Not Be Less Than 10 Characters').isLength({min:10});
  req.checkBody('firstname', 'firstname is Required').notEmpty();
  req.checkBody('lastname', 'lastname is Required').notEmpty();

  req.checkBody('username', 'Username Must Not Be Less Than 5 Characters').isLength({min:5});

  

  var profileErrors = req.validationErrors();

  if(profileErrors){
      var messages = [];
      profileErrors.forEach((error) => {
          messages.push(error.msg);
      });

      req.flash('error', messages);
      var errors = req.flash('error');
      res.render('auth/profile',{title:'ejs',user:req.user,success:'',messages:errors,
      hasErrors:errors.length>0});
     
  }else{
      return next();
  }
}
