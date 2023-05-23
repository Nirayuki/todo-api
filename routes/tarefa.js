const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
require('dotenv').config();

router.post('/delete', (req, res, next) => {
    const idtarefa = req.body.idtarefa;

    mysql.getConnection((error, conn) => {
        conn.query(
            'DELETE FROM tarefa WHERE idtarefa = ?',
            idtarefa,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send("Deletado com sucesso!");
            }
        )
    })
})

router.post('/getTarefa', (req, res, next) => {
    const idtarefa = req.body.idtarefa;
    var tarefa;

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM tarefa WHERE idtarefa = ?',
            idtarefa,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                tarefa = resultado;

                mysql.getConnection((error, conn) => {
                    conn.query(
                        'SELECT * FROM checklist WHERE tarefa_idtarefa = ?',
                        idtarefa,
                        (error, resultadoCheck, field) => {
                            conn.release();

                            if(error){
                                res.status(500).send({
                                    eror: error,
                                    response: null
                                })
                            }
                            
                            mysql.getConnection((error, conn) => {
                                conn.query(
                                    'SELECT * FROM observacao WHERE tarefa_idtarefa = ?',
                                    idtarefa,
                                    (error, resultadoObs, field) => {
                                        conn.release();
            
                                        if(error){
                                            res.status(500).send({
                                                error: error,
                                                response: null
                                            })
                                        }
                                        res.send({tarefa: resultado, checklist: resultadoCheck, observacao: resultadoObs});
                                    }
                                )
                            })
                        }
                    )
                })

            }
        )
    })
})

router.post('/tarefaChangeStatus', (req, res, next) => {
    const idtarefa = req.body.idtarefa;
    const status = req.body.status;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE tarefa SET status = ? WHERE idtarefa = ?',
            [status, idtarefa],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send("Status Atualizado com sucesso!");
            }
        )
    })
})

router.post('/updateDate', (req, res, next) => {
    const idtarefa = req.body.idtarefa;
    const date = req.body.date;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE tarefa SET data = ? WHERE idtarefa = ?',
            [date, idtarefa],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send("Date Atualizado com sucesso!");
            }
        )
    })
})

router.post('/updateNome', (req, res, next) => {
    const idtarefa = req.body.idtarefa;
    const nome = req.body.nome;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE tarefa SET nome = ? WHERE idtarefa = ?',
            [nome, idtarefa],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send("Date Atualizado com sucesso!");
            }
        )
    })
})


router.post('/updateCheckStatus', (req, res, next) => {
    const status = req.body.status;
    const idchecklist = req.body.idchecklist;
    const checklist_size = req.body.checklist_size;
    const checklist_done = req.body.checklist_done;
    const idtarefa = req.body.idtarefa;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE checklist SET status = ? WHERE idchecklist = ?;',
            [status, idchecklist],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                if(status === false){
                    const updateCheck = checklist_done - 1;
                    mysql.getConnection((error, conn) => {
                        conn.query(
                            'UPDATE tarefa SET checklist_done = ? WHERE idtarefa = ?',
                            [updateCheck, idtarefa],
                            (error, resultado, field) => {
                                conn.release();

                                if(error){
                                    res.status(500).send({
                                        error: error,
                                        response: null
                                    });
                                }

                                res.send("Status Atualizado com sucesso!");
                            }
                        )
                    })
                    
                }else{
                    const updateCheck = checklist_done + 1;
                    mysql.getConnection((error, conn) => {
                        conn.query(
                            'UPDATE tarefa SET checklist_done = ? WHERE idtarefa = ?',
                            [updateCheck, idtarefa],
                            (error, resultado, field) => {
                                conn.release();

                                if(error){
                                    res.status(500).send({
                                        error: error,
                                        response: null
                                    });
                                }

                                res.send("Status Atualizado com sucesso!");
                            }
                        )
                    })
                }
            }
        )
    })
})

router.post('/updateCheckNome', (req, res, next) => {
    const idchecklist = req.body.idchecklist;
    const nome = req.body.nome;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE checklist SET nome = ? WHERE idchecklist = ?',
            [nome, idchecklist],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.send("Nome Atualizado com sucesso!");
            }
        )
    })
})

router.post('/deleteCheck', (req, res, next) => {
    const idchecklist = req.body.idchecklist;
    const idtarefa = req.body.idtarefa;
    const checklist_size = req.body.checklist_size;

    mysql.getConnection((error, conn) => {
        conn.query(
            'DELETE FROM checklist WHERE idchecklist = ?',
            idchecklist,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                mysql.getConnection((error, conn) => {
                    conn.query(
                        'UPDATE tarefa SET checklist_size = ? WHERE idtarefa = ?',
                        [checklist_size - 1, idtarefa],
                        (error, result, field) => {
                            conn.release();
                            
                            if(error){
                                res.status(500).send({
                                    error: error,
                                    response: null
                                });
                            }

                            res.send("Deletado com sucesso");
                        }
                    )
                })
            }
        )
    })
})

router.post('/addObservacao', (req, res, next) => {
    const observacao = req.body.observacao;
    const idtarefa = req.body.idtarefa;

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO observacao (observacao, tarefa_idtarefa) VALUES (?, ?)',
            [observacao, idtarefa],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                res.send("Observação adicionada com sucesso!");
               
            }
        )
    })
})

router.post('/deleteObservacao', (req, res, next) => {
    const idobservacao = req.body.idobservacao;

    mysql.getConnection((error, conn) => {
        conn.query(
            'DELETE FROM observacao WHERE idobservacao = ?',
            idobservacao,
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                res.send("Observação deletada com sucesso");
               
            }
        )
    })
})

router.post('/updateObservacao', (req, res, next) => {
    const observacao = req.body.observacao;
    const idobservacao = req.body.idobservacao;

    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE observacao SET observacao = ? WHERE idobservacao = ?',
            [observacao, idobservacao],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                res.send("Observação editada com sucesso");
               
            }
        )
    })
})


router.post('/addCheck', (req, res, next) => {
    const nome = req.body.nome;
    const idtarefa = req.body.idtarefa;
    const checklist_size = req.body.checklist_size;

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO checklist (nome, status, tarefa_idtarefa) VALUES (?, false, ?)',
            [nome, idtarefa],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                
                mysql.getConnection((error, conn) => {
                    conn.query(
                        'UPDATE tarefa SET checklist_size = ? WHERE idtarefa = ?',
                        [checklist_size + 1, idtarefa],
                        (error, result, field) => {
                            conn.release();

                            if(error){
                                res.status(500).send({
                                    error: error,
                                    response: null
                                });
                            }

                            res.send("Check adicionado com sucesso");
                        }
                    )
                })
               
            }
        )
    })
})

module.exports = router;