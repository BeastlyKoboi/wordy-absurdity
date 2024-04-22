const socket = io();

const displayMessage = (msg) => {
    const messageP = document.createElement('p');
    messageP.textContent = msg;
    document.getElementById('game-key').appendChild(messageP);
};


const init = (playOption, ) => {

    if (!playOption) {
        return;
    }

    // if (playOption.option === 'host') {
    //     console.log('host game emitted!');
    //     socket.emit('host game');
    //     socket.on('game key', displayMessage(gameKey));
    // } else if (playOption.option === 'join game key') {
    //     console.log('join game emitted!');
    //     socket.emit('join game', playOption.key);
    // } else if (playOption.option === 'matchmaking') {
    //     console.log('join matchmade game emitted!');
    //     socket.emit('join matchmade game');
    // }

    socket.on('player joined', (playerInfo) => {
        console.log(`${playerInfo.username} other player has joined!`);
        displayMessage(`${playerInfo.username} has joined!`)
    });
    console.log(socket);
};

module.exports = {
    init
}