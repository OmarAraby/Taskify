const express = require('express');
require('dotenv').config();

const connectionDB = require('./db/connectionDB');
const { globalErrorHandler } = require('./src/middlewares/errorHandler.middleware');
const categoryRoutes = require('./src/modules/Category/category.routes');

const PORT=process.env.PORT||9999;
const app = express();



// connect database
connectionDB();

// middleware 
app.use(express.json());


// routes
app.use('/category', categoryRoutes);  // remove the comment








// global error handler 
app.use(globalErrorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

});