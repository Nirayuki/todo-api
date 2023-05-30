const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Caminho encontrado");
})

const rotaUser = require('./routes/user');
const rotaProjeto = require('./routes/projeto');
const rotaTarefa = require('./routes/tarefa');

app.use('/user', rotaUser);
app.use('/projeto', rotaProjeto);
app.use('/tarefa', rotaTarefa);

module.exports = app;
