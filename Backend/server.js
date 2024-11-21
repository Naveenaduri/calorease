const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ssdi_backend_user', 
    password: 'Qwerty567@',
    database: 'final_project_ssdi'
});

const secretKey = 'SSDI_FINAL_KEY_FOR_JWT'

const jwtMiddleware = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

const closeMysqlConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed');
        }
    });
};

function transformDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateSalt() {
    return crypto.randomBytes(32).toString('hex');
}

function encryptPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

//API for signup
app.post('/api/signup', async (req, res) => {
    const { first_name, last_name, password, email, gender, birth_date, height, initial_weight, phone_number } = req.body;
    const salt = generateSalt();
    const hashedPassword = encryptPassword(password, salt);
    const date = transformDate(new Date());
    console.log(new Date(), date, birth_date)
    connection.query(
        'INSERT INTO user (first_name, last_name, email, password, salt, created_date, gender, birth_date, height, initial_weight, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, salt, date, gender, birth_date, height, initial_weight, phone_number],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({success: false, error: error.sqlMessage });
            } else {
                res.json({status: 200, success: true, response: results });
            }
        }
    );
});

app.post('/api/login', async (req, res) => {
    const { password, email } = req.body;

    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve user' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                const hashedPassword = encryptPassword(password, user.salt);

                if (hashedPassword === user.password) {
                    const token = jwt.sign(
                        { email: user.email, userId: user.id },
                        secretKey,
                        { expiresIn: '59m' }
                    );

                    res.json({
                        success: true,
                        message: 'Login successful',
                        user: { email: user.email, first_name: user.first_name, last_name: user.last_name, user_id : user.id },
                        token: token
                    });
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect password' });
                }
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        }
    });
});

app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        jwt.verify(token, secretKey);
        res.setHeader('Clear-Token', 'true');
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

// Endpoint to get user details
app.get('/api/user', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;

    const query = `SELECT id, first_name, last_name, email, gender, birth_date, height, initial_weight, phone_number, created_date FROM user WHERE id = ?`;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user data:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];
        res.json({ success: true, user });
    });
});

app.post('/api/alteruser', jwtMiddleware, (req, res) => {
    const { first_name, last_name, email, gender, phone_number, height, birth_date } = req.body;
    const userId = req.auth.userId;

    if (!first_name || !last_name || !email || !gender || !phone_number || !height || !birth_date) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const query = `
        UPDATE user 
        SET first_name = ?, last_name = ?, email = ?, gender = ?, phone_number = ?, height = ?, birth_date = ? 
        WHERE id = ?
    `;

    const values = [first_name, last_name, email, gender, phone_number, height, birth_date, userId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating user data:', error);
            return res.status(500).json({ success: false, message: 'Failed to update user data' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log(results)

        res.json({ success: true, message: 'User data updated successfully' });
    });
});

app.post('/api/refreshToken', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const newAccessToken = jwt.sign(
            { email: decoded.email, userId: decoded.userId },
            secretKey,
            { expiresIn: '5m' }
        );
        res.json({ success: true, message: 'Token refreshed successfully', accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
});

// Delete user and cascade delete associated weight entries
app.delete('/api/deleteuser', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId; // Get user ID from token

    const deleteUserQuery = `DELETE FROM user WHERE id = ?`;

    connection.query(deleteUserQuery, [userId], (error, userResults) => {
        if (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete user' });
        }

        if (userResults.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    });
});

// Change user password
app.post('/api/changepassword', jwtMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.auth.userId;

    // First, retrieve the current password hash and salt from the database
    connection.query('SELECT password, salt FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user data:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];
        const currentHashedPassword = encryptPassword(currentPassword, user.salt);

        // Check if the provided current password matches the stored password
        if (currentHashedPassword !== user.password) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        // Generate a new salt and hash for the new password
        const newSalt = generateSalt();
        const newHashedPassword = encryptPassword(newPassword, newSalt);

        // Update the password and salt in the database
        connection.query(
            'UPDATE user SET password = ?, salt = ? WHERE id = ?',
            [newHashedPassword, newSalt, userId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating password:', updateError);
                    return res.status(500).json({ success: false, message: 'Failed to update password' });
                }

                res.json({ success: true, message: 'Password updated successfully' });
            }
        );
    });
});

