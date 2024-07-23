const http = require('http');
const { Server } = require('socket.io');
const _ = require('underscore');
const wordExists = require('word-exists');

let io;
const tileSet = [];
const lonelyRooms = [];
const gameRoomsState = {};

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

const scoreWord = (word) => {
  const tileValues = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10,
  };

  let score = 0;

  for (let i = 0; i < word.length; i++) {
    score += tileValues[word[i]];
  }

  return score;
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

    socket.on('disconnecting', () => {
      socket.rooms.forEach(async (room) => {
        if (room !== socket.id) {
          const socketsInRoom = await io.in(room).fetchSockets();
          if (socketsInRoom.length === 1 && gameRoomsState[room]) {
            console.log('Deleting', room, 'from gameRoomState');
            delete gameRoomsState[room];
          }
        }
      });
    });

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
        gameRoomsState[gameKey] = {
          players: [{
            username: sockets[0].request.session.account.username,
            health: 25,
            lastPlayedWord: null,
            longestWord: null,
            highestScoredWord: null,
          }, {
            username: sockets[1].request.session.account.username,
            health: 25,
            lastPlayedWord: null,
            longestWord: null,
            highestScoredWord: null,
          }],
        };

        sockets[0].emit(
          'start game',
          {
            playerAvatar: sockets[0].request.session.account.avatars[0],
            playerUsername: sockets[0].request.session.account.username,
            playerTileColor: sockets[0].request.session.account.tileColor[0],
            enemyAvatar: sockets[1].request.session.account.avatars[0],
            enemyUsername: sockets[1].request.session.account.username,
            drawnLetters: drawPlayerLetters(),
          },
        );
        sockets[1].emit(
          'start game',
          {
            playerAvatar: sockets[1].request.session.account.avatars[0],
            playerUsername: sockets[1].request.session.account.username,
            playerTileColor: sockets[1].request.session.account.tileColor[0],
            enemyAvatar: sockets[0].request.session.account.avatars[0],
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

    socket.on('join matchmade game', async () => {
      let gameKey;

      if (lonelyRooms.length === 0) {
        do {
          gameKey = generateRoomKey();
          console.log('game key generated.');
        } while (socket.rooms[gameKey]);
        handleRoomChange(socket, gameKey);
        lonelyRooms.push(gameKey);
      } else {
        gameKey = lonelyRooms.pop();
        handleRoomChange(socket, gameKey);

        const sockets = await io.in(gameKey).fetchSockets();
        if (sockets.length === 2) {
          gameRoomsState[gameKey] = {
            players: [{
              username: sockets[0].request.session.account.username,
              health: 25,
              lastPlayedWord: null,
              longestWord: null,
              highestScoredWord: null,
            }, {
              username: sockets[1].request.session.account.username,
              health: 25,
              lastPlayedWord: null,
              longestWord: null,
              highestScoredWord: null,
            }],
          };

          sockets[0].emit(
            'start game',
            {
              playerAvatar: sockets[0].request.session.account.avatars[0],
              playerUsername: sockets[0].request.session.account.username,
              playerTileColor: sockets[0].request.session.account.tileColor[0],
              enemyAvatar: sockets[1].request.session.account.avatars[0],
              enemyUsername: sockets[1].request.session.account.username,
              drawnLetters: drawPlayerLetters(),
            },
          );
          sockets[1].emit(
            'start game',
            {
              playerAvatar: sockets[1].request.session.account.avatars[0],
              playerUsername: sockets[1].request.session.account.username,
              playerTileColor: sockets[1].request.session.account.tileColor[0],
              enemyAvatar: sockets[0].request.session.account.avatars[0],
              enemyUsername: sockets[0].request.session.account.username,
              drawnLetters: drawPlayerLetters(),
            },
          );
        }
      }
    });

    socket.on('check word exists', (word) => {
      socket.emit('check word exists', { word, isWord: wordExists(word), points: scoreWord(word) });
    });

    socket.on('play word', (word) => {
      socket.rooms.forEach(async (room) => {
        if (room === socket.id) return;

        let playerNum;
        if (gameRoomsState[room].players[0].username
          === socket.request.session.account.username) {
          playerNum = 0;
        }
        if (gameRoomsState[room].players[1].username
          === socket.request.session.account.username) {
          playerNum = 1;
        }

        gameRoomsState[room].players[playerNum].lastPlayedWord = word;

        socket.to(room).emit('opponent played word');

        if (!gameRoomsState[room].players[0].lastPlayedWord
          || !gameRoomsState[room].players[1].lastPlayedWord) return;

        const sockets = await io.in(room).fetchSockets();

        const player0Score = scoreWord(gameRoomsState[room].players[0].lastPlayedWord);
        const player1Score = scoreWord(gameRoomsState[room].players[1].lastPlayedWord);

        gameRoomsState[room].players[0].health -= player1Score;
        gameRoomsState[room].players[1].health -= player0Score;

        const player0RoundInfo = {
          playerHealth: gameRoomsState[room].players[0].health,
          enemyHealth: gameRoomsState[room].players[1].health,
          playerPlayed: gameRoomsState[room].players[0].lastPlayedWord,
          enemyPlayed: gameRoomsState[room].players[1].lastPlayedWord,
          playerPoints: player0Score,
          enemyPoints: player1Score,
          newLetters: drawPlayerLetters(),
        };
        const player1RoundInfo = {
          playerHealth: gameRoomsState[room].players[1].health,
          enemyHealth: gameRoomsState[room].players[0].health,
          playerPlayed: gameRoomsState[room].players[1].lastPlayedWord,
          enemyPlayed: gameRoomsState[room].players[0].lastPlayedWord,
          playerPoints: player1Score,
          enemyPoints: player0Score,
          newLetters: drawPlayerLetters(),
        };

        if (sockets[0].request.session.account.username
          === gameRoomsState[room].players[0].username) {
          sockets[0].emit('round end', player0RoundInfo);
          sockets[1].emit('round end', player1RoundInfo);
        } else if (sockets[0].request.session.account.username
          === gameRoomsState[room].players[1].username) {
          sockets[0].emit('round end', player1RoundInfo);
          sockets[1].emit('round end', player0RoundInfo);
        }

        if (gameRoomsState[room].players[0].health <= 0
          || gameRoomsState[room].players[1].health <= 0) {
          console.log('Deciding winner');
          let player0Result = '';
          let player1Result = '';

          if (gameRoomsState[room].players[0].health <= 0
            && gameRoomsState[room].players[1].health <= 0) {
            player0Result = 'draw';
            player1Result = 'draw';
          } else if (gameRoomsState[room].players[0].health <= 0) {
            player0Result = 'lose';
            player1Result = 'win';
          } else if (gameRoomsState[room].players[1].health <= 0) {
            player0Result = 'win';
            player1Result = 'lose';
          }

          if (sockets[0].request.session.account.username
            === gameRoomsState[room].players[0].username) {
            sockets[0].emit('game end', {
              result: player0Result,
            });
            sockets[1].emit('game end', {
              result: player1Result,
            });
          } else if (sockets[0].request.session.account.username
            === gameRoomsState[room].players[1].username) {
            sockets[0].emit('game end', {
              result: player1Result,
            });
            sockets[1].emit('game end', {
              result: player0Result,
            });
          }
        }

        gameRoomsState[room].players[0].lastPlayedWord = null;
        gameRoomsState[room].players[1].lastPlayedWord = null;
      });
    });
  });

  return server;
};

module.exports = socketSetup;
