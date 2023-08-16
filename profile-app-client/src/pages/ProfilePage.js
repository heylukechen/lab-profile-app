import { AuthContext } from '../context/auth.context';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5005';

const ProfilePage = () => {
  const { user, storeToken } = useContext(AuthContext);

  const [campus, setCampus] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [image, setImage] = useState('');

  const handleUploadedFile = (e) => {
    setUploadedFilePath(e.target.files[0]);
    console.log(uploadedFilePath);//put a simple timeout (react dev )
  };

//   useEffect(()=>{
//     //execute the function of axio.get("user",{header}).tehe()
//   });

  //   const fetchedUser = axios
  //     .get(`${API_URL}/api/user`, { user })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((err) => console.log(err));

  const storedToken = localStorage.getItem('authToken');

  const uploadNewPicture = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('imageUrl', uploadedFilePath);

    axios
      .post(`${API_URL}/api/upload`, formData)
      .then((response) => {
        console.log(response.data);
        if (response.data.fileUrl) {
          setImage(response.data.fileUrl);
          axios
            .put(
              `${API_URL}/api/user`,
              { image: response.data.fileUrl },
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`, // Set the token as an Authorization header
                },
              }
            )
            .then((response) => {
              console.log(response.data);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      setCampus(user.campus);
      setCourse(user.course); // You had a typo here, 'user.couse' should be 'user.course'
      setEmail(user.email);
    }
  }, [user]);

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
            onSubmit={uploadNewPicture}
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
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfilePage;
