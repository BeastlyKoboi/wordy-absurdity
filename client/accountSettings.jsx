const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const accountSettings = () => {

};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<accountSettings />);
    
};

window.onload = init;