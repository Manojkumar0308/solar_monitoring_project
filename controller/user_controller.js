const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req,res)=>{

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Typically use 10 salt rounds
        const [insertResult] = await db.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        // Fetch the newly inserted user's details
        const [userResult] = await db.query('SELECT * FROM user WHERE id = ?', [insertResult.insertId]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found after insertion' });
        }

        res.status(200).json(userResult[0]);
    } catch (error) {
        console.error('Error registering user:', error); // Improved error logging
        res.status(500).json({ error: 'Error registering user' });
    }
}

const usersList = async (req,res)=>{
    try {
        const userData =await db.query("SELECT * FROM user");
        if(!userData){
           return res.status(404).send({
            success:false,
            message:"No Record Found",
        
           })
        }
        res.status(200).send({
            success: true,
            message:"User List Found",
            totalUser:userData[0].length,
            userData:userData[0]
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in calling GET all student Api',
            error
        })
        
    }
}

const userLogin = async (req,res)=>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
}
module.exports = { createUser,usersList,userLogin};