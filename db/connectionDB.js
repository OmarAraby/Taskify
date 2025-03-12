const mongoose = require('mongoose');
require('dotenv').config();

const connectionDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
       
         console.log('MongoDB connected Successfully...');

         
        }catch(err){
            console.log("Error connecting to Database", err);
            process.exit(1);
        }
    }

module.exports = connectionDB;
