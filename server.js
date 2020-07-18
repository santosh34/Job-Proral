const express = require('express');
const path = require('path');
var cookieParser= require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var mongoose= require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');


//routes
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const passwordRoutes = require('./routes/updatepw');

const app = express();

//db connections
mongoose.connect('mongodb://localhost:27017/jobportal', { useNewUrlParser: true, useUnifiedTopology: true}).
  catch(error => handleError(error));


//importing folder
require('./config/passport');
require('./secrete/secrete');



//app middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(validator());
app.use(session({
    secret:'secretekeyforsessionid',
    resave:false,
    saveUninitialized:false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    //cookie:{secure:true},
    
store : new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());






//routes middleware
app.use('/',userRoutes);
app.use('/profile',profileRoutes);
app.use('/updatepw',passwordRoutes);



//listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT,console.log('server started on port 3000'));