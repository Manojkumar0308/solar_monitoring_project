const db = require('../config/db');
const {emitSensorData} = require('../socket')
const sendSensorData =async (req,res)=>{
    const {email,temperature,humidity,current,voltage} = req.body;
    const sendingTime = new Date();
    if (!email) {
        return res.status(400).send('Email is required');
      }
   
    try {
        const query = 'SELECT id FROM user WHERE email = ?';
        const [results] = await db.query(query, [email]);
    
        if (results.length === 0) {
          return res.status(404).send('User not found');
        }
    
        const userId = results[0].id;
    
        // Log the user ID
        console.log("User ID retrieved:", userId);

         emitSensorData(
            {email,userId,temperature,humidity,current,voltage,sendingTime}
        );

      res.status(200).send({
        success:true,
        message:"Data sent successfully",
        
      })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Internal server error",
            error:error
        })
    }
}


module.exports ={sendSensorData};