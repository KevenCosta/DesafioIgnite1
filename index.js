const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const user = users.find((user => users.id === id))
  if(!user){
    return res.status(404).json({error: "Usuário não encontrado!"})
  }
  request.user = user;
  next();
}

app.post('/users', (request, response) => {
 const {name, username} = request.body;
 const id = uuidv4();
 const vBoolExist = users.some((users)=> users.username === username)
  if(vBoolExist){
    return response.json({error:"erro"}).status(400).send();
  }
 const {user} = {
   id: id,
   name: name,
   username: username,
   todos: []
 }
 user.push(users)
 return response.json(user).status(201)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  response.json(user.todos);
  /**const vBoolExist = users.some((users)=> users.username === username)
  if(vBoolExist){
    response.json(users.todos)
  }
  return response.status(404).send();**/

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {user} = request;
  const id = uuidv4();
  const todos = {
    id: id,
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todos)
  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;
  const vBoolExist = user.todos.some((todos)=> todos.id === id)
  if(!vBoolExist){
    return response.json({error:"erro"}).status(404).send();
  }
  const todos = user.todos.filter((todos)=> todos.id === id )
  todos.title = title;
  todos.deadline = deadline;
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;
  const vBoolExist = user.todos.some((todos)=> todos.id === id)
  if(!vBoolExist){
    return response.json({error:"erro"}).status(404).send();
  }
  const todos = user.todos.filter((todos)=> todos.id === id )
  todos.done = true;
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;
  const vBoolExist = user.todos.some((todos)=> todos.id === id)
  if(!vBoolExist){
    return response.json({error:"erro"}).status(404).send();
  }
  const todos = user.todos.filter((todos)=> todos.id === id )
  todos.splice(todos, 1);
  return response.status(204);
});

module.exports = app;