const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
require('dotenv').config();


router.post('/add', (req, res, next) => {
    const nome = req.body.nome;
    const iduser = req.body.iduser;

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO projeto (nome, status, user_iduser) VALUES (?, "Em andamento", ?)',
            [nome, iduser],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(201).send({
                    mensagem: 'Projeto registrado com sucesso!'
                });
            }
        )
    })
})

router.post('/list', (req, res, next) => {
    const iduser = req.body.iduser;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM projeto WHERE user_iduser = ?',
            iduser,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.send(resultado);
            }
        )
    })
})

module.exports = router;