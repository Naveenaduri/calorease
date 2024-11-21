import React,{ useEffect, useState } from "react";
import LoginMenu from './loginmenu';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import Table from 'react-bootstrap/Table';

const User = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [initialWeight, setInitialWeight] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const[currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showWeightModal, setShowWeightModal] = useState(false);
    const [weightMessage, setWeightMessage] = useState('');
    const [currentWeight, setCurrentWeight] = useState('');
    const [weightDate, setWeightDate] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showViewWeightModal, setShowViewWeightModal] = useState(false);
    const [weightsData, setWeightsData] = useState([]);
    const [deleteWeightConfirm, setDeleteWeightConfirm] = useState(false);
    const [deleteWeightId, setDeleteWeightId] = useState(null); 

    const [editWeightId, setEditWeightId] = useState(null);

    useEffect(() => {
        // Fetch user details on component mount
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/user', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const user = response.data.user;
            
            // Populate the form fields with user data
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
            setGender(user.gender || '');
            setHeight(user.height || '');
            setPhone(user.phone_number || '');
            setBirthDate(user.birth_date.split('T')[0] || '');
            setInitialWeight(user.initial_weight || '');
          } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
            setMessage('Failed to load user data');
            setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
            }
        }
        };
        fetchUserDetails();
      }, []);

      useEffect(() => {
        if (showPasswordModal) {
            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');
            setPasswordMessage('');
        }
    }, [showPasswordModal]);

    useEffect(() => {
        if (!showWeightModal) {
            setCurrentWeight('');
            setWeightDate('');
            setWeightMessage('');
        }
    }, [showWeightModal]);

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation for required fields
        const newErrors = {};
        if (!firstName) errors.firstName = "First Name is required";
        if (!lastName.trim()) errors.lastName = 'Last Name is required';
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
        if (!phone.trim()) errors.phone = 'Phone Number is required';
        else if (!/^\d{10}$/.test(phone)) errors.phone = 'Phone Number must be 10 digits';
        if (!gender) errors.gender = 'Gender is required';
        if (!birthDate) errors.birthDate = 'Birth Date is required';
        if (height <= 0) errors.height = 'Height is required';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:3001/api/alteruser', {
            first_name : firstName,
            last_name : lastName,
            email : email,
            gender : gender,
            height : height,
            phone_number : phone,
            birth_date : birthDate
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
    
          setMessage(response.data.message || 'User details updated successfully');
          setErrors({});
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                setMessage('Failed to update user details');
                setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
            }
        }
      };

      const handlePasswordUpdate = async () => {
        if (!currentPassword) {
            setPasswordMessage('Current password is required');
            setErrors(prev => ({ ...prev, currentPassword: 'Current password is required' }));
            return;
        }
    
        if (password !== confirmPassword) {
            setPasswordMessage("Passwords do not match");
            setErrors(prev => ({ ...prev, password: "Passwords do not match" }));
            return;
        }
    
        try {
            await axios.post('http://localhost:3001/api/changepassword', {
                currentPassword: currentPassword,
                newPassword: password
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPasswordMessage("Password updated successfully");
            setCurrentPassword('')
            setPassword('');
            setConfirmPassword('');
            setErrors({error : 'text-success'});
        } catch (error) {

            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
            setPasswordMessage("Failed to update password");
            setErrors(prev => ({ ...prev, server: error.response?.data.message || error.message || 'Server error' }));
            }
        }
    };

    const handleWeightUpdate = async () => {
        if(editWeightId){
            try {
                const response = await axios.post('http://localhost:3001/api/editUserWeight', {
                  newWeight: currentWeight,
                  date: weightDate,
                  weightId : editWeightId
                }, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setWeightMessage(response.data.message || 'Weight updated successfully');
                setCurrentWeight(0);
                setWeightDate('');
                setEditWeightId(null);
                setErrors({error : 'text-success'});
              } catch (error) {

                if (error.response.status === 401) {
                    alert("Session Expired, Please Login Again!")
                    localStorage.removeItem('token');
                    window.location.href = 'http://localhost:3000/login';
                } else {
                  setWeightMessage('Failed to update weight');
                  setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
                }
            }

        }
        else{

            try {
              const response = await axios.post('http://localhost:3001/api/updateweight', {
                weight: currentWeight,
                date: weightDate
              }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              setWeightMessage(response.data.message || 'Weight updated successfully');
              setCurrentWeight(0);
              setWeightDate('');
              setErrors({error : 'text-success'});
            } catch (error) {
                if (error.response.status === 401) {
                    alert("Session Expired, Please Login Again!")
                    localStorage.removeItem('token');
                    window.location.href = 'http://localhost:3000/login';
                } else {
                setWeightMessage('Failed to update weight');
                setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
                }
            }
        }
    };

    const handleDeleteUser = async () => {
        try {
          const response = await axios.delete('http://localhost:3001/api/deleteuser', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setMessage(response.data.message || 'User deleted successfully');
          setShowDeleteModal(false);
          setErrors({error : 'text-success'});
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
          setMessage('Failed to delete user');
          setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
            }
        }
    };

    const getWeightsData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/getUserWeights', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          if(response.data.data){
            response.data.data.forEach(item => {
                // Modify the intake_date to format it as 'YYYY-MM-DD'
                item.date = item.date.split('T')[0];
            });
            setWeightsData(response.data.data);
        }
        else{
            alert(response.data.message)
        }
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
          setMessage('Failed to Get User Weights Data');
          setErrors(prev => ({ ...prev, server: error.response?.data.message || 'Server error' }));
            }
        }
    };

    const handleViewWeights = () => {
        getWeightsData();  // Call the getWeightsData function when the button is clicked
        setShowViewWeightModal(true)  // Show the table after data is fetched
      };

      // Handle delete confirmation
    const handleDeleteWeight = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !deleteWeightId) return;

            const response = await axios.delete(`http://localhost:3001/api/deleteWeightEntry/${deleteWeightId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setWeightsData((prevData) => prevData.filter((entry) => entry.id !== deleteWeightId));
                setDeleteWeightConfirm(false);
                setDeleteWeightId(null);
                alert('Dietary Entry Deleted Successfully!');
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
            console.error('Error deleting diet entry:', error);
            alert("Failed to Delete Weight Entry")
            }
        }
    };

    const handleEditWeight = (entry) => {
        console.log("HEreeeeee")
        setShowWeightModal(true);
        setEditWeightId(entry.id);
        setCurrentWeight(entry.weight);
        setWeightDate(entry.date);
        setShowViewWeightModal(false)
    }

    return(
        <>
            <LoginMenu/>
            <div className="py-5 bg-light">
                <div className="container pb-1">
                    <div className="row justify-content-center">
                        <div className="col-md-4 p-2 bg-white text-left">
                            <input type="submit" value="Update Weight" className="btn btn-info text-white ml-4 px-4 py-2" onClick={() => setShowWeightModal(true)}/>
                        </div>
                        <div className="col-md-4 p-2 bg-white text-center">
                            <input type="submit" value="View Weights" className="btn btn-dark text-white px-4 py-2" onClick={() => handleViewWeights()}/>
                        </div>
                        <div className="col-md-4 p-2 bg-white text-right">
                            <input type="submit" value="Change Password" className="btn btn-warning text-white px-4 py-2" onClick={() => setShowPasswordModal(true)}/>
                        </div>
                    </div>
                </div>
                <div className="container bg-white">
                <form onSubmit={handleSubmit} className="p-5">
                <div className="row">
                    <div className="col-md-6">
                        <h2 class="site-section-heading text-uppercase font-secondary mb-5">Update User Details</h2>          
                    </div>
                    <div className="col-md-6 text-right">
                        <input type="submit" value="Delete User" className="btn text-white px-4 py-2" onClick={() => setShowDeleteModal(true)} style={{backgroundColor:"Red"}}/>    
                    </div>
                    <div className="col-md-6 mb-5">
                        {/* Form Fields */}
                        <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                            <label htmlFor="firstname">First Name</label>
                            <input type="text" id="firstname" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                        </div>
                        </div>

                        <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                        </div>
                        </div>

                        <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
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
                        <input type="number" id="height" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} />
                        {errors.height && <p className="text-danger">{errors.height}</p>}
                        </div>
                    </div>
                    </div>
                    <div className="col-md-6 mb-5 ma-2">
                    <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" id="lastname" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" id="phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        {errors.phone && <p className="text-danger">{errors.phone}</p>}
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-12 mb-3 mb-md-0">
                        <label htmlFor="birthDate">Birth Date</label>
                        <input type="date" id="birthDate" className="form-control" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]}/>
                        {errors.birthDate && <p className="text-danger">{errors.birthDate}</p>}
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-12 pt-4 mt-2 text-left">
                        <input type="submit" value="Submit" className="btn btn-primary text-white px-4 py-2" />
                        {message && <p className={errors.server ? "text-danger" : "text-success"}>{message}</p>}
                        {errors.server && <p className="text-danger">{errors.server}</p>}
                        </div>
                    </div>
                {/* Submission */}
            </div>
          </div>
          </form>
        </div>
      </div>

      {/* Update Weight Modal */}
      <Modal show={showWeightModal} onHide={() => setShowWeightModal(false)}>
            <Modal.Header>
                <Modal.Title>Update Weight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {weightMessage && <p className={errors.server ? "text-danger" : "text-success"}>{weightMessage}</p>}
                <Form.Group controlId="currentWeight">
                    <Form.Label>Current Weight (lbs)</Form.Label>
                    <Form.Control
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        placeholder="Enter your current weight"
                    />
                </Form.Group>
                <Form.Group controlId="weightDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={weightDate}
                        onChange={(e) => setWeightDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowWeightModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleWeightUpdate}>
                    Update Weight
                </Button>
            </Modal.Footer>
        </Modal>
      {/* Password Update Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {passwordMessage && <p className={errors.server ? "text-danger" : "text-success"}>{passwordMessage}</p>}
                    <Form>
                        <Form.Group controlId="currentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mt-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword" className="mt-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        {errors.password && <p className="text-danger mt-2">{errors.password}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePasswordUpdate}>
                        Update Password
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete User Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account? This action is irreversible.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete User
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showViewWeightModal} onHide={() => setShowViewWeightModal(false)}>
                <Modal.Header>
                    <Modal.Title>View Weight History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Weight</th>
                        <th>Date</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weightsData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.weight}</td>
                            <td>{entry.date}</td>
                            <td>
                            <Button variant="warning" className="mr-2" onClick={() => { handleEditWeight(entry); }}>
                                <FaEdit /> {/* Edit icon */}
                            </Button>
                            <Button variant="danger" onClick={() => { setDeleteWeightId(entry.id); setDeleteWeightConfirm(true); }}>
                                <FaTrash /> {/* Delete icon */}
                            </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewWeightModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deleteWeightConfirm} onHide={() => setDeleteWeightConfirm(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this dietary entry?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteWeightConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {handleDeleteWeight()}}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default User;
