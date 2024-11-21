import React, { useState } from 'react';
import axios from 'axios';
import Menu from './menu';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [height, setHeight] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const errors = {};

    if (!firstName.trim()) errors.firstName = 'First Name is required';
    if (!lastName.trim()) errors.lastName = 'Last Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    if (!phone.trim()) errors.phone = 'Phone Number is required';
    else if (!/^\d{10}$/.test(phone)) errors.phone = 'Phone Number must be 10 digits';
    if (!password.trim()) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!gender) errors.gender = 'Gender is required';
    if (!birthDate) errors.birthDate = 'Birth Date is required';
    if (!height.trim()) errors.height = 'Height is required';
    if (!initialWeight.trim()) errors.initialWeight = 'Initial Weight is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3001/api/signup', {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          password,
          gender,
          birth_date: birthDate,
          height,
          initial_weight: initialWeight,
        });
        console.log('Form submitted successfully!', response.data);
        setMessage('Registration successful!');
      } catch (error) {

        if(error.response.data.error.includes('Duplicate Entry')){
          setMessage('Registration failed. Please check the form.'); // Set error message
          setErrors({ ...errors, server: error.response.data.error || 'Server error' });
      } else{
        setMessage('Registration failed. Please check the form.'); // Set error message
        setErrors({ ...errors, server: error.response.data.error || 'Server error' });
      }
      }
    } else {
      setMessage('Please fill in all required fields.');
    }
  };

  return (
    <>
      <Menu />
      <div className="py-5 bg-light">
        <div className="container bg-white">
          <form onSubmit={handleSubmit} className="p-5">
          <div className="row">
            <div className="col-md-6 mb-5">
                {/* Form Fields */}
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" id="firstname" className="form-control" onChange={(e) => setFirstName(e.target.value)} />
                    {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" className="form-control" onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-danger">{errors.gender}</p>}
                  </div>
                </div>
                <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="height">Height (cms)</label>
                  <input type="number" id="height" className="form-control" onChange={(e) => setHeight(e.target.value)} />
                  {errors.height && <p className="text-danger">{errors.height}</p>}
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-5 ma-2">
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="lastname">Last Name</label>
                  <input type="text" id="lastname" className="form-control" onChange={(e) => setLastName(e.target.value)} />
                  {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" id="phone" className="form-control" onChange={(e) => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-danger">{errors.phone}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="confirmpassword">Confirm Password</label>
                  <input type="password" id="confirmpassword" className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="birthDate">Birth Date</label>
                  <input type="date" id="birthDate" className="form-control" onChange={(e) => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]}/>
                  {errors.birthDate && <p className="text-danger">{errors.birthDate}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label htmlFor="initialWeight">Initial Weight (lbs)</label>
                  <input type="number" id="initialWeight" className="form-control" onChange={(e) => setInitialWeight(e.target.value)} />
                  {errors.initialWeight && <p className="text-danger">{errors.initialWeight}</p>}
                </div>
              </div>

                {/* Submission */}
            </div>
            <div className="col-md-6 mb-5"></div>
            <div className="col-md-6 mb-5 text-right">
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <input type="submit" value="Submit" className="btn btn-primary text-white px-4 py-2" />
                  {message && <p className={errors.server ? "text-danger" : "text-success"}>{message}</p>}
                  {errors.server && <p className="text-danger">{errors.server}</p>}
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
