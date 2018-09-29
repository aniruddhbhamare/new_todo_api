const bcrypt = require('bcryptjs');

var password = 'abc123';

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$cTsvnb1vbPGn6dSzmteWTumt7Wrdbw/WyWzB3nd4pkOOcU5f6qCRa' 


bcrypt.compare(password,hashedPassword,(err,res)=>{
   console.log(res);
});