// signUp that makes a POST request to the server endpoint /auth/signup passing username, password, campus and course info,
// logIn that makes a POST request to the server endpoint /auth/login passing username and password,
// verifyToken that makes a GET request to the server endpoint /auth/verify to check if a user is logged in.
// uploadPhoto that makes a POST request to the server endpoint /api/upload and sends the file,
// getCurrentUser that makes a GET request to the server endpoint /api/user to retrieve the current user data,
// editUser that makes a PUT request to the server endpoint /api/user passing username, campus, course and image.

// import { AuthContext } from '../context/auth.context';
// import { useEffect, useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
const API_URL = 'http://localhost:5005';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5005',
      // We set our API's base URL so that all requests use the same base URL
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use((config) => {
      // Retrieve the JWT token from the local storage
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }
      return config;
    });
  }

  login = (requestBody) => {
    return this.api.post('/auth/login', requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/login");
  };

  signup = (requestBody) => {
    return this.api.post('/auth/signup', requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/singup");
  };

  verify = () => {
    return this.api.get('/auth/verify');
    // same as
    // return axios.post("http://localhost:5005/auth/verify");
  };

  getUser = () => {
    return this.api.get('/api/user');
  };

  fileUpload = (formData) => {
    return this.api.post('/api/upload', formData);
  };

  updatePicture = (image) => {
    return this.api.put('/api/user', image);
  };
}

const authService = new AuthService();
export default authService;
