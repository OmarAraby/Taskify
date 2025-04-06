const express = require('express');
require('dotenv').config();

const connectionDB = require('./db/connectionDB');
const { globalErrorHandler } = require('./src/middlewares/errorHandler.middleware');
const categoryRoutes = require('./src/modules/Category/category.routes');
const authRoutes = require('./src/modules/User/user.routes');
const tagRoutes = require('./src/modules/Tag/tag.routes')
const taskRoutes = require('./src/modules/Task/task.routes');


const PORT=process.env.PORT||9999;
const app = express();



// connect database
connectionDB();

// middleware 
app.use(express.json());


// routes
app.use('/api/category', categoryRoutes);  // remove the comment
app.use('/api/auth',authRoutes)
app.use('/api/tag',tagRoutes)
app.use('/api/task', taskRoutes)







// global error handler 
app.use(globalErrorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

});