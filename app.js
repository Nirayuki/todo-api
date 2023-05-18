const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Caminho encontrado");
})

const rotaUser = require('./routes/user');

app.use('/user', rotaUser);

module.exports = app;