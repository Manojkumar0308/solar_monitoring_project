const db = require('../../config/db');
const sendNotification = async (req, res) => {
    const { title, message, email } = req.body;
    const sendingTime = new Date();

    // Step 1: Look up user IDs by email
    const emailPlaceholders = email.map(() => '?').join(',');
    const query = `SELECT id FROM user WHERE email IN (${emailPlaceholders})`;

    try {
        // Fetch user IDs
        const [results] = await db.query(query, email);
        const userIds = results.map(row => row.id);

        // Log the user IDs
        console.log("User IDs retrieved:", userIds);

        // Step 2: Send notifications to the user IDs
        for (const userId of userIds) {
            // Emit notification to the user
           

            // Save notification to the database
            const insertQuery = `INSERT INTO notifications (title, message, userId, sendingTime) VALUES (?, ?, ?, ?)`;
            await db.query(insertQuery, [title, message, userId, sendingTime]);
        }

        res.status(200).send('Notifications sent');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error sending notifications');
    }
};


 module.exports = {sendNotification}