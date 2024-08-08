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

const emitNotification = (data) =>{
    if(io){
        io.emit('notification',data);
    }
}

const emitSensorData = (data) => {
  if(io){
    io.emit('sendSensorData',data)
  }
}

module.exports = { initSocket, emitLogin,emitNotification,emitSensorData };
