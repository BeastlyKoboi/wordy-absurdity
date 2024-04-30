const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import NavBar from './Components/NavBar.jsx';

const Admin = () => {

    useEffect(async () => {
        let leaderboard = await helper.sendGet('/getLeaderboard');

        console.log(leaderboard);
    }, []);

    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} hasAccountSettings={true} />


        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Admin />);
};

window.onload = init;