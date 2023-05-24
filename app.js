const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require("cors");

const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(cors(corsOptions))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});


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