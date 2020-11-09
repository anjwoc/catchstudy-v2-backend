const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server);
  app.set('io', io);

  const room = io.of('./room');
  const chat = io.of('./chat');

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', socket => {
    console.log('Room namespace connected');
    socket.on('disconnection', () => {});
  });

  chat.on('connection', socket => {
    console.log('chat namespace connected');
    const req = socket.request;
    const {
      headers: {referer},
    } = req;
    console.log(referer);
    const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
    console.log(roomId);
    socket.join(roomId);

    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnection', () => {
      console.log('chat namespace disconnection');
      socket.leave(roomId);

      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;

      if (userCount === 0) {
        axios
          .delete(`http://localhost:3000/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color} 님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};
