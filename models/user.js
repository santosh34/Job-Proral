const mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        
        
    },
    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },
    jobtitle:{
        type: String,
        default:''
    },
    skills:{
        type: String,
        default:''
    },
  
    
    phoneno:{
        type: String,
        default:''
    },
    
    city:{
        type: String,
        default:''
    },
  
    
  
    address:{
        type: String,
        default:''
    },
    
    image:{
        type: String,
        default:''
    },
    google:{
        type: String,
        default:''
    },
      tokens :Array
      
});


userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model("User", userSchema);