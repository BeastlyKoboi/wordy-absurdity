const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import Letter from './Components/Letter.jsx';

const Gameplay = ({ socketCon, gameStartInfo }) => {
    console.log(gameStartInfo);
    const [drawnLetters, setDrawnLetters] = useState(gameStartInfo.drawnLetters);
    const [letterComponents, setLetterComponents] = useState(
        drawnLetters.map(letter => [
            <Letter value={letter} />
        ])
    );

    let socket = socketCon;

    return (
        <>
            <div className='flex flex-row mx-auto justify-center'>
                <div className='flex flex-col items-center m-6 p-6 mx-auto bg-white rounded-xl shadow-lg'>
                    <img src="/assets/img/favicon2.png" alt="avatar" className='pixel-art w-16 h-16' />
                    <div className='p-2 border-black text-xl font-medium text-black'>{gameStartInfo.enemyUsername}</div>
                    <div className='p-2 flex flex-row mx-auto justify-center'>
                        <div className='text-xl font-medium text-black'>50</div>
                        <img src="/assets/img/heart.png" alt="heart icon" className='h-6 rounded-lg' />
                    </div>
                    <div className='p-2 text-xl font-medium text-black'>Not Ready</div>
                    <div className='flex flex-row items-center text-xl font-medium text-black'>
                        <button className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Surrender
                        </button>
                    </div>
                </div>

                <div className='flex flex-col items-center m-6 p-6 mx-auto bg-white rounded-xl shadow-lg'>
                    <img src="/assets/img/favicon2.png" alt="avatar" className='pixel-art w-16 h-16' />
                    <div className='p-2 border-black text-xl font-medium text-black'>{gameStartInfo.playerUsername}</div>
                    <div className='p-2 flex flex-row mx-auto justify-center'>
                        <div className='text-xl font-medium text-black'>50</div>
                        <img src="/assets/img/heart.png" alt="heart icon" className='h-6 rounded-lg' />
                    </div>
                    <div className='p-2 text-xl font-medium text-black'>Not Ready</div>
                    <div className='flex flex-row items-center text-xl font-medium text-black'>
                        <button className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Play Word
                        </button>
                    </div>

                </div>
            </div>

            <div className='flex flex-col justify-around'>

                <div className='flex flex-row m-6 justify-center bg-green-700 h-16'>

                </div>
                <div className='flex flex-row m-6 justify-center '>
                    {letterComponents}
                </div>
            </div>
        </>
    )
};

export default Gameplay;