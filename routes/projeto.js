const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
require('dotenv').config();

router.post('/add', (req, res, next) => {
    try {
        const { nome, iduser } = req.body;

        if (!nome || !iduser) {
            return res.status(401).json("Por favor, preencher o campo abaixo!");
        }

        if (nome.length > 300) {
            return res.status(401).json("O campo excedeu o limite de caracteres autorizado");
        }

        mysql.getConnection((error, conn) => {
            conn.query(
                'INSERT INTO projeto (nome, status, user_iduser) VALUES (?, "Em andamento", ?)',
                [nome, iduser],
                (error, resultado, field) => {
                    try {
                        if (resultado) {
                            return res.status(201).json({ message: 'Tarefa adicionada com sucesso!' });
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

router.post('/list', (req, res, next) => {
    try {
        const iduser = req.body.iduser;

        mysql.getConnection((error, conn) => {
            conn.query(
                "SELECT projeto.idprojeto as idprojeto, projeto.nome as nome, projeto.github as github, projeto.site as site, projeto.status as status, COUNT(tarefa.idtarefa) as total_tarefa, SUM(CASE WHEN tarefa.status = 'Concluido' THEN 1 ELSE 0 END) as total_tarefa_concluida FROM projeto LEFT JOIN tarefa ON projeto.idprojeto = tarefa.projeto_idprojeto WHERE projeto.user_iduser = ? group by idprojeto",
                iduser,
                (error, resultado, field) => {
                    try {
                        if (resultado) {
                            return res.status(200).json(resultado);
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

router.post('/getone', (req, res, next) => {
    try {
        const idprojeto = req.body.idprojeto;

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM projeto WHERE idprojeto = ?',
                idprojeto,
                (error, resultado, field) => {
                    try {
                        return res.status(200).json(resultado[0]);
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

router.post('/listTarefa/:idprojeto', (req, res, next) => {
    try {
        const idprojeto = req.params.idprojeto;
        let andamento = [];
        let tarefa = [];
        let concluido = [];

        mysql.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM tarefa WHERE projeto_idprojeto = ?',
                idprojeto,
                (error, resultado, field) => {
                    try {
                        resultado.forEach((e) => {
                            if (e.status === 'Em andamento') {
                                andamento.push({
                                    idtarefa: e.idtarefa,
                                    nome: e.nome,
                                    data: e.data,
                                    status: e.status,
                                    projeto_idprojeto: e.projeto_idprojeto,
                                    checklist_size: e.checklist_size,
                                    checklist_done: e.checklist_done,
                                });
                            } else if (e.status === 'Tarefa') {
                                tarefa.push({
                                    idtarefa: e.idtarefa,
                                    nome: e.nome,
                                    data: e.data,
                                    status: e.status,
                                    projeto_idprojeto: e.projeto_idprojeto,
                                    checklist_size: e.checklist_size,
                                    checklist_done: e.checklist_done,
                                });
                            } else if (e.status === 'Concluido') {
                                concluido.push({
                                    idtarefa: e.idtarefa,
                                    nome: e.nome,
                                    data: e.data,
                                    status: e.status,
                                    projeto_idprojeto: e.projeto_idprojeto,
                                    checklist_size: e.checklist_size,
                                    checklist_done: e.checklist_done,
                                });
                            }
                        });

                        const responseData = {
                            tarefa,
                            andamento,
                            concluido,
                        };

                        return res.status(200).json(responseData);
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

router.post('/tarefa', (req, res, next) => {
    try {
        let idTarefa;
        const { idprojeto, nome, date, checklist, status, checklist_size, checklist_done } = req.body;
        
        if (!nome || !date ) {
            return res.status(401).json("Por favor, preencher os campos abaixo!");
        }

        mysql.getConnection((error, conn) => {
            conn.query(
                'INSERT INTO tarefa (nome, status, data, projeto_idprojeto, checklist_size, checklist_done) VALUES (?, ?, ?, ?, ?, ?) ',
                [nome, status, date, idprojeto, checklist_size, checklist_done],
                (error, resultado, field) => {
                    try {
                        idTarefa = resultado?.insertId;

                        mysql.getConnection((error, conn) => {
                            checklist.map((e) => {
                                conn.query(
                                    'INSERT INTO checklist (nome, status, tarefa_idtarefa) VALUES (?, false, ?)',
                                    [e.nome, idTarefa],
                                    (error, resultado, field) => {
                                        conn.release();

                                        if (error) {
                                           return res.status(500).send({
                                                error: error,
                                                response: null
                                            });
                                        }
                                    }
                                )
                            })
                        })
                        return res.status(201).json({ message: 'Tarefa adicionada com sucesso!' });
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

router.post('/projetoChangeStatus/:iduser', (req, res, next) => {
    try {
        const iduser = req.params.iduser;
        const idprojeto = req.body.idprojeto;
        const status = req.body.status;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE projeto SET status = ? WHERE idprojeto = ?',
                [status, idprojeto],
                (error, resultado, field) => {
                    try {
                        return res.status(200).json("Status Atualizado com sucesso!");
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

router.post('/delete', (req, res, next) => {
    try {
        const idprojeto = req.body.idprojeto;

        mysql.getConnection((error, conn) => {
            conn.query(
                'DELETE FROM projeto WHERE idprojeto = ?',
                idprojeto,
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                       return res.status(500).send({
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

router.post('/update', (req, res, next) => {
    try {
        const nome = req.body.nome;
        const github = req.body.github;
        const site = req.body.site;
        const idprojeto = req.body.idprojeto;

        mysql.getConnection((error, conn) => {
            conn.query(
                'UPDATE projeto SET nome = ?, github = ?, site = ? WHERE idprojeto = ?',
                [nome, github, site, idprojeto],
                (error, resultado, field) => {
                    conn.release();

                    if (error) {
                       return res.status(500).send({
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


module.exports = router;
