
//To access database 
const db = require('../config/db');


//get All Sites
const addSites = async (req,res)=>{
    try {
        const {sitename ,c_email,latitude,longitude,created_at} = req.body;
        if(!sitename || !c_email || !latitude || !longitude || !created_at ){
            return
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error:error
        })
    }
}

module.exports ={addSites};