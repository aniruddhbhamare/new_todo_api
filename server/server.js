const _ = require('lodash');
const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


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

app.get('/users',(req,res)=>{
User.find().then((users)=>{
    res.send({users});
},(err)=>{
    res.send(err);
});
});

app.listen(port,()=>{
    console.log(`server is running on ${port} `);
});

// var newUser = new User({
//     name:'user1'
// });

// newUser.save().then((doc)=>{console.log({doc})},(err)=>{console.log(err)});