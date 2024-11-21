import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorkoutBarChart from './WorkoutBarChart';
import WeightLineChart from './WeightLinechart';
import DietPieChart from './DietPieChart';
import LoginMenu from './loginmenu';
import Button from 'react-bootstrap/Button';

const Visualizations = () => {
    const [workoutData, setWorkoutData] = useState([]);
    const [weightsData, setWeightsData] = useState([]);
    const [dietData, setDietData] = useState([]);
    const [dateSelected, setDateSelected] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleDateSelection = async (e) => {
        const selectedDate = e.target.value;
        setDateSelected(selectedDate);

        if (!selectedDate) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        setErrorMessage(''); // Clear any existing error message

        try {
            // Fetch Workout Data
            const workoutResponse = await axios.get(`http://localhost:3001/api/getWorkoutByDate?date=${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (workoutResponse.data.success && workoutResponse.data.workouts.length > 0) {
                setWorkoutData(workoutResponse.data.workouts);
            } else {
                setWorkoutData([]);
                setErrorMessage('No Workout Data Found for the selected date.');
            }

            // Fetch Weights Data
            const weightsResponse = await axios.get('http://localhost:3001/api/getUserWeights', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(weightsResponse.data.data)
            if(weightsResponse.data.data){
                // weightsResponse.data.data.forEach(item => {
                //     // Modify the intake_date to format it as 'YYYY-MM-DD'
                //     item.date = item.date.split('T')[0];
                // });
                setWeightsData(weightsResponse.data.data);
            }
            else{
                alert(weightsResponse.data.message)
            }

            // Fetch Diet Data
            const dietResponse = await axios.get(`http://localhost:3001/api/getUserDietbyDate?date=${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (dietResponse.data.data && dietResponse.data.data.length > 0) {
                setDietData(dietResponse.data.data);
            } else {
                setDietData([]);
                setErrorMessage(prev => prev + ' No Diet Data Found.');
            }

        } catch (error) {
            if (error.response.status === 401) {
                alert("Session Expired, Please Login Again!")
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:3000/login';
            } else {
                console.error('Error fetching data:', error);
                setErrorMessage('Error fetching data. Please try again later.');
                setWorkoutData([]);
                setWeightsData([]);
                setDietData([]);
            }
        }
    };

    return (
        <>
            <LoginMenu />
            <div className="container mt-4 pb-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <h4>Select a Date</h4>
                        <input
                            type="date"
                            value={dateSelected}
                            onChange={handleDateSelection}
                            className="form-control"
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="row mb-3">
                    <div className="col-md-6">
                        <WorkoutBarChart data={workoutData} />
                    </div>
                    <div className="col-md-6">
                        <DietPieChart data={dietData} />
                    </div> 
                    <div className="col-md-6">
                        <WeightLineChart data={weightsData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Visualizations;