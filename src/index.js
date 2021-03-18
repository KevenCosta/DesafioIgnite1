const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const user = users.find((user) => user.username === username)
  if(!user){
    return response.status(404).json({error: "Usuário não encontrado!"})
  }
  request.user = user;
  next();
}
app.get('/users', (request, response)=>{
  return response.json(users)
})
app.post('/users', (request, response) => {
 const { name, username } = request.body;
 const id = uuidv4()
 const user = { //*criei como objeto {}
   id: id,
   name,
   username,
   todos: []
 }
 const vBoolExist = users.some((user)=> user.username === username)
  if(vBoolExist){
    return response.status(400).json({error:"erro"})
  }
 users.push(user)
 return response.json(user).status(201);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  return response.json(user.todos);
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
  return response.status(201).json(todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;
  const vBoolExist = user.todos.some((todos)=> todos.id === id)
  if(!vBoolExist){
    return response.status(404).json({error:"erro"})
  }
  const todos = user.todos.find((todos)=> todos.id === id )//*usei filter
  todos.title = title;//permite alterar dessa forma pq find da a referencia e n a copia do valor
  todos.deadline = new Date(deadline);
  return response.json(todos);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;
  const vBoolExist = user.todos.some((todos)=> todos.id === id)//*usar do find
  if(!vBoolExist){
    return response.status(404).json({error:"erro"})
  }
  const todos = user.todos.find((todos)=> todos.id === id )//*usei filter
  todos.done = true;
  return response.json(todos);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;
  const todosIndex = user.todos.findIndex((todos)=> todos.id === id )
  if(todosIndex === -1){
    return response.status(404).json({error:"erro"})
  }
  user.todos.splice(todosIndex, 1);
  return response.status(204).json();//ou .send() no lugar do json()
});

module.exports = app;