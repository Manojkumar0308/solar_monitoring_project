const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected',socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected',socket.id);
    });
  });
};

const emitLogin = (data) => {
  if (io) {
    io.emit('login', data);
  }
};

module.exports = { initSocket, emitLogin };
