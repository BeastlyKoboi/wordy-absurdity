const socket = require('./socket.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const Game = () => {
    
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Game />);

};

window.onload = init;