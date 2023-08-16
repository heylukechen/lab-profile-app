import { AuthContext } from '../context/auth.context';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5005';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const navigate = useNavigate();

  const handleLogInSumit = (e) => {
    e.preventDefault();
    const requestBody = { email: email, password: password };
    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        console.log('JWT token', response.data.authToken);
        storeToken(response.data.authToken);
        authenticateUser();
        navigate('/');
      })
      .catch((err) => {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="m-20 flex flex-row w-100">
      <form
        onSubmit={handleLogInSumit}
        className="flex flex-col items-start w-80"
      >
        <label htmlFor="">Email</label>
        <input
          className="w-full mb-4"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />
        <label htmlFor="">Password</label>
        <input
          className="w-full mb-4"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        <button
          className="rounded-none bg-cyan-500 text-white py-2 mt-4 w-full"
          type="submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
