const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
require('dotenv').config()


router.get('/', (req, res, next) => {
    res.send("acessou");
})


module.exports = router;