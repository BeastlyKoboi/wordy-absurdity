const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


// Components
import NavBar from './Components/NavBar.jsx';

const App = () => {

    return (
        <div className="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex align-middle flex-col">
            <p class="text-center mx-auto">
                404 Page Not Found
            </p>
            <button id="return-btn" onClick={() => {window.location = "/"}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
                Return to Homepage
            </button>
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);

};

window.onload = init;