const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;
const { getSocketIOInstance } = require('../socket');



router.post('/', (req, res, next) => {

    const iduser = req.body.iduser;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT iduser, nome, email FROM user WHERE iduser = ?',
            iduser,
            (erorr, resultado, field) => {
                conn.release();

                if (error) {
                    res.send({ error: error });
                }

                if (resultado.length > 0) {
                    res.send(resultado);
                } else {
                    res.send("usuario não encontrado");
                }
            }
        )
    })
});

router.get('/teste', (req, res, next) => {
    const io = getSocketIOInstance();
    io.emit("teste", "teste");
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
                    res.send({ error: error });
                }

                if (resultado.length > 0) {
                    bcrypt.compare(senha, resultado[0].senha, (error, response) => {
                        if (response) {
                            res.status(201).send({
                                iduser: resultado[0].iduser,
                                nome: resultado[0].nome,
                                email: resultado[0].email
                            });
                        } else {
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

    var id;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM user WHERE email = ?',
            email,
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.send({ error: error });
                }

                if (resultado.length == 0) {
                    mysql.getConnection((error, conn) => {
                        bcrypt.hash(senha, saltRounds, (err, hash) => {

                            if (err) {
                                console.log(err);
                            }

                            conn.query(
                                'INSERT INTO user (nome, email, senha) VALUES (?, ?, ?)',
                                [nome, email, hash],
                                (error, result, field) => {
                                    conn.release();

                                    if (error) {
                                        res.sendStatus(500).send({
                                            error: error,
                                            response: null
                                        });
                                    }


                                    if (result) {
                                        id = result.insertId;
                                        mysql.getConnection((error, conn) => {
                                            conn.query(
                                                'SELECT iduser FROM user WHERE iduser = ?',
                                                id,
                                                (error, resu, field) => {
                                                    conn.release();

                                                    if (error) {
                                                        res.sendStatus(500).send({
                                                            error: error,
                                                            response: null
                                                        });
                                                    }

                                                    res.send(resu);
                                                }
                                            )
                                        })
                                    }

                                }
                            )
                        })
                    })
                } else {
                    res.send({ message: "Email já existe" });
                }
            }
        )
    })
});


router.post('/getuser', (req, res, next) => {
    const iduser = req.body.iduser;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM user WHERE iduser = ?',
            iduser,
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                if (resultado.length === 0) {
                    res.send("Usuário não encontrado");
                } else {
                    res.send(resultado[0]);
                }

            }
        )
    })
})


module.exports = router;


