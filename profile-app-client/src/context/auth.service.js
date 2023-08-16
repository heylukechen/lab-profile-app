// signUp that makes a POST request to the server endpoint /auth/signup passing username, password, campus and course info,
// logIn that makes a POST request to the server endpoint /auth/login passing username and password,
// verifyToken that makes a GET request to the server endpoint /auth/verify to check if a user is logged in.
// uploadPhoto that makes a POST request to the server endpoint /api/upload and sends the file,
// getCurrentUser that makes a GET request to the server endpoint /api/user to retrieve the current user data,
// editUser that makes a PUT request to the server endpoint /api/user passing username, campus, course and image.

import { AuthContext } from '../context/auth.context';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5005';

const SignUpService = (requestBody) => {
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  axios
    .post(`${API_URL}/auth/signup`, requestBody)
    .then((response) => {
      navigate('/login');
      console.log(response);
    })
    .catch((err) => {
      const errorDescription = err.response.data.message;
      setErrorMessage(errorDescription);
    });
};

const LoginService = () => {};

export { SignUpService, LoginService };
