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
    const newRoom = await db.Room.create({
      title: req.body.title,
      maxNumber: req.body.maxNumber,
      owner: req.body.owner,
      password: req.body.owner,
    });
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom.id}?password=${req.body.password}`);
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
