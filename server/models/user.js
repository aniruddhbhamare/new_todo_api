const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ =  require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not email'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
    
        }
    }]
    });

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    //store the values into the array i.e user.tokens
    user.tokens = user.tokens.concat([{access,token}]); 
   // user.tokens.push({access,token})
   return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken= function(token) {
    var User = this;
    var decoded;

    try {
     decoded = jwt.verify(token,'abc123');
    } catch(e){
        return new Promise((resolve,reject)=>{
             reject();
        });
    }
   return User.findOne({
       '_id' : decoded._id,
       'tokens.token':token,
       'tokens.access':'auth'
   });
};

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;
    return User.findOne({email}).then((user)=>{
        console.log("User:",user);
        if(!user){
            return Promise.reject();
            console.log('not user');
        }

       return new Promise((resolve,reject)=>{
        bcrypt.compare(password,user.password,(err,res)=>{
            console.log("bcrypting :" ,password,user.password);
             if(res){
                console.log("user:" ,user);
                resolve();
                
             } else {
                console.log("reject");
                reject();
             }
         });
        });
     });
 };

//           return new Promise((resolve,reject)=>{
//           bcrypt.compare(password,user.password,(err,res)=>{
//             console.log("bcrypting :" ,password,user.password);
//             if(err){
//                console.log("reject");
//                reject();
//             } else { 
//                console.log("user:",user);
//                 resolve(user);
//             }
//        });
       
//     });
//  });
// };

//         return new Promise((resolve,reject)=>{
//             bcrypt.compare(password,user.password,(res,err)=>{

//                 console.log("bcrypting :" ,password,user.password);
//                if(res){
//                    console.log("user:",user);
//                 resolve(user);
//                } else{
//                    console.log("reject");
//                 reject();
//                }
//             });
//         });
//     });
// };

UserSchema.pre('save',function(){
    var user = this;
    if(user.isModified('password')){

        bcrypt.genSalt(10,salt,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
            
        })
    }else{
        next();
    }
});

var User = mongoose.model('User',UserSchema);

module.exports={User};