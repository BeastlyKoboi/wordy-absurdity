const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Components
import NavBar from './Components/NavBar.jsx';
import Letter from './Components/Letter.jsx';

const handlePlay = (option, key = null) => {
    localStorage.setItem('playOption', JSON.stringify({ option, key }));
    window.location.pathname = '/game';
};

const App = () => {

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

    const [spelledLetters, setSpelledLetters] = useState([]);
    const [drawnLetters, setDrawnLetters] = useState(['A', 'B', 'C', 'D', 'E', 'F']);

    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} hasAccountSettings={true} />

            <div className='flex flex-row'>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Host Game</div>
                        <button id='host-btn' onClick={() => { handlePlay('host') }} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Host
                        </button>
                    </div>
                </div>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Join Game</div>
                        <input id='game-key-input' type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                        <button id='join-btn' onClick={(e) => { handlePlay('join game key', document.getElementById('game-key-input').value) }} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Join
                        </button>
                    </div>
                </div>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Matchmaking</div>
                        <button id='join-btn' onClick={() => { handlePlay('matchmaking') }} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                            Play
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="messageDiv" class='hidden'>
                <h3 className='text-black'><span id="message"></span></h3>
                <h3 className='text-red'><span id="errorMessage"></span></h3>
            </div>

        

        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);

};

window.onload = init;