const helper = require('./helper.js');
const socket = require('./socket.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const App = () => {

    useEffect(() => {
        socket.init();

    }, []);

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 max-w-screen-xl flex flex-wrap items-center justify-start mx-auto p-4 gap-4">
                <a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo" className='h-8 rounded-xl' /></a>
                <div class="navlink"><a href="/logout" className='text-blue-100'>Log out</a></div>
                <div class="navlink"><a href="/changePassword" className='text-gray-100'>Change Password</a></div>
            </nav>

            <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                <div className='flex flex-col mx-auto text-center'>
                    <div class="text-xl font-medium text-black">Options</div>
                    <button id='host-btn' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
                        Host Game
                    </button>
                    <p id='game-key-output' className='m-4'></p>
                    <p className='m-4'>OR</p>
                    <input id='game-key-input' type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                    <button id='join-btn' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
                        Join Game
                    </button>
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
    // setTimeout(socket.init, 5000);
};

window.onload = init;