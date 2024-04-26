const http = require('http');
const { Server } = require('socket.io');
const _ = require('underscore');
const wordExists = require('word-exists');

let io;
const tileSet = [];
const lonelyRooms = [];

const generateRoomKey = (keyLength = 6) => {
  const set = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let newKey = '';

  for (let i = 0; i < keyLength; i++) {
    newKey += set[_.random(0, set.length - 1)];
  }

  return newKey;
};

const fillTileSet = () => {
  const tileDistributions = {
    A: 9,
    B: 2,
    C: 2,
    D: 4,
    E: 12,
    F: 2,
    G: 3,
    H: 2,
    I: 9,
    J: 1,
    K: 1,
    L: 4,
    M: 2,
    N: 6,
    O: 8,
    P: 2,
    Q: 1,
    R: 6,
    S: 4,
    T: 6,
    U: 4,
    V: 2,
    W: 2,
    X: 1,
    Y: 2,
    Z: 1,
  };

  const keys = Object.keys(tileDistributions);

  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < tileDistributions[keys[i]]; j++) {
      tileSet.push(keys[i]);
    }
  }
};

const drawPlayerLetters = (amount = 10) => {
  const drawnLetters = [];

  for (let i = 0; i < amount; i++) {
    drawnLetters.push(tileSet[_.random(0, tileSet.length - 1)]);
  }

  return drawnLetters;
};

// const handleChatMessage = (socket, msg) => {
//     socket.rooms.forEach(room => {
//         if (room === socket.id) return;
//         io.to(room).emit('chat message', msg);
//     })
// };

const leaveAllRooms = (socket) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;
    socket.leave(room);
  });
};

const handleRoomChange = (socket, roomName) => {
  leaveAllRooms(socket);

  socket.join(roomName);
};

const socketSetup = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.engine.use(sessionMiddleware);

  fillTileSet();

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    // socket.on('chat message', (msg) => handleChatMessage(socket, msg));
    socket.on('join game', async (gameKey) => {
      handleRoomChange(socket, gameKey);

      console.log(socket.request.session.account.username, 'has joined a game');

      // io.to(gameKey)
      // .emit('player joined', { username: socket.request.session.account.username });
      const sockets = await io.in(gameKey).fetchSockets();
      if (sockets.length === 2) {
        sockets[0].emit(
          'start game',
          {
            playerUsername: sockets[0].request.session.account.username,
            enemyUsername: sockets[1].request.session.account.username,
            drawnLetters: drawPlayerLetters(),
          },
        );
        sockets[1].emit(
          'start game',
          {
            playerUsername: sockets[1].request.session.account.username,
            enemyUsername: sockets[0].request.session.account.username,
            drawnLetters: drawPlayerLetters(),
          },
        );
      }

      console.log(sockets);
      console.log('Num players in room', sockets.length);
    });

    socket.on('host game', () => {
      console.log('host game called.');
      let gameKey;
      do {
        gameKey = generateRoomKey();
        console.log('game key generated.');
      } while (socket.rooms[gameKey]);

      handleRoomChange(socket, gameKey);

      socket.emit('game key', gameKey);
      console.log('game key emitted');
    });

    socket.on('join matchmade game', () => {
      let gameKey;

      if (lonelyRooms.length === 0) {
        do {
          gameKey = generateRoomKey();
          console.log('game key generated.');
        } while (socket.rooms[gameKey]);
        handleRoomChange(socket, gameKey);
        lonelyRooms.push(gameKey);
      } else {
        handleRoomChange(socket, lonelyRooms.pop());
      }
    });

    socket.on('check word exists', (word) => {
      socket.emit('check word exists', wordExists(word));
    });
  });

  return server;
};

module.exports = socketSetup;
