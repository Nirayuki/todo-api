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

router.post('/getone', (req, res, next) => {
    const idprojeto = req.body.idprojeto;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM projeto WHERE idprojeto = ?',
            idprojeto,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send(resultado[0]);
            }
        )
    })
})

router.post('/getonetarefa', (req, res, next) => {
    const idprojeto = req.body.idprojeto;
    let andamento = [];
    let tarefa = [];
    let concluido = [];

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM tarefa WHERE projeto_idprojeto = ?',
            idprojeto,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                resultado.map((e) =>{
                    if(e.status === "Em andamento"){
                        andamento = [...andamento, {
                            idtarefa: e.idtarefa,
                            nome: e.nome,
                            data: e.data,
                            status: e.status,
                            observacao: e.observacao,
                            projeto_idprojeto: e.projeto_idprojeto
                        }]
                    }

                    if(e.status === "Tarefa"){
                        tarefa = [...tarefa, {
                            idtarefa: e.idtarefa,
                            nome: e.nome,
                            data: e.data,
                            status: e.status,
                            observacao: e.observacao,
                            projeto_idprojeto: e.projeto_idprojeto
                        }]
                    }

                    if(e.status === "Concluido"){
                        concluido = [...concluido, {
                            idtarefa: e.idtarefa,
                            nome: e.nome,
                            data: e.data,
                            status: e.status,
                            observacao: e.observacao,
                            projeto_idprojeto: e.projeto_idprojeto
                        }]
                    }
                })

                res.send({tarefa: tarefa, andamento: andamento, concluido: concluido})
            }
        )
    })
})

router.post('/tarefa', (req, res, next) => {
    let idTarefa;
    const idprojeto = req.body.idprojeto;
    const nome = req.body.nome;
    const date = req.body.date;
    const checklist = req.body.checklist;
    const status = req.body.status;

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO tarefa (nome, status, data, projeto_idprojeto) VALUES (?, ?, ?, ?) ',
            [nome, status, date, idprojeto],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                idTarefa = resultado?.insertId;

                mysql.getConnection((error, conn) => {
                    checklist.map((e) => {
                        conn.query(
                            'INSERT INTO checklist (nome, status, tarefa_idtarefa) VALUES (?, false, ?)',
                            [e.nome, idTarefa],
                            (error, resultado, field) => {
                                conn.release();

                                if(error){
                                    res.status(500).send({
                                        error: error,
                                        response: null
                                    });
                                }
                            }
                        )
                    }) 
                })   
                
                res.send("Tarefa criado com sucesso!");
                       
            }
        )
    })
})

module.exports = router;