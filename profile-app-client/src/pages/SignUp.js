import authService from '../context/auth.service';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5005';
const backgroundImg = require('../oval-bg.png');

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Madrid');
  const [course, setCourse] = useState('Data Analytics');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleCampus = (e) => setCampus(e.target.value);
  const handleCourse = (e) => setCourse(e.target.value);

  const navigate = useNavigate();

  const handleSignUpSumit = (e) => {
    e.preventDefault();
    const requestBody = {
      email: email,
      password: password,
      campus: campus,
      course: course,
    };

    // console.log(requestBody);
    authService
      .signup(requestBody)
      .then((response) => {
        navigate('/login');
        console.log(response);
      })
      .catch((err) => {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div
      className="m-20 flex flex-row w-100"
      //   style={{ backgroundImage: backgroundImg }}
    >
      <form
        onSubmit={handleSignUpSumit}
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
        <label htmlFor="camput">Campus</label>
        <select
          className="w-full mb-4"
          name="campus"
          id="campus"
          value={campus}
          onChange={handleCampus}
        >
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Miami">Miami</option>
          <option value="Paris">Paris</option>
          <option value="Berlin">Berlin</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="México">México</option>
          <option value="Sao Paulo">Sao Paulo</option>
          <option value="lisbon">Lisbon</option>
          <option value="Remote">Remote</option>
        </select>
        <label htmlFor="">Course</label>
        <select
          className="w-full mb-4"
          name="course"
          id="course"
          value={course}
          onChange={handleCourse}
        >
          <option value="Web dev">Web Dev</option>
          <option value="UXUI">UX/UI</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>
        <button
          className="rounded-none bg-cyan-500 text-white py-2 mt-4 w-full"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
