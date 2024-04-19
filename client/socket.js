const socket = io();

// const handleEditBox = () => {
//     const editForm = document.getElementById('editForm');
//     const editBox = document.getElementById('editBox');
//     const channelSelect = document.getElementById('channelSelect');

//     editForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         if (editBox.value) {
//             socket.emit('chat message', editBox.value);
//             editBox.value = "";
//         }
//     });
// };


const displayMessage = (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = msg;
    document.getElementById('message').appendChild(messageDiv);
};

const handleHostGame = () => {
    const hostBtn = document.getElementById('host-btn');

    hostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('host game emitted!');
        socket.emit('host game');
    });
};

const handleJoinGame = () => {
    const keyInput = document.getElementById('game-key-input');
    const joinBtn = document.getElementById('join-btn');

    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (keyInput.value) {
            console.log('join game emitted!');

            socket.emit('join game', keyInput.value);
            keyInput.value = "";
        }
    });
};

const handleGameCode = (gameKey) => {
    const gameKeyOutput = document.getElementById('game-key-output');

    gameKeyOutput.innerText = gameKey;
};

const init = () => {
    console.log('Socket initialized emitted!');

    handleHostGame();
    handleJoinGame();

    socket.on('game key', handleGameCode);

    socket.on('player joined', (playerInfo) => {
        console.log(`${playerInfo.username} other player has joined!`);
        displayMessage(`${playerInfo.username} has joined!`)
    });
    console.log(socket);
};

module.exports = {
    init
}