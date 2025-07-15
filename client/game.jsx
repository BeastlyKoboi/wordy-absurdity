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
            <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center flex-col'>
                <p>No Options Selected. Return Home</p>
                <button id="return-btn" onClick={() => {window.location = "/"}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 w-min">
                    Return to Homepage
                </button>
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