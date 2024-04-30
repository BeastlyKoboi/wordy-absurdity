const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import NavBar from './Components/NavBar.jsx';
import Letter from './Components/Letter.jsx';

const AccountSettings = () => {

    const [avatars, setAvatars] = useState({ unlocked: [], all: [] });
    const [avatarSelected, setAvatarSelected] = useState('');

    const [tileColors, setTileColors] = useState({ unlocked: [], all: [] });
    const [tileColorSelected, setTileColorSelected] = useState('');

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    const handleAvatarSelect = (index) => {
        setAvatarSelected(avatars.all[index]);
    };
    const handleAvatarChoice = async () => {
        if (avatars.unlocked.includes(avatarSelected)) {
            let newAvatars = await helper.sendPost('/setAvatar', { avatarName: avatarSelected });
            setAvatars(newAvatars);
        } else {
            let newAvatars = await helper.sendPost('/addAvatar', { avatarName: avatarSelected });
            newAvatars = await helper.sendPost('/setAvatar', { avatarName: avatarSelected });
            setAvatars(newAvatars);
        }
    };

    const handleTileColorSelect = (index) => {
        setTileColorSelected(tileColors.all[index]);
    };
    const handleTileColorChoice = async () => {
        if (tileColors.unlocked.includes(tileColorSelected)) {
            let newTileColors = await helper.sendPost('/setTileStyle', { tileStyleName: tileColorSelected });
            setTileColors(newTileColors);
        } else {
            let newTileColors = await helper.sendPost('/addTileStyle', { tileStyleName: tileColorSelected });
            newTileColors = await helper.sendPost('/setTileStyle', { tileStyleName: tileColorSelected });
            setTileColors(newTileColors);
        }
    };

    useEffect(async () => {
        let avatarNames = await helper.sendGet('/getAvatars',);
        setAvatars(avatarNames);
        setAvatarSelected(avatarNames.unlocked[0]);

        let tileColorNames = await helper.sendGet('/getTileStyles',);
        setTileColors(tileColorNames);
        setTileColorSelected(tileColorNames.unlocked[0]);
    }, []);

    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} />

            <div id='avatar-select' className="flex flex-col text-center m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                <div className="text-xl font-medium text-black">Select An Avatar</div>
                <div className='flex flex-row gap-4 m-6'>
                    {avatars.all.map((avatar, index) => (
                        <img onClick={() => { handleAvatarSelect(index) }} key={avatar} src={`/assets/img/avatars/${avatar}`} alt="avatar"
                            className={`pixel-art h-16 ${avatarSelected === avatar ? 'border-4 border-black' : ''} `} />
                    ))}
                </div>
                {avatarSelected !== avatars.unlocked[0] &&
                    <button id='avatar-buy-btn' onClick={handleAvatarChoice} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                        {avatars.unlocked.includes(avatarSelected) ? 'Select' : 'Buy'}
                    </button>
                }
            </div>

            <div id='key-styles-select' className="flex flex-col text-center m-6 p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg flex items-center">
                <div className="text-xl font-medium text-black">Select A Tile Style</div>
                <div className='grid grid-cols-5 grid-flow-row gap-4 m-6'>
                    {tileColors.all.map((tileColor, index) => (
                        <div onClick={() => { handleTileColorSelect(index) }} key={tileColor} alt="tile color"
                            className={`pixel-art h-16 w-16 bg-${tileColor} ${tileColorSelected === tileColor ? 'border-4 border-black' : ''} `} >
                        </div>
                    ))}
                </div>
                {console.log(tileColors)}
                {setTileColorSelected !== tileColors.unlocked[0] &&
                    <button id='tile-color-buy-btn' onClick={handleTileColorChoice} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                        {tileColors.unlocked.includes(tileColorSelected) ? 'Select' : 'Buy'}
                    </button>
                }
            </div>


            <div id='letter-view' className='grid grid-cols-5 grid-flow-row gap-4 max-w-md mx-auto'>
                {alphabet.map((letter) => [
                    <Letter value={letter} bgColor={tileColorSelected} />
                ])}
            </div>

            <div className='flex flex-col text-center m-6 p-6 gap-4 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center'>
                <button onClick={() => { window.location.pathname = '/changePassword' }} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                    Change Password
                </button>
                <button onClick={() => { helper.sendPost('/toggleAdmin'); }} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                    Toggle Admin Status
                </button>
                <button onClick={() => { window.location.pathname = '/admin' }} className='mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'>
                    See Admin Page
                </button>
            </div>

            <div className={`hidden ${['bg-white', 'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-lime-200', 'bg-green-200', 'bg-cyan-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200'].join(' ')}`}>
                {/* none of the colors show up without this */}
            </div>

        </div>
    )
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<AccountSettings />);

};

window.onload = init;