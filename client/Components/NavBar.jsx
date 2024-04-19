const React = require('react');

const NavBar = ({ hasLogin = false, hasSignup = false, hasLogout = false, hasAccountSettings = false, hasAdmin = false }) => {
    return (
        <nav className="border-gray-200 bg-cyan-800 flex flex-wrap items-center justify-between mx-auto ">
            <div className='flex flex-wrap p-4 gap-4'>
                <a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo" className='h-6 rounded-lg' /></a>
                {hasLogin && <div class="navlink"><a id="loginButton" href="/login" className='text-blue-100'>Login</a></div>}
                {hasSignup && <div class="navlink"><a id="signupButton" href="/signup" className='text-blue-100'>Sign up</a></div>}
                {hasLogout && <div class="navlink"><a href="/logout" className='text-blue-100'>Log out</a></div>}
            {/* <div class="navlink"><a href="/changePassword" className='text-gray-100'>Change Password</a></div> */}

            </div>
            <div className='p-4'>
                {hasAccountSettings && <div class="navlink"><a href="/accountSettings" className='text-blue-100'>Account Settings</a></div>}

            </div>

        </nav>
    );
};

export default NavBar;