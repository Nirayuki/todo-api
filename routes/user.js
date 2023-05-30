const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;



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
    res.send("acessou");
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        // Validação de entrada
        if (!email || !senha) {
            return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
        }

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM user WHERE email = ?;', [email],
                (error, resultado, field) => {
                    try {
                        if (resultado.length > 0) {
                            bcrypt.compare(senha, resultado[0].senha, (error, response) => {
                                if (response) {
                                    return res.status(201).json({
                                        iduser: resultado[0].iduser,
                                        nome: resultado[0].nome,
                                        email: resultado[0].email
                                    });
                                } else {
                                    return res.status(401).json({ erro: 'Credenciais inválidas.' });
                                }
                            })
                        } else {
                            return res.status(401).json({ erro: 'Usuário não encontrado.' });
                        }
                    } catch (error) {
                        console.error('Erro na consulta SQL:', error);
                        return res.status(500).json({ erro: 'Erro interno do servidor.' });
                    } finally {
                        conn.release();
                    }
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});


router.post('/register', (req, res, next) => {
    try {
        var id;

        const { nome, email, senha } = req.body;

        if (!email || !nome || !senha) {
            return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
        }

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM user WHERE email = ?',
                email,
                (error, resultado, field) => {
                    try {
                        if (resultado.length == 0) {
                            mysql.getConnection((error, conn) => {
                                bcrypt.hash(senha, saltRounds, (err, hash) => {
                                    conn.query(
                                        'INSERT INTO user (nome, email, senha) VALUES (?, ?, ?)',
                                        [nome, email, hash],
                                        (error, result, field) => {
                                            try {
                                                if (result) {
                                                    id = result.insertId;
                                                    mysql.getConnection((error, conn) => {
                                                        conn.query(
                                                            'SELECT iduser FROM user WHERE iduser = ?',
                                                            id,
                                                            (error, resu, field) => {
                                                                try {
                                                                    return res.status(201).json(resu);
                                                                } catch (error) {
                                                                    console.error('Erro na consulta SQL:', error);
                                                                    return res.status(500).json({ erro: 'Erro interno do servidor.' });
                                                                } finally {
                                                                    conn.release();
                                                                }
                                                            }
                                                        )
                                                    })
                                                }
                                            } catch (error) {
                                                console.error('Erro na consulta SQL:', error);
                                                return res.status(500).json({ erro: 'Erro interno do servidor.' });
                                            } finally {
                                                conn.release();
                                            }
                                        }
                                    )
                                })
                            })
                        } else {
                            return res.status(401).json({ erro: 'Email já existe' });
                        }
                    } catch (error) {
                        console.error('Erro na consulta SQL:', error);
                        return res.status(500).json({ erro: 'Erro interno do servidor.' });
                    } finally {
                        conn.release();
                    }
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});


router.post('/getuser', (req, res, next) => {
    try {
        const iduser = req.body.iduser;

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM user WHERE iduser = ?',
                iduser,
                (error, resultado, field) => {
                    try {
                        if (resultado.length === 0) {
                            return res.status(400).json("Usuário não encontrado");
                        } else {
                            return res.status(200).json(resultado[0]);
                        }
                    } catch (error) {
                        console.error('Erro na consulta SQL:', error);
                        return res.status(500).json({ erro: 'Erro interno do servidor.' });
                    } finally {
                        conn.release();
                    }
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
})


module.exports = router;


