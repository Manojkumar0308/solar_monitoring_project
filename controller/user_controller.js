const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req,res)=>{

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Username and password are required' });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 20);
        const [result] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.status(200).json({ id: result.insertId, email });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
}
module.exports = { createUser };