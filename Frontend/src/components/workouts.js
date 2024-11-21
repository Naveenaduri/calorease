import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import LoginMenu from './loginmenu';

const Workouts = () => {
    const [workoutData, setWorkoutData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newWorkoutEntry, setNewWorkoutEntry] = useState({ name: '', time: 0, calories_burnt: 0, workout_date: '', description: '' });
    const [serverMessage, setServerMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [dateSelected, setDateSelected] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleClose = () => {
        setShowModal(false);
        setServerMessage('');
        setErrorMessage('');
    };

    const handleShow = () => {
        setNewWorkoutEntry({ name: '', time: 0, calories_burnt: 0, workout_date: '', description: '' });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'time' || name === 'calories_burnt' ? parseFloat(value) : value;
        setNewWorkoutEntry((prevEntry) => ({ ...prevEntry, [name]: parsedValue }));
    };

    const handleAddWorkoutEntry = async () => {
        if (!newWorkoutEntry.name.trim() || newWorkoutEntry.time <= 0 || newWorkoutEntry.calories_burnt < 0 || !newWorkoutEntry.workout_date) {
            setErrorMessage('All fields are required.');
            setServerMessage('');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (newWorkoutEntry.id) {
                // Update existing entry if ID exists
                const response = await axios.put(
                    `http://localhost:3001/api/updateWorkout`,
                    newWorkoutEntry,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    setServerMessage('Workout Entry Updated Successfully!');
                    alert('Workout Entry Updated Successfully!');
                    setShowModal(false);
                    handleDateSelection({ target: { value: dateSelected } });
                }
            } else {
                // Add new entry if no ID
                const response = await axios.post(
                    'http://localhost:3001/api/addWorkout',
                    newWorkoutEntry,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    alert('Workout Entry Added Successfully!');
                    setServerMessage('Workout Entry Added Successfully!');
                    setShowModal(false);
                }
            }

            setErrorMessage('');
            handleClose();
        } catch (error) {
            console.error('Error adding/updating workout entry:', error);
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to add/update workout entry. ${error.response.data.error}`);
            }
        }
    };

    const handleDateSelection = async (e) => {
        const selectedDate = e.target.value;
        setDateSelected(selectedDate);
        setWorkoutData([]);

        try {
            const token = localStorage.getItem('token');
            if (!token || !selectedDate) return;

            const response = await axios.get(`http://localhost:3001/api/getWorkoutByDate?date=${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if(response.data.success) {
                response.data.workouts.forEach(item => {
                    // Modify the intake_date to format it as 'YYYY-MM-DD'
                    item.workout_date = item.workout_date.split('T')[0];
                });
                setWorkoutData(response.data.workouts);
                if(response.data.workouts.length==0){

                    alert("No Data Found for Workouts on given date!");
                }
            } 
        } catch (error) {
            console.error('Error fetching workout data:', error);
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to fetch workout data for the selected date. ${error.response.data.error}`);
            }
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !deleteId) return;

            const response = await axios.delete(`http://localhost:3001/api/deleteWorkout`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { id: deleteId }
            });

            if (response.status === 200) {
                setWorkoutData((prevData) => prevData.filter((entry) => entry.id !== deleteId));
                setDeleteConfirm(false);
                setDeleteId(null);
                alert('Workout Entry Deleted Successfully!');
                handleDateSelection({ target: { value: dateSelected } });
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
            console.error('Error deleting workout entry:', error);
            setServerMessage('');
            setErrorMessage('Failed to delete workout entry.');
            }
        }
    };

    const handleEdit = (entry) => {
        setNewWorkoutEntry({ ...entry });
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
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{newWorkoutEntry.id ? 'Edit Workout Entry' : 'Add Workout Entry'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddWorkoutEntry(); }}>
                        <Form.Group>
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter workout name" name="name" value={newWorkoutEntry.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control type="number" placeholder="Enter duration" name="time" value={newWorkoutEntry.time} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Calories Burnt</Form.Label>
                            <Form.Control type="number" placeholder="Enter calories burnt" name="calories_burnt" value={newWorkoutEntry.calories_burnt} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Performed On</Form.Label>
                            <Form.Control type="date" name="workout_date" value={newWorkoutEntry.workout_date} onChange={handleInputChange} max={new Date().toISOString().split('T')[0]} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter description" name="description" value={newWorkoutEntry.description} onChange={handleInputChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">{newWorkoutEntry.id ? 'Update Entry' : 'Add Entry'}</Button>
                        <Button variant="danger" onClick={handleClose} className="ml-2">Close</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={deleteConfirm} onHide={() => setDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this workout entry?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <div className="container mt-4 pb-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <h4>Workout Information</h4>
                    </div>
                    <div className="col-md-8 text-right">
                        <Button onClick={handleShow} className="btn btn-primary">Add New Workout</Button>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="date">Select Date</label>
                        <input
                            type="date"
                            id="date"
                            className="form-control"
                            value={dateSelected}
                            onChange={handleDateSelection}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Workout</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Calories Burned</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workoutData.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.name}</td>
                                <td>{entry.description}</td>
                                <td>{entry.time}</td>
                                <td>{entry.calories_burnt}</td>
                                <td>{entry.workout_date}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => handleEdit(entry)}><FaEdit /></Button>
                                    <Button variant="danger" onClick={() => { setDeleteConfirm(true); setDeleteId(entry.id); }}><FaTrashAlt /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {serverMessage && <div className="alert alert-success">{serverMessage}</div>}
            </div>
        </>
    );
};

export default Workouts;
