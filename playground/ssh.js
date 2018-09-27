//const {SHA256} =require('crypto-js');
const jwt = require('jsonwebtoken');

var id = 10;

var token = jwt.sign(id, 'abc123');
console.log(token);

var decoded = jwt.verify(token,'abc123');
console.log(decoded);


// var data = "hello world";

// var hash = SHA256(data).toString();

// console.log(data);
// console.log(hash);