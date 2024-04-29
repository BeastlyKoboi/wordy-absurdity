const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const _ = require('underscore');

import Letter from './Components/Letter.jsx';

const Gameplay = ({ socketCon, gameStartInfo }) => {
    let socket = socketCon;

    const [spelledLetters, setSpelledLetters] = useState([]);
    const [drawnLetters, setDrawnLetters] = useState(gameStartInfo.drawnLetters);
    const [gameMessage, setGameMessage] = useState('Spell a word!');
    const [playerReady, setPlayerReady] = useState(false);
    const [enemyReady, setEnemyReady] = useState(false);
    const [playerHealth, setPlayerHealth] = useState(25);
    const [enemyHealth, setEnemyHealth] = useState(25);
    const [gameResult, setGameResult] = useState();

    socket.SetOnCheckWord((wordInfo) => {
        if (!wordInfo.word) {
            wordInfo.word = 'That';
        }

        if (wordInfo.isWord)
            setGameMessage(`${wordInfo.word} is a valid word!`);
        else
            setGameMessage(`${wordInfo.word} is not a valid word!`);
    })
    socket.SetOnOpponentPlayedWord((moveInfo) => {
        setEnemyReady(true);
        setGameMessage('Enemy has played a word!');
    });
    socket.SetOnRoundEnd((roundInfo) => {
        console.log(roundInfo);
        setSpelledLetters([]);
        setDrawnLetters(roundInfo.newLetters);
        setPlayerReady(false);
        setEnemyReady(false);
        setPlayerHealth(roundInfo.playerHealth);
        setEnemyHealth(roundInfo.enemyHealth);

        setGameMessage(`You played ${roundInfo.playerPlayed} 
        for ${roundInfo.playerPoints} points of damage.
        ${gameStartInfo.enemyUsername} played ${roundInfo.enemyPlayed} 
        for ${roundInfo.enemyPoints} points of damage.`);
    });
    socket.SetOnGameEnd((endInfo) => {
        setGameResult(endInfo.result);
    });

    const shuffleLetters = () => {
        setDrawnLetters(_.shuffle(drawnLetters));
    };
    const moveLetterToSpell = (index) => {
        setDrawnLetters(
            drawnLetters.filter((_, i) => {
                if (i == index) setSpelledLetters([...spelledLetters, drawnLetters[i]]);
                return i !== index;
            })
        );
        console.log('clicked', index);
    };
    const moveLetterToDrawn = (index) => {
        setSpelledLetters(
            spelledLetters.filter((_, i) => {
                if (i == index) setDrawnLetters([...drawnLetters, spelledLetters[i]]);
                return i !== index;
            })
        );
        console.log('clicked', index);
    };
    const playWord = () => {
        setPlayerReady(true);
        setGameMessage(`You played ${spelledLetters.join('')}`);
        socket.triggerPlayedWord(spelledLetters.join(''));
    };

    return gameResult ? (
        <>
            <div className='flex flex-col items-center m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg'>
                {gameResult === 'win' && <p className='text-center text-lg'>You Win!!!</p>}
                {gameResult === 'lose' && <p className='text-center text-lg'>You Lose!</p>}
                {gameResult === 'draw' && <p className='text-center text-lg'>It's a Draw!!</p>}
                <button onClick={() => { window.location.pathname = '/home' }} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                    Return Home
                </button>
            </div>
        </>
    ) : (
        <>
            <div className='flex flex-row mx-auto justify-center items-center'>
                <div className='flex flex-col items-center m-6 p-6 mx-auto bg-white rounded-xl shadow-lg'>
                    <img src="/assets/img/favicon2.png" alt="avatar" className='pixel-art w-16 h-16' />
                    <div className='p-2 border-black text-xl font-medium text-black'>{gameStartInfo.enemyUsername}</div>
                    <div className='p-2 flex flex-row mx-auto justify-center'>
                        <div className='text-xl font-medium text-black'>{enemyHealth}</div>
                        <img src="/assets/img/heart.png" alt="heart icon" className='h-6 rounded-lg' />
                    </div>
                    <div className='p-2 text-xl font-medium text-black'>
                        {enemyReady ? 'Ready' : 'Not Ready'}
                    </div>
                    <div className='flex flex-row items-center text-xl font-medium text-black'>
                        <button className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Surrender
                        </button>
                    </div>
                </div>

                <div className='flex flex-col items-center max-w-md m-6 p-6 mx-auto bg-white rounded-xl shadow-lg'>
                    {gameMessage}
                </div>

                <div className='flex flex-col items-center m-6 p-6 mx-auto bg-white rounded-xl shadow-lg'>
                    <img src="/assets/img/favicon2.png" alt="avatar" className='pixel-art w-16 h-16' />
                    <div className='p-2 border-black text-xl font-medium text-black'>{gameStartInfo.playerUsername}</div>
                    <div className='p-2 flex flex-row mx-auto justify-center'>
                        <div className='text-xl font-medium text-black'>{playerHealth}</div>
                        <img src="/assets/img/heart.png" alt="heart icon" className='h-6 rounded-lg' />
                    </div>
                    <div className='p-2 text-xl font-medium text-black'>
                        {playerReady ? 'Ready' : 'Not Ready'}
                    </div>
                    <div className='flex flex-row items-center text-xl font-medium text-black'>
                        <button onClick={playWord} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Play Word
                        </button>
                    </div>

                </div>
            </div>

            <div className='flex flex-col justify-around'>
                <div className='flex flex-row m-6 justify-center items-center bg-green-700 h-20'>
                    {spelledLetters.map((letter, index) => (
                        <Letter value={letter} key={`spelled-${letter}-${index}`} onClick={() => moveLetterToDrawn(index)} />
                    ))}
                </div>
                <div className='flex flex-row m-6 justify-center items-center'>
                    {drawnLetters.map((letter, index) => (
                        <Letter value={letter} key={`drawn-${letter}-${index}`} onClick={() => moveLetterToSpell(index)} />
                    ))}
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <button onClick={() => { socket.triggerCheckWord(spelledLetters.join('')) }} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                        Check Word
                    </button>
                    <button onClick={shuffleLetters} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                        Shuffle Letters
                    </button>
                </div>

            </div>
        </>
    )
};

export default Gameplay;