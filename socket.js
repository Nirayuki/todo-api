const { Server } = require('socket.io');

let io; // Variável para armazenar a instância do Socket.IO

function createSocketServer(server) {
  io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Atualize com a origem permitida do seu front-end
        methods: ['GET', 'POST'],
      },
  });

  // Lógica do Socket.IO...

  return io;
}

function getSocketIOInstance() {
  return io;
}

module.exports = { createSocketServer, getSocketIOInstance };