// Insert weight for user
app.post('/api/updateweight', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId; // Get user ID from token
    const { weight, date } = req.body;

    if (!weight || !date) {
        return res.status(400).json({ success: false, message: 'Weight and date are required' });
    }

    const query = `INSERT INTO user_weight (weight, user_id, date) VALUES (?, ?, ?)`;
    const values = [weight, userId, date];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting weight:', error);
            return res.status(500).json({ success: false, message: 'Failed to insert weight' });
        }

        res.json({ success: true, message: 'Weight updated successfully' });
    });
});

// Update a specific weight for a user
app.post('/api/editUserWeight', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId; // Get user ID from token
    const { weightId, newWeight, date } = req.body; // Get weight data from request body

    if (!weightId || !newWeight || !date) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const query = `UPDATE user_weight SET weight = ?, date = ? WHERE user_id = ? AND id = ?`;
    const values = [newWeight, date, userId, weightId];

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error('Error updating user weight:', error);
            return res.status(500).json({ success: false, message: 'Failed to update weight' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Weight record not found' });
        }

        res.json({ success: true, message: 'Weight updated successfully' });
    });
});


// Get all weights for a user
app.get('/api/getUserWeights', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId; // Get user ID from token

    const query = `SELECT * FROM user_weight WHERE user_id = ? ORDER BY date DESC`;
    const values = [userId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error fetching user weights:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch user weights' });
        }

        res.json({ success: true, data: results });
    });
});

// Delete weight entry
app.delete('/api/deleteWeightEntry/:id', jwtMiddleware, (req, res) => {
    const  entryId  = req.params.id;
    const userId = req.auth.userId;

    if (!entryId) {
        return res.status(400).json({ success: false, message: 'EntryId is required' });
    }

    const query = 'DELETE FROM user_weight WHERE id = ? AND user_id = ?';
    connection.query(query, [entryId, userId], (error, results) => {
        if (error) {
            console.error('Error deleting weight entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete weight entry' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Weight entry not found' });
        }

        res.json({ success: true, message: 'Weight entry deleted successfully' });
    });
});

// Get user diet entries by date
app.get('/api/getUserDietByDate', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Get user ID from the token
    const { date } = req.query;  // Get the date from the query parameters

    if (!date) {
        return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const query = `
        SELECT id, name, calories, protein, intake_date, serving_quantity
        FROM user_food
        WHERE user_id = ? AND intake_date = ?
    `;

    connection.query(query, [userId, date], (error, results) => {
        if (error) {
            console.error('Error retrieving user diet by date:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve user diet by date' });
        }

        if (results.length === 0) {
            return res.status(200).json({ success: true, message: 'No diet entries found for this date' });
        }

        res.json({ success: true, data: results });
    });
});

// Insert food entry for user
app.post('/api/addUserFood', jwtMiddleware, async (req, res) => {
    const { name, calories, protein, intake_date, serving_quantity } = req.body;
    const userId = req.auth.userId; // Assuming the token contains user ID

    if (!name || calories < 0 || protein < 0 || !intake_date || !serving_quantity) {
        return res.status(400).json({ error: 'All fields are required and must be valid.' });
    }

    const insertQuery = `
        INSERT INTO user_food (user_id, name, calories, protein, intake_date, serving_quantity)
        VALUES (${userId}, '${name}', ${calories}, ${protein}, '${intake_date}', '${serving_quantity}');
    `;
    connection.query(insertQuery, (error, results) => {
        if (error) {
            console.error('Error adding food entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to add food entry' });
        }

        res.json({ success: true, message: 'Dietary Entry Added Successfully!', id: results.insertId });
    });
});

