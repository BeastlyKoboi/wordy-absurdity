const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Components
import NavBar from './Components/NavBar.jsx';

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
};

const LoginWindow = (props) => {
    useEffect(() => {
        const loginButton = document.getElementById('loginButton');
        const signupButton = document.getElementById('signupButton');
        const root = createRoot(document.getElementById('content'));

        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render(<LoginWindow />);
            return false;
        });

        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render(<SignupWindow />);
            return false;
        });
    }, []);

    return (
        <>
            <NavBar hasLogin={true} hasSignup={true} />
            <div className='flex items-center justify-center h-5/6'>
                <form id='loginForm'
                    name='loginForm'
                    onSubmit={handleLogin}
                    action='/login'
                    method='POST'
                    className='mainForm flex flex-col items-center m-6 p-6 max-w-sm bg-white rounded-xl shadow-lg space-x-2'
                >
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input id='user' type="text" name='username' placeholder='username' className='w-20' />
                    </div>
                    <div>
                        <label htmlFor="pass">Password: </label>
                        <input id='pass' type="password" name='pass' placeholder='password' className='w-20' />
                    </div>
                    <input className='formSubmit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
                        type="submit" value='Sign in' />
                </form>
            </div>
        </>
    );
};

const SignupWindow = (props) => {
    useEffect(() => {
        const loginButton = document.getElementById('loginButton');
        const signupButton = document.getElementById('signupButton');
        const root = createRoot(document.getElementById('content'));

        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render(<LoginWindow />);
            return false;
        });

        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render(<SignupWindow />);
            return false;
        });
    }, []);

    return (
        <>
            <NavBar hasLogin={true} hasSignup={true} />
            <div className='flex items-center justify-center h-5/6'>

                <form id='signupForm'
                    name='signupForm'
                    onSubmit={handleSignup}
                    action="/signup"
                    method='POST'
                    className='mainForm flex flex-col items-center m-6 p-6 max-w-sm bg-white rounded-xl shadow-lg space-x-2'
                >
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input id='user' type="text" name='username' placeholder='username' className='w-30'/>
                    </div>
                    <div>
                        <label htmlFor="pass">Password: </label>
                        <input id='pass' type="password" name='pass' placeholder='password' className='w-30'/>
                    </div>
                    <div>
                        <label htmlFor="pass">Password: </label>
                        <input id='pass2' type="password" name='pass2' placeholder='retype password' className='w-30'/>
                    </div>
                    <input className='formSubmit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
                        type="submit" value='Sign up' />
                </form>
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<LoginWindow />);
};

window.onload = init;