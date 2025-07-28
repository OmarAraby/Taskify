const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { initNotificationService } = require('./src/utils/notification');
require('dotenv').config();

const connectionDB = require('./db/connectionDB');
const { globalErrorHandler } = require('./src/middlewares/errorHandler.middleware');
const categoryRoutes = require('./src/modules/Category/category.routes');
const authRoutes = require('./src/modules/User/user.routes');
const tagRoutes = require('./src/modules/Tag/tag.routes')
const taskRoutes = require('./src/modules/Task/task.routes');


const PORT=process.env.PORT||9999;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

// Initialize notification service
const notificationService = initNotificationService(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    notificationService.handleConnection(socket);
});

// connect database
connectionDB();

// middleware 
app.use(express.json());


// routes
app.use('/api/category', categoryRoutes);  
app.use('/api/auth',authRoutes)
app.use('/api/tag',tagRoutes)
app.use('/api/task', taskRoutes)







// global error handler 
app.use(globalErrorHandler)


// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});