const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
require('dotenv').config();

router.post(`/delete/:idprojeto`, (req, res, next) => {
    try {
        const idprojeto = req.params.idprojeto;
        const idtarefa = req.body.idtarefa;

        mysql.getConnection((error, conn) => {
            conn.query(
                'DELETE FROM tarefa WHERE idtarefa = ?',
                idtarefa,
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    return res.status(200).json("Deletado com sucesso!");
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
})

router.post('/getTarefa/:idtarefa', (req, res, next) => {
    try {
        const idtarefa = req.params.idtarefa;
        var tarefa;

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM tarefa WHERE idtarefa = ?',
                idtarefa,
                (error, resultado, field) => {
                    try {
                        tarefa = resultado;

                        mysql.getConnection((error, conn) => {
                            conn.query(
                                'SELECT * FROM checklist WHERE tarefa_idtarefa = ?',
                                idtarefa,
                                (error, resultadoCheck, field) => {
                                    try {
                                        mysql.getConnection((error, conn) => {
                                            conn.query(
                                                'SELECT * FROM observacao WHERE tarefa_idtarefa = ?',
                                                idtarefa,
                                                (error, resultadoObs, field) => {
                                                    conn.release();

                                                    if (error) {
                                                        return res.status(500).send({
                                                            error: error,
                                                            response: null
                                                        })
                                                    }
                                                    return res.status(200).json({ tarefa: resultado, checklist: resultadoCheck, observacao: resultadoObs });
                                                }
                                            )
                                        })
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

router.post('/tarefaChangeStatus', (req, res, next) => {
    try {
        const idtarefa = req.body.idtarefa;
        const status = req.body.status;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE tarefa SET status = ? WHERE idtarefa = ?',
                [status, idtarefa],
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                    }

                    return res.status(200).json("Status Atualizado com sucesso!");
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
})

router.post('/updateDate/:idtarefa', (req, res, next) => {
    try {
        const idtarefa = req.params.idtarefa;
        const date = req.body.date;
        const idprojeto = req.body.idprojeto;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE tarefa SET data = ? WHERE idtarefa = ?',
                [date, idtarefa],
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    res.send("Date Atualizado com sucesso!");
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
})

router.post('/updateNome/:idtarefa', (req, res, next) => {
    try {
        const idtarefa = req.params.idtarefa;
        const nome = req.body.nome;
        const idprojeto = req.body.idprojeto;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE tarefa SET nome = ? WHERE idtarefa = ?',
                [nome, idtarefa],
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    return res.status(200).json("Date Atualizado com sucesso!");
                }
            )
        })
    } catch (error) {
        console.error('Erro no processamento da rota:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
})


router.post('/updateCheckStatus/:idtarefa', (req, res, next) => {
    try {
        const status = req.body.status;
        const idchecklist = req.body.idchecklist;
        const checklist_size = req.body.checklist_size;
        const checklist_done = req.body.checklist_done;
        const idtarefa = req.params.idtarefa;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE checklist SET status = ? WHERE idchecklist = ?;',
                [status, idchecklist],
                (error, resultado, field) => {
                    try {
                        if (status === false) {
                            const updateCheck = checklist_done - 1;
                            mysql.getConnection((error, conn) => {
                                conn.query(
                                    'UPDATE tarefa SET checklist_done = ? WHERE idtarefa = ?',
                                    [updateCheck, idtarefa],
                                    (error, resultado, field) => {
                                        conn.release();

                                        if (error) {
                                            res.status(500).send({
                                                error: error,
                                                response: null
                                            });
                                        }
                                        res.send("Status Atualizado com sucesso!");
                                    }
                                )
                            })

                        } else {
                            const updateCheck = checklist_done + 1;
                            mysql.getConnection((error, conn) => {
                                conn.query(
                                    'UPDATE tarefa SET checklist_done = ? WHERE idtarefa = ?',
                                    [updateCheck, idtarefa],
                                    (error, resultado, field) => {
                                        conn.release();

                                        if (error) {
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

router.post('/updateCheckNome/:idtarefa', (req, res, next) => {
    try {
        const idtarefa = req.params.idtarefa;
        const idchecklist = req.body.idchecklist;
        const nome = req.body.nome;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE checklist SET nome = ? WHERE idchecklist = ?',
                [nome, idchecklist],
                (error, resultado, field) => {
                    try {
                        res.send("Nome Atualizado com sucesso!");
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

router.post('/deleteCheck/:idtarefa', (req, res, next) => {
    try {
        const idchecklist = req.body.idchecklist;
        const idtarefa = req.params.idtarefa;
        const checklist_size = req.body.checklist_size;

        mysql.getConnection((error, conn) => {
            conn.query(
                'DELETE FROM checklist WHERE idchecklist = ?',
                idchecklist,
                (error, resultado, field) => {
                    try {
                        mysql.getConnection((error, conn) => {
                            conn.query(
                                'UPDATE tarefa SET checklist_size = ? WHERE idtarefa = ?',
                                [checklist_size - 1, idtarefa],
                                (error, result, field) => {
                                    try {
                                        return res.send("Deletado com sucesso");
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

router.post('/addObservacao/:idtarefa', (req, res, next) => {
    try {
        const observacao = req.body.observacao;
        const idtarefa = req.params.idtarefa;

        mysql.getConnection((error, conn) => {
            conn.query(
                'INSERT INTO observacao (observacao, tarefa_idtarefa) VALUES (?, ?)',
                [observacao, idtarefa],
                (error, resultado, field) => {
                    try {
                        res.send("Observação adicionada com sucesso!");
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

router.post('/deleteObservacao', (req, res, next) => {
    try {
        const idobservacao = req.body.idobservacao;

        mysql.getConnection((error, conn) => {
            conn.query(
                'DELETE FROM observacao WHERE idobservacao = ?',
                idobservacao,
                (error, resultado, field) => {
                    try {
                        return res.send("Observação deletada com sucesso");
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

router.post('/updateObservacao', (req, res, next) => {
    try {
        const observacao = req.body.observacao;
        const idobservacao = req.body.idobservacao;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE observacao SET observacao = ? WHERE idobservacao = ?',
                [observacao, idobservacao],
                (error, resultado, field) => {
                    try {
                        return res.send("Observação editada com sucesso");
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


router.post('/addCheck', (req, res, next) => {
    try {
        const nome = req.body.nome;
        const idtarefa = req.body.idtarefa;
        const checklist_size = req.body.checklist_size;

        mysql.getConnection((error, conn) => {
            conn.query(
                'INSERT INTO checklist (nome, status, tarefa_idtarefa) VALUES (?, false, ?)',
                [nome, idtarefa],
                (error, resultado, field) => {
                    try {
                        mysql.getConnection((error, conn) => {
                            conn.query(
                                'UPDATE tarefa SET checklist_size = ? WHERE idtarefa = ?',
                                [checklist_size + 1, idtarefa],
                                (error, result, field) => {
                                    try {

                                        return res.send("Check adicionado com sucesso");
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
