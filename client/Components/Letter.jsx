const React = require('react');

const Letter = ({ value, }) => {

    return (
        <div className="bg-white w-16 h-16 m-2 rounded-xl flex justify-center items-center">
            <p className='text-5xl leading-none'>{value}</p>
        </div>
    );
};

export default Letter;