const React = require('react');

const Letter = ({ value, onClick }) => {

    return (
        <div onClick={onClick} className="bg-white w-16 h-16 m-1 rounded-xl flex justify-center items-center">
            <p className='text-5xl leading-none'>{value}</p>
        </div>
    );
};

export default Letter;