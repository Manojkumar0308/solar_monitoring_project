const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { emitLogin } = require('../socket');
const createUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertResult] = await db.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        // Fetch the newly inserted user's details
        const [userResult] = await db.query('SELECT id, email FROM user WHERE id = ?', [insertResult.insertId]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found after insertion' });
        }

        res.status(200).json(userResult[0]);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

// List Users
const usersList = async (req, res) => {
    try {
        const [userData] = await db.query("SELECT id, email FROM user");
        
        if (userData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No records found",
            });
        }
        
        res.status(200).send({
            success: true,
            message: "User list found",
            totalUser: userData.length,
            userData: userData
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send({
            success: false,
            message: 'Error retrieving users',
            error
        });
    }
};

// User Login
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]); // Selecting all user info
        if (rows.length === 0){
            return res.status(401).json({ error: 'Invalid credentials' });
        } 

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
            
           

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('userId',user.id)
        
       
        // Remove password from user object before sending response
        delete user.password;
       
    emitLogin( { id: user.id, username: user.email });
        return res.status(200).json({ message: 'Login successful', token, user });
       
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Error logging in' });
    }
};

// Update User Information
const userUpdate = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({
                success: false,
                message: "No fields to update"
            });
        }

        const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(decoded.id); // Add the user ID at the end for the WHERE clause

        const updateQuery = `UPDATE user SET ${fields} WHERE id = ?`;

        try {
            const [updateResults] = await db.query(updateQuery, values);
            if (updateResults.affectedRows === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'User not found'
                });
            }

            const [rows] = await db.query('SELECT id, email FROM user WHERE id = ?', [decoded.id]);
            const updatedUser = rows[0];
            res.send({
                success: true,
                message: 'User updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send({
                success: false,
                message: 'Error updating user'
            });
        }
    });
};

// Update Password
const updatePassword = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const { password } = req.body;
        if (!password || password.trim() === '') {
            return res.status(400).json({ success: false, error: 'Password field is required and cannot be empty' });
        }

        try {
            const hashedNewPassword = await bcrypt.hash(password, 10);
            await db.query('UPDATE user SET password = ? WHERE id = ?', [hashedNewPassword, decoded.id]);

            const [updatedRows] = await db.query('SELECT id, email FROM user WHERE id = ?', [decoded.id]);
            const updatedUser = updatedRows[0];

            res.status(200).json({ 
                success: true, 
                message: 'Password updated successfully', 
                user: updatedUser 
            });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ success: false, error: 'Error updating password' });
        }
    });
};



module.exports = { createUser,usersList,userLogin,userUpdate,updatePassword};