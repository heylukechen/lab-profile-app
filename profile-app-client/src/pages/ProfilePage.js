import authService from '../context/auth.service';
import { AuthContext } from '../context/auth.context';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5005';

const ProfilePage = () => {
  // const { storeToken } = useContext(AuthContext);
  const { logOutUser, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const [campus, setCampus] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [image, setImage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    axios
      .get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setCampus(response.data.campus);
        setCourse(response.data.course);
        setEmail(response.data.email);
        setImage(response.data.imageUrl);
        setLoading(false); // Data is fetched, set loading to false
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleUploadedFile = (e) => {
    setUploadedFilePath();
    console.log(uploadedFilePath);

    const formData = new FormData();
    formData.append('imageUrl', e.target.files[0]);

    authService
      .fileUpload(formData)
      .then((response) => {
        if (response.data.fileUrl) {
          setImage(response.data.fileUrl);
        }
      })
      .catch((err) => {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      });

    // axios.post(`${API_URL}/api/upload`, formData).then((response) => {
    //   if (response.data.fileUrl) {
    //     setImage(response.data.fileUrl);
    //   }
    // });
  };

  const updateNewPicture = (e) => {
    e.preventDefault();

    authService
      .updatePicture({ image: image })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      });

    // axios
    //   .put(
    //     `${API_URL}/api/user`,
    //     { image: image },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Set the token as an Authorization header
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logOutUser();
    navigate('/');
  };

  return (
    <div>
      {user ? (
        <div className="m-20 flex flex-col w-100">
          <h1>Profile</h1>
          <h4>Email</h4>
          <h4>{email}</h4>
          <h4>Campus</h4>
          <h4>{campus}</h4>
          <h4>Course</h4>
          <h4>{course}</h4>
          <img src={image} alt="" />
          <form
            onSubmit={updateNewPicture}
            className="m-20 flex flex-col w-100"
          >
            <label htmlFor="profileImage">Profile image</label>
            <input type="file" id="imageUrl" onChange={handleUploadedFile} />
            <button
              className="rounded-none bg-cyan-600 text-white py-2 mt-4 w-full"
              type="submit"
            >
              Submit
            </button>
          </form>
          <form onSubmit={handleLogout}>
            <button
              className="rounded-none bg-gray-300 text-gray-700 py-2 mt-4 w-40"
              type="submit"
            >
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfilePage;
