import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons
import LoginMenu from './loginmenu';

const DietaryInfo = () => {
    const [dietData, setDietData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newDietEntry, setNewDietEntry] = useState({ name: '', calories: 0, protein: 0, intake_date: '', serving_quantity: 0 });
    const [serverMessage, setServerMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [dateSelected, setDateSelected] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null); // For delete confirmation

    const handleClose = () => {
        setShowModal(false);
        setServerMessage('');
        setErrorMessage('');
    };

    const handleShow = () => {
        setNewDietEntry({ name: '', calories: 0, protein: 0, intake_date: '', serving_quantity: '' });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'calories' || name === 'protein' ? parseFloat(value) : value;
        setNewDietEntry((prevEntry) => ({ ...prevEntry, [name]: parsedValue }));
    };

    const handleAddDietEntry = async () => {
        if (!newDietEntry.name.trim() || !newDietEntry.serving_quantity.trim() || newDietEntry.calories < 0 || newDietEntry.protein < 0 || !newDietEntry.intake_date || newDietEntry.serving_quantity <= 0) {
            setErrorMessage('All fields are required.');
            setServerMessage('');
            return;
        }

        try {
            const token = localStorage.getItem('token');
    
            if (!token) {
                return; // Handle case when token is not available (user not logged in)
            }
    
            if (newDietEntry.id) {
                // Update existing entry if ID exists
                const response = await axios.post(
                    `http://localhost:3001/api/updateFoodEntry/${newDietEntry.id}`,
                    newDietEntry,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (response.status === 200) {
                    setServerMessage('Dietary Entry Updated Successfully!');
                    alert('Dietary Entry Updated Successfully!');
                    setShowModal(false);
                    handleDateSelection({ target: { value: dateSelected } });
                }
            } else {
                // Add new entry if no ID
                const response = await axios.post(
                    'http://localhost:3001/api/addUserFood',
                    newDietEntry,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (response.status === 200) {
                    alert('Dietary Entry Added Successfully!');
                    setServerMessage('Dietary Entry Added Successfully!');
                    setShowModal(false);
                    handleDateSelection({ target: { value: dateSelected } });                
                }
            }
    
            setErrorMessage('');
            handleClose();
        } catch (error) {
            console.error('Error adding/updating diet entry:', error);
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to add/update dietary entry. ${error.response.data.error}`);
            }
        }
    
    };

    const handleDateSelection = async (e) => {
        const selectedDate = e.target.value;
        setDateSelected(selectedDate);
        setDietData([]);

        try {
            const token = localStorage.getItem('token');

            if (!token || !selectedDate) {
                return; // Handle case when token is not available or no date selected
            }

            const response = await axios.get(`http://localhost:3001/api/getUserDietbyDate?date=${selectedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
            if(response.data.data){
                response.data.data.forEach(item => {
                    // Modify the intake_date to format it as 'YYYY-MM-DD'
                    item.intake_date = item.intake_date.split('T')[0];
                });
                setDietData(response.data.data);
            }
            else{
                alert(response.data.message)
            }
        } catch (error) {
            console.error('Error fetching diet data:', error);
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to fetch diet data for the selected date. ${error.response.data.error}`);
            }
        }
    };

    // Handle delete confirmation
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !deleteId) return;

            const response = await axios.delete(`http://localhost:3001/api/deleteUserFood/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setDietData((prevData) => prevData.filter((entry) => entry.id !== deleteId));
                setDeleteConfirm(false);
                setDeleteId(null);
                alert('Dietary Entry Deleted Successfully!');
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
            console.error('Error deleting diet entry:', error);
            setServerMessage('');
            setErrorMessage('Failed to delete dietary entry.');
            }
        }
    };

    const handleEdit = (entry) => {
        setNewDietEntry({ ...entry });
        setShowModal(true);
    };

    useEffect(() => {
        if (dateSelected) {
            handleDateSelection({ target: { value: dateSelected } });
        }
    }, [dateSelected]);

    return (
        <>
            <LoginMenu />
            {/* Modal for adding dietary entry */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{newDietEntry.id ? 'Edit Dietary Entry' : 'Add Dietary Entry'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddDietEntry(); }}>
                        <div className="row form-group">
                            <div className="col-md-6">
                                <label className="font-weight-bold" htmlFor="foodName">Food Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter food name"
                                    name="name"
                                    value={newDietEntry.name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="font-weight-bold" htmlFor="calories">Calories</label>
                                <input
                                    type="number"
                                    placeholder="Enter calories"
                                    name="calories"
                                    value={newDietEntry.calories}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-md-6">
                                <label className="font-weight-bold" htmlFor="protein">Protein</label>
                                <input
                                    type="number"
                                    placeholder="Enter protein"
                                    name="protein"
                                    value={newDietEntry.protein}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="font-weight-bold" htmlFor="serving_quantity">Serving Quantity</label>
                                <input
                                    type="text"
                                    placeholder="Enter serving quantity"
                                    name="serving_quantity"
                                    value={newDietEntry.serving_quantity}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-md-12">
                                <label className="font-weight-bold" htmlFor="intake_date">Intake Date</label>
                                <input
                                    type="date"
                                    name="intake_date"
                                    value={newDietEntry.intake_date}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-md-3 mr-2">
                                <input type="submit" value={newDietEntry.id ? 'Update Entry' : 'Add Entry'} className="btn btn-primary text-white px-4 py-2" />
                            </div>
                            <div className="col-md-3 ml-3">
                                <input type="submit" value='Close' className="btn btn-danger text-white px-4 py-2" onClick={() => setShowModal(false) } />
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-md-12">
                                {serverMessage && (
                                    <div className="alert alert-success mt-3">
                                        {serverMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteConfirm} onHide={() => setDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this dietary entry?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="container mt-4 pb-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <h4>Dietary Information</h4>
                    </div>
                    <div className="col-md-8 text-right">
                        <Button onClick={handleShow} className="btn btn-primary">Add New Entry</Button>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <input
                            type="date"
                            value={dateSelected}
                            onChange={handleDateSelection}
                            className="form-control"
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Serving Quantity</th>
                            <th>Intake Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dietData.length > 0 ? (
                            dietData.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{entry.name}</td>
                                    <td>{entry.calories}</td>
                                    <td>{entry.protein}</td>
                                    <td>{entry.serving_quantity}</td>
                                    <td>{entry.intake_date.split('T')[0]}</td>
                                    <td>
                                        <Button onClick={() => handleEdit(entry)} variant="warning" className="mr-2">
                                            <FaEdit />
                                        </Button>
                                        <Button onClick={() => { setDeleteId(entry.id); setDeleteConfirm(true); }} variant="danger">
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No entries found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default DietaryInfo;
