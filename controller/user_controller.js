const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req,res)=>{

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Typically use 10 salt rounds
        const [insertResult] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        // Fetch the newly inserted user's details
        const [userResult] = await db.query('SELECT * FROM users WHERE id = ?', [insertResult.insertId]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found after insertion' });
        }

        res.status(200).json(userResult[0]);
    } catch (error) {
        console.error('Error registering user:', error); // Improved error logging
        res.status(500).json({ error: 'Error registering user' });
    }
}
module.exports = { createUser };