app.delete('/api/deleteUserFood/:id', jwtMiddleware, async (req, res) => {
    const foodId = req.params.id;
    const userId = req.auth.userId; // Assuming the token contains user ID

    if (!foodId) {
        return res.status(400).json({ error: 'Food ID is required.' });
    }

    // Query to check if the food entry exists for the user
    const checkQuery = `SELECT * FROM user_food WHERE id = ${foodId} AND user_id = ${userId}`;
    connection.query(checkQuery, (error, results) => {
        if (error) {
            console.error('Error checking food entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to check food entry' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Food entry not found for this user' });
        }

        // Query to delete the food entry
        const deleteQuery = `DELETE FROM user_food WHERE id = ${foodId} AND user_id = ${userId}`;
        connection.query(deleteQuery, (error, results) => {
            if (error) {
                console.error('Error deleting food entry:', error);
                return res.status(500).json({ success: false, message: 'Failed to delete food entry' });
            }

            res.json({ success: true, message: 'Food entry deleted successfully' });
        });
    });
});

// Update food intake entry
app.post('/api/updateFoodEntry/:id', jwtMiddleware, (req, res) => {
    const { name, calories, protein, intake_date, serving_quantity } = req.body;
    const userId = req.auth.userId;
    const entryId = req.params.id;

    if (!name || calories < 0 || protein < 0 || !intake_date || !serving_quantity || !entryId) {
        return res.status(400).json({ error: 'All fields are required and must be valid.' });
    }

    const query = 'UPDATE user_food SET name = ?, calories = ?, protein = ?, intake_date = ?, serving_quantity = ? WHERE id = ? AND user_id = ?';
    connection.query(query, [name, calories, protein, intake_date, serving_quantity, entryId, userId], (error, results) => {
        if (error) {
            console.error('Error updating food entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to update food entry' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Food entry not found' });
        }

        res.json({ success: true, message: 'Food entry updated successfully' });
    });
});

// Insert workout entry
app.post('/api/addWorkout', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId; // Get user ID from token
    const { name, time, calories_burnt, description, workout_date } = req.body;

    if (!name || !time || !calories_burnt || !description || !workout_date) {
        return res.status(400).json({ success: false, message: 'All workout details are required' });
    }

    const query = `
        INSERT INTO user_exercise (name, time, calories_burnt, user_id, workout_date, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, time, calories_burnt, userId, workout_date, description];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error adding workout:', error);
            return res.status(500).json({ success: false, message: 'Failed to add workout' });
        }

        res.json({ success: true, message: 'Workout added successfully' });
    });
});

// Get user workout entries by date
app.get('/api/getWorkoutByDate', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Get user ID from token
    const { date } = req.query;  // Date parameter in query

    if (!date) {
        return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const query = `
        SELECT id, name, time, calories_burnt, workout_date, description
        FROM user_exercise
        WHERE user_id = ? AND workout_date = ?
    `;

    connection.query(query, [userId, date], (error, results) => {
        if (error) {
            console.error('Error retrieving workouts by date:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve workouts' });
        }

        res.json({ success: true, workouts: results });
    });
});

// Update workout entry
app.put('/api/updateWorkout', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;
    const { id, name, time, calories_burnt, workout_date, description } = req.body;

    if (!id || !name || !time || !calories_burnt || !workout_date || !description) {
        return res.status(400).json({ success: false, message: 'All workout details are required' });
    }

    const query = `
        UPDATE user_exercise
        SET name = ?, time = ?, calories_burnt = ?, workout_date = ?, description = ?
        WHERE id = ? AND user_id = ?
    `;
    const values = [name, time, calories_burnt, workout_date, description, id, userId,];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating workout:', error);
            return res.status(500).json({ success: false, message: 'Failed to update workout' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }

        res.json({ success: true, message: 'Workout updated successfully' });
    });
});

// Delete workout entry
app.delete('/api/deleteWorkout', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Workout ID is required' });
    }

    const query = 'DELETE FROM user_exercise WHERE id = ? AND user_id = ?';
    connection.query(query, [id, userId], (error, results) => {
        if (error) {
            console.error('Error deleting workout:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete workout' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }

        res.json({ success: true, message: 'Workout deleted successfully' });
    });
});


app.get('/', async (req, res) => {
        res.status(200).json({success : true, message : 'Everything is Good.'});
});

const server = app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

// Close the server and MySQL connection when the tests are finished
process.on('exit', () => {
    server.close();
    closeMysqlConnection();
    console.log('Server and MySQL connection closed');
});

module.exports = app;