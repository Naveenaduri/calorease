import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './menu';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrors({ server: 'Email and password are required.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Invalid email format.' });
      return;
    }


    try {
        const response = await axios.post('http://localhost:3001/api/login', {
            email: email,
            password: password,
          });
      const { success, message, user, token } = response.data;

      if (success) {
        // Handle successful login, e.g., store user data and token in the state or localStorage
        console.log('Login successful:', message);
        console.log('User:', user);
        console.log('Token:', token);
        localStorage.setItem('token', token);
        navigate('/loginhomepage');
      } else {
        // Handle unsuccessful login
        setErrors({ server: message });
      }
    } catch (error) {
       // Handle network errors or other issues
       console.error('Error during login:', error.message);

       if (error.response) {
         // The request was made and the server responded with a status code
         const statusCode = error.response.status;
         const errorMessage = error.response.data.message;
 
         if (statusCode === 401) {
           setErrors({ server: 'Incorrect email or password' });
         } else if (statusCode === 404) {
           setErrors({ server: 'User not found' });
         } else {
           setErrors({ server: errorMessage || 'An error occurred during login.' });
         }
       } else {
         // The request was made but no response was received
         setErrors({ server: 'An error occurred during login.' });
       }
    }
  };

  return (
    <>
    <Menu/>
    <div className="py-5 bg-light">
      <div className="container bg-white">
        <div className="row">
          <div className="col-md-12 mb-5">
            <form onSubmit={handleSubmit} className="p-5">
              <div className="row form-group">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="font-weight-bold" htmlFor="email">Email</label>
                  <input type="text" id="email" className="form-control" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>
                <div className="col-md-6">
                  <label className="font-weight-bold" htmlFor="password">Password</label>
                  <input type="password" id="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <input type="submit" value="Submit" className="btn btn-primary text-white px-4 py-2" />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  {message && !errors.server && <p className={errors.server ? "text-danger" : "text-success"}>{message}</p>}
                  {errors.server && <p className="text-danger">{errors.server.split(':').length === 3 ? errors.server.split(':')[2] : errors.server}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
