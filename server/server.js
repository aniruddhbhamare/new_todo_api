const _ = require('lodash');
const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var bcrypt = require('bcryptjs');


var app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());

app.post('/todos',(req,res)=>{
  var todo = new Todo({
      text:req.body.text,
      completed:req.body.completed
  });

  todo.save().then((doc)=>{
      res.status(200).send({doc});
  },(err)=>{
      res.status(400).send(err);
  });
})

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.esnd(err);
  });
});

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){

           return res.status(404).send();
        }
        res.send(todo);
    }).catch((e)=>{

        res.status(400).send();
    });
});

// Todo.remove().then((res)=>{
//     console.log(res);
// });

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
       if(!todo){
       return res.status(404).send();   
       }
        res.send(todo);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']); 

 if(!ObjectID.isValid(id)){
    return res.status(404).send();
 }
 if(_.isBoolean(body.completed) && body.completed){
     body.completedAt = new Date().getTime(); 
 } else {
     body.completed = false;
     body.completedAt = null;
 }
Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo){
       return res.status(404).send();
    }
    res.send({todo});
}).catch((e)=>{
    return res.status(400).send();
})

});

app.post('/users',(req,res)=>{
    // var user = new User({
    //     email:req.params.email,
    //     password:req.params.password,
    //     tokens:req.params.tokens
    // });
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        //res.send(user);
       return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});


app.get('/users/me',authenticate,(req,res)=>{
    // var token = req.header('x-auth');
    // User.findByToken(token).then((user)=>{
    //     if(!user){
    //         return Promise.reject();
    //     }
    //     res.send(user);
    // }).catch((e)=>{
    //     res.status(401).send();
    // });
    res.send(req.user);
});

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email, body.password).then((user)=>{
      res.send(user); 
    }).catch((e)=>{
        res.status(400).send();
    });   
});




app.get('/users',(req,res)=>{
User.find().then((users)=>{
    res.send({users});
}).catch((e)=>{
    res.status(404).send();
})
// ,(err)=>{
//     res.send(err);
// });
});

app.listen(port,()=>{
    console.log(`server is running on ${port} `);
});

// var newUser = new User({
//     name:'user1'
// });

// newUser.save().then((doc)=>{console.log({doc})},(err)=>{console.log(err)});