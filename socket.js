const io = require('socket.io');
const axios = require('axios');

module.exports = (io, app) => {
  const io = io(server);
  app.set('io', io);

  io.on('connection', socket => {
    console.log('Connect from Client');

    socket.on('hello', data => {
      console.log('hello from Client: ' + data);
    });

    socket.on('chatRoom', payload => {
      // 클라이언트에게 메시지를 전송한다
      console.log('chatRoom');
      // socket.emit('newMessage', data);
    });

    socket.on('joinRoom', roomId => {
      console.log('--------joinRoom--------');

      socket.join(roomId);
      // io.to(roomId).emit('updateUsers', user);
      socket.emit('newMeesage', 'Hello Admin');
      socket.broadcast.to(roomId).emit('admin USER_NAME connected to chat');
    });

    socket.on('chat', payload => {
      const {roomId, msg} = payload;
      console.log(roomId);
      console.log('message from Client: ' + msg);

      socket.to(roomId).emit(msg);
      // 클라이언트에게 메시지를 전송한다
      socket.emit('newMessage', msg);
    });

    socket.on('createMessage', user => {
      // const user = db.User.findOne({where: user.id});

      if (user) {
        io.to(user.roomName).emit('newMessage');
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  });
};
