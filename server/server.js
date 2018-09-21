var express = require('express');
var bodyparser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
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
  Todo.find().then((doc)=>{
    res.send({doc});
  },(err)=>{
    res.esnd(err);
  });
});

app.post('/users',(req,res)=>{
    var user = new User({
        name:req.body.name
    });

    user.save().then(
    (doc)=>{
        res.status(200).send(doc);
    },
    (err)=>{
        res.status(400).send(err);
    });
});

app.get('/users',(req,res)=>{
User.find().then((doc)=>{
    res.send({doc});
},(err)=>{
    res.send(err);
});
});

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

// var newUser = new User({
//     name:'user1'
// });

// newUser.save().then((doc)=>{console.log({doc})},(err)=>{console.log(err)});