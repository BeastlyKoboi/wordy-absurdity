const socket = require('./socket.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import Gameplay from './Gameplay.jsx';

let playOption = JSON.parse(localStorage.getItem('playOption'));
localStorage.removeItem('playOption');

const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStartInfo, setGameStartInfo] = useState([]);

    socket.SetOnGameStart((gameInfo) => {
        setGameStarted(true);
        setGameStartInfo(gameInfo);
        console.log('Inside game.jsx on game start called');
    })

    useEffect(() => {

    }, []);

    if (!playOption) {
        return (
            <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
                <p>No Options Selected. Return Home</p>
            </div>
        );
    }

    if (gameStarted) {
        return (
            <Gameplay socketCon={socket} gameStartInfo={gameStartInfo} />
        );
    }

    if (playOption.option === 'host') {
        return (
            <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
                <p>Have your friend (and soon to be enemy) join using this code</p>
                <p id='game-key'>Code: </p>
            </div>
        );
    }

    if (playOption.option === 'join game key') {
        return (
            <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
                <p>Joining game...</p>
            </div>
        );
    }

    if (playOption.option === 'matchmaking') {
        return (
            <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
                <p>Waiting for someone to match with...</p>
            </div>
        );
    }

    return (
        <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
            <p>Waiting...</p>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Game />);
    socket.init(playOption);
};

window.onload = init;