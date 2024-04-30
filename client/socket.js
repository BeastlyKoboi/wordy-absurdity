const socket = io();

let OnCheckWord;
let OnGameStart;
let OnRoundStart;
let OnOpponentPlayedWord;
let OnRoundEnd;
let OnGameEnd;

const SetOnCheckWord = (callback) => { OnCheckWord = callback; };
const SetOnGameStart = (callback) => { OnGameStart = callback; };
// const SetOnRoundStart = (callback) => { OnRoundStart = callback; };
const SetOnOpponentPlayedWord = (callback) => { OnOpponentPlayedWord = callback; };
const SetOnRoundEnd = (callback) => { OnRoundEnd = callback; };
const SetOnGameEnd = (callback) => { OnGameEnd = callback; };

const gameStart = (gameInfo) => {
    do {
        if (OnGameStart) {
            OnGameStart(gameInfo);
            console.log('In socket on game start');
        }
    } while (!OnGameStart);
};
// const roundStart = (gameInfo) => { if (OnRoundStart) OnRoundStart(gameInfo); };
// const opponentPlayedWord = (gameInfo) => { if (OnOpponentPlayedWord) OnOpponentPlayedWord(gameInfo) }
// const roundEnd = (gameInfo) => { if (OnRoundEnd) OnRoundEnd(gameInfo); };
// const gameEnd = (gameInfo) => { if (OnGameEnd) OnGameEnd(gameInfo); };

const triggerCheckWord = (word) => {
    socket.emit('check word exists', word);
};

const triggerPlayedWord = (word) => {
    socket.emit('play word', word);
};

const displayMessage = (msg, id) => {
    const messageP = document.createElement('p');
    messageP.textContent = msg;
    document.getElementById(id).appendChild(messageP);
};

const init = (playOption,) => {

    if (!playOption) {
        return;
    }

    if (playOption.option === 'host') {
        console.log('host game emitted!');
        socket.emit('host game');
        socket.once('game key', (gameKey) => { displayMessage(gameKey, 'game-key') });
    } else if (playOption.option === 'join game key') {
        console.log('join game emitted!');
        socket.emit('join game', playOption.key);
    } else if (playOption.option === 'matchmaking') {
        console.log('join matchmade game emitted!');
        socket.emit('join matchmade game');
    }

    // socket.on('player joined', (playerInfo) => {
    //     console.log(`${playerInfo.username} other player has joined!`);
    //     displayMessage(`${playerInfo.username} has joined!`, 'message')
    // });

    socket.once('start game', (gameInfo) => {
        gameStart(gameInfo);
        console.log('Start game called', OnGameStart);
    });

    socket.on('check word exists', (wordInfo) => {
        if (OnCheckWord) {
            OnCheckWord(wordInfo);
        }
        console.log(wordInfo);
    });

    socket.on('opponent played word', (moveInfo) => {
        if (OnOpponentPlayedWord) {
            OnOpponentPlayedWord(moveInfo);
        }
    });

    socket.on('round end', (roundInfo) => {
        if (OnRoundEnd) {
            OnRoundEnd(roundInfo);
        }
    });

    socket.on('game end', (endInfo) => {
        console.log('on game end received');
        if (OnGameEnd) {
            OnGameEnd(endInfo);
        }
    });

    console.log(socket);
};

module.exports = {
    init,
    SetOnCheckWord,
    SetOnGameStart,
    // SetOnRoundStart,
    SetOnOpponentPlayedWord,
    SetOnRoundEnd,
    SetOnGameEnd,
    triggerCheckWord,
    triggerPlayedWord,
}