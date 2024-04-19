const http = require('http');
const { Server } = require('socket.io');
const _ = require('underscore');

let io;

const generateRoomKey = (keyLength = 6) => {
    const set = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let newKey = '';

    for (let i = 0; i < keyLength; i++) {
        newKey += set[_.random(0, set.length - 1)];
    }

    return newKey;
}

// const handleChatMessage = (socket, msg) => {
//     socket.rooms.forEach(room => {
//         if (room === socket.id) return;
//         io.to(room).emit('chat message', msg);
//     })
// };

const leaveAllRooms = (socket) => {
    socket.rooms.forEach(room => {
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

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });

        // socket.on('chat message', (msg) => handleChatMessage(socket, msg));
        socket.on('join game', async (gameKey) => {
            handleRoomChange(socket, gameKey);

            console.log(socket.request.session.account.username, 'has joined a game');

            io.to(gameKey).emit('player joined', { username: socket.request.session.account.username });
            console.log(await io.in(gameKey).fetchSockets())
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
    });

    return server;
};

module.exports = socketSetup;