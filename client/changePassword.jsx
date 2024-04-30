const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

import NavBar from './Components/NavBar.jsx';

const handleNewPass = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { oldPass, newPass, newPass2 }, null);
    return false;
};

const ChangePasswordForm = () => {
    return (
        <div className='bg-cyan-300'>
            <NavBar hasLogout={true} hasAccountSettings={true} />
            <div class="m-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center">
                <div className='flex flex-col mx-auto text-center'>
                    <div class="text-xl font-medium text-black">Change Password</div>

                    <form id='changePasswordForm'
                        onSubmit={e => handleNewPass(e)}
                        name='changePasswordForm'
                        action="/changePassword"
                        method='POST'
                    >
                        <label htmlFor="oldPass">Old Password: </label>
                        <input id='oldPass' type="text" name='oldPass' placeholder='Old Password' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                        <br />
                        <label htmlFor="newPass">New Password: </label>
                        <input id='newPass' type='text' name='newPass' placeholder='New Password' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                        <br />
                        <label htmlFor="newPass2">New Password Again: </label>
                        <input id='newPass2' type='text' name='newPass2' placeholder='New Password Again' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                        <input type="submit" value='Change Password' className='changePasswordSubmit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5'/>
                    </form>

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
    root.render(<ChangePasswordForm />);
};

window.onload = init;