const { Server } = require('socket.io');

let io; // Variável para armazenar a instância do Socket.IO

function createSocketServer(server) {
  io = new Server(server, {
    cors: {
        origin: 'https://nexboard.netlify.app/', // Atualize com a origem permitida do seu front-end
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
