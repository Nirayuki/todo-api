const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;


router.get('/', (req, res, next) => {
    res.send("acessou");
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const senha = req.body.senha;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM user WHERE Email = ?;',
            email,
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.send({error: error});
                }

                if(resultado.length > 0) {
                    console.log(resultado[0]);
                    bcrypt.compare(senha, resultado[0].senha, (error, response) => {
                        if (response) {
                            res.send("Entrou");
                        }else{
                            res.send("Não entrou");
                        }
                    })
                }
            }
        )
    })
});

router.post('/register', (req, res, next) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;


    mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM user WHERE email = ?',
                email,
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                        res.send({error: error});
                    }

                   if(resultado.length == 0){
                        mysql.getConnection((error, conn) => {
                            bcrypt.hash(senha, saltRounds, (err, hash)=> {

                                if(err) {
                                    console.log(err);
                                }

                                conn.query(
                                    'INSERT INTO user (nome, email, senha) VALUES (?, ?, ?)',
                                    [nome, email, hash],
                                    (error, resultado, field) => {
                                        conn.release();

                                        if(error){
                                            res.status(500).send({
                                                error: error,
                                                response: null
                                            });
                                        }

                                        res.status(201).send({
                                            mensagem: 'Registro feito com sucesso!'
                                        });
                                    }
                                )
                            })
                        })
                   }else{
                    res.send({message: "Email já existe"});
                   }
                }
            )
        })
});

module.exports = router;