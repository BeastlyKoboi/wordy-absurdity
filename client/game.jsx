const socket = require('./socket.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

let playOption = JSON.parse(localStorage.getItem('playOption'));
sessionStorage.removeItem('playOption');
socket.init(playOption);


const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameKey, setGameKey] = useState();

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

    }

    if (playOption.option === 'host') {
        <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
            <p>Have your friend (and soon to be enemy) join using this code</p>
            <p id='game-key'>Code: </p>
        </div>
    }

    if (playOption.option === 'join game key') {
        <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
            <p>No Options Selected. Return Home</p>
        </div>
    }

    if (playOption.option === 'matchmaking') {
        <div className='m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-x-4'>
            <p>Waiting for someone to match with...</p>
        </div>
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

};

window.onload = init;