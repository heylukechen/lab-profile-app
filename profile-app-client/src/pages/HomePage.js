import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5005';

const HomePage = () => {
  return (
    <div className="flex flex-col w-50 bg-slate-300">
      <Link to={'/signup'}>
        <button className="bg-sky-600 px-3 py-2 rounded text-white">
          Sign up
        </button>
      </Link>
      <Link to={'/login'}>
        <button className="bg-sky-600 px-3 py-2 rounded text-white">
          Log in
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
