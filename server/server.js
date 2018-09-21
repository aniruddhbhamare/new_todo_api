var express = require('express');
var bodyparser = require('body-parser');
var {ObjectID} = require('mongodb');

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
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.esnd(err);
  });
});

app.post('/users',(req,res)=>{
    var user = new User({
        name:req.body.name
    });

    user.save().then(
    (todo)=>{
        res.send(todo);
    },
    (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            console.log('inside not is');
           return res.send(404).send();
        }
        res.send(todo);
    }).catch((e)=>{
        res.status(400).send();
    })
});


app.get('/users',(req,res)=>{
User.find().then((users)=>{
    res.send({users});
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