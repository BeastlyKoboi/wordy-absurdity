const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Components
import NavBar from './Components/NavBar.jsx';
import Letter from './Components/Letter.jsx';

const App = () => {
    
    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} hasAccountSettings={true} />

            <div className='flex flex-row'>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Host Game</div>
                        <button id='host-btn' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2'>
                            Host
                        </button>
                    </div>
                </div>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Join Game</div>
                        <input id='game-key-input' type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                        <button id='join-btn' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2'>
                            Join
                        </button>
                    </div>
                </div>

                <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                    <div className='flex flex-col mx-auto text-center'>
                        <div class="text-xl font-medium text-black">Matchmaking</div>
                        <button id='join-btn' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2'>
                            Play
                        </button>
                    </div>
                </div>
            </div>

            <Letter value='E' />
            <Letter value='T' />
            <Letter value='B' />
            <Letter value='O' />

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