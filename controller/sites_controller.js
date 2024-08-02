
//To access database 
const db = require('../config/db');
const axios = require('axios');
//add new sites
const addSites = async (req, res) => {
    try {
        const { sitename, c_email, latitude, longitude } = req.body;

        // Validate that all required fields are provided
        if (!sitename || !c_email || !latitude || !longitude) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(c_email)) {
            return res.status(400).send({
                success: false,
                message: "Invalid email format"
            });
        }

        // Construct the SQL query for inserting new site data
        const insertQuery = `
            INSERT INTO clientList (sitename, c_email, latitude, longitude, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;

        // Execute the SQL query
        const [result] = await db.query(insertQuery, [sitename, c_email, latitude, longitude]);

        // Fetch the newly inserted site details
        const [rows] = await db.query('SELECT * FROM clientList WHERE c_email = ?', [c_email]);

        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Site not found after insertion'
            });
        }

        const addedSite = rows[0];
        
        res.status(200).send({
            success: true,
            message: "Site added successfully",
            site: addedSite
        });
    } catch (error) {
        console.error('Error adding site:', error); // Improved error logging
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

const getSitesList = async (req, res) => {
    try {
        // Fetch all sites from the database
        const [sites] = await db.query('SELECT * FROM clientList');

        if (sites.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No sites found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Sites list fetched successfully',
            totalSites: sites.length,
            sites
        });
    } catch (error) {
        console.error('Error fetching sites list:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching sites list',
            error: error.message
        });
    }
};


module.exports ={addSites,getSitesList};