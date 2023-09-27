const express = require('express');
const bodyParser = require('body-parser');
const authenticationToken = require('./middleware/authenticateUser');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//load the todo date from the file
const displayTodos = () => {
    const data = fs.readFileSync(path.join(__dirname, './todoFile.json'));
    return JSON.parse(data);
}

const saveTodos = (data) => {
    fs.writeFileSync(path.join(__dirname, './todoFile.json'), JSON.stringify(data));
}

//middle ware to authenticate user using bearer token
app.use(authenticationToken);


//get the all todos list from the file
app.get('/todos', (req, res) => {
    const data = displayTodos();
    res.send(data);
});

//get the todo by id
app.get('/todos/:id', (req, res) => {
    const data = displayTodos();
    const todo = data.find((todo) => todo.id === parseInt(req.params.id));
    if (todo) {
        res.status(200).send(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

//create a new todo
app.post('/todos', (req, res) => {
    const data = displayTodos();
    const todo = {
        id: data.length + 1,
        content: req.body.content,
    };

    data.push(todo);
    saveTodos(data);
    res.status(201).send(todo);
});

//update the todo by id
app.put('/todos/:id', (req, res) => {
    const data = displayTodos();
    console.log(req.params.id);
    const index = data.findIndex((todo) => todo.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).send('Todo not found');
    } else {
        data[index].content = req.body.content;
        saveTodos(data);
        res.status(200).send(data[index]);
    }
});

//delete the todo by id
app.delete('/todos/:id', (req, res) => {
    const data = displayTodos();
    const index = data.findIndex((todo) => todo.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).send('Todo not found');
    } else {
        data.splice(index, 1);
        saveTodos(data);
        res.status(200).send(data);
    }
});

//search the todo by content
app.get('/searchTodo', (req, res) => {
    const data = displayTodos();
    const { content } = req.query;
    console.log(content);
    console.log(data);
    const filteredData = data.filter((todo) => todo.content.toLowerCase().includes(content.toLowerCase()));
    if (filteredData.length === 0) {
        res.status(404).send('Todo not found');
    } else {
        res.status(200).send(filteredData);
    }

});




