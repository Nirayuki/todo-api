require('dotenv').config();
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const { createSocketServer } = require('./socket');
const io = createSocketServer(server);
const mysql = require('./mysql').pool;


io.on('connection', (socket) => {
  socket.on('att-list-tarefa', (data) => {
    let andamento = [];
    let tarefa = [];
    let concluido = [];

    mysql.getConnection((error, conn) => {
      conn.query(
        'SELECT * FROM tarefa WHERE projeto_idprojeto = ?',
        data,
        (error, resultado, field) => {
          conn.release();

          if (error) {
            res.status(500).send({
              error: error,
              response: null
            });
          }

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

          socket.emit('list-tarefa-newData', responseData);
        }
      )
    })
  })

  socket.on('att-list-projeto', (data) => {
    mysql.getConnection((error, conn) => {
      conn.query(
        'SELECT * FROM projeto WHERE idprojeto = ?',
        data,
        (error, resultado, field) => {
          conn.release();

          if (error) {
            res.status(500).send({
              error: error,
              response: null
            });
          }
          socket.emit('list-projeto-newData', resultado[0]);
        }
      )
    })
  })

  socket.on('att-list-tarefaView', (data) => {
    mysql.getConnection((error, conn) => {
      conn.query(
        'SELECT * FROM tarefa WHERE idtarefa = ?',
        data,
        (error, resultado, field) => {
          conn.release();

          if (error) {
            res.status(500).send({
              error: error,
              response: null
            });
          }
          mysql.getConnection((error, conn) => {
            conn.query(
              'SELECT * FROM checklist WHERE tarefa_idtarefa = ?',
              data,
              (error, resultadoCheck, field) => {
                conn.release();

                if (error) {
                  res.status(500).send({
                    eror: error,
                    response: null
                  })
                }

                mysql.getConnection((error, conn) => {
                  conn.query(
                    'SELECT * FROM observacao WHERE tarefa_idtarefa = ?',
                    data,
                    (error, resultadoObs, field) => {
                      conn.release();

                      if (error) {
                        res.status(500).send({
                          error: error,
                          response: null
                        })
                      }
                      socket.emit('list-tarefaView-newData', { tarefa: resultado, checklist: resultadoCheck, observacao: resultadoObs });
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


  socket.on('list-main', (data) => {
    mysql.getConnection((error, conn) => {
      conn.query(
        "SELECT projeto.idprojeto as idprojeto, projeto.nome as nome, projeto.github as github, projeto.site as site, projeto.status as status, COUNT(tarefa.idtarefa) as total_tarefa, SUM(CASE WHEN tarefa.status = 'Concluido' THEN 1 ELSE 0 END) as total_tarefa_concluida FROM projeto LEFT JOIN tarefa ON projeto.idprojeto = tarefa.projeto_idprojeto WHERE projeto.user_iduser = ? group by idprojeto",
        data,
        (error, resultado, field) => {
          conn.release();

          if (error) {
            res.status(500).send({
              error: error,
              response: null
            });
          }
          socket.emit('list-main-newData', resultado);
        }
      )
    })
  })

  // Evento quando o cliente desconectar
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Lógica de desconexão do WebSocket...
  });
});
// Importar e configurar o módulo socket.io


server.listen(port);

