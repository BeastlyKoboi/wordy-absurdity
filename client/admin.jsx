const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import NavBar from './Components/NavBar.jsx';

const Admin = () => {

    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(async () => {
        let leaderboard = await helper.sendGet('/getLeaderboard');
        setLeaderboard(leaderboard);
        console.log(leaderboard);
    }, []);

    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} hasAccountSettings={true} />

            <div className='flex flex-col text-center m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center'>
                <div className="text-xl font-medium text-black">LEADERBOARD</div>

                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th className='p-4'>Avatar</th>
                            <th className='p-4'>Username</th>
                            <th className='p-4'>Total Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((player) => [
                            <tr>
                                <td className='p-4'><img src={`/assets/img/avatars/${player.avatars[0]}`} alt="avatar" className='pixel-art w-16 h-16' />
                                </td>
                                <td className='p-4'>{player.username}</td>
                                <td className='p-4'>{player.gameWins} Wins</td>
                            </tr>
                        ])}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Admin />);
};

window.onload = init;