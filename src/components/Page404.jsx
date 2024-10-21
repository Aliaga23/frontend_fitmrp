import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const Page404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 text-white">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <FaExclamationTriangle className="text-yellow-300 text-9xl animate-bounce" />
        <h1 className="text-8xl font-bold tracking-wider text-white drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-semibold tracking-wide">Oops! Page not found</h2>
      </div>

      <p className="mt-6 text-lg text-white opacity-90 tracking-wide">
        It seems like the page you are looking for doesn't exist. But don't worry!
      </p>

      <div className="mt-10">
        <Link to="/login" className="relative inline-block text-lg group">
          <span className="relative z-10 block px-5 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-md group-hover:bg-blue-700 transition duration-300 ease-in-out">
            Go Back Home
          </span>
          <span className="absolute inset-0 w-full h-full mt-1 ml-1 bg-yellow-300 rounded-lg group-hover:mt-0 group-hover:ml-0 transition-all duration-300 ease-in-out transform group-hover:scale-105"></span>
        </Link>
      </div>

      <div className="absolute bottom-10 text-center text-sm text-white opacity-75">
        <p>Don't panic! This is just a glitch in the Matrix.</p>
      </div>

      <div className="absolute top-5 left-5 text-sm text-yellow-200 animate-spin-slow">
        <FaExclamationTriangle size={40} />
      </div>
    </div>
  );
};

export default Page404;
