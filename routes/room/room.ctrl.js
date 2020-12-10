const db = require('../../models');

exports.loadRooms = async (req, res, next) => {
  try {
    const rooms = await db.Room.findAll();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    // 접속 유저와 일치하는지 검사
    const user = await db.User.findOne({where: req.body.userId});
    const newRoom = await db.Room.create({
      title: req.body.title,
      owner: user.name,
    });
    await user.addRoom(newRoom);
    const roomId = newRoom.title;
    // const io = req.app.get('io');
    // const roomId = newRoom.title;
    // io.to(roomId).emit('joinRoom', {user, newRoom});
    // res.redirect(`http://localhost:3000/chat/${roomId}`);
    res.json({user, roomId});
  } catch (err) {
    console.error(err);
    next(error);
  }
};

exports.removeRoom = async (req, res, next) => {
  try {
    await db.Room.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send('삭제 성공');
  } catch (err) {
    console.error(err);
    next(error);
  }
};
