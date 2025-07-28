const schedule = require('node-schedule');
const { sendEmail } = require('./email.service');

class NotificationService {
    constructor(io) {
        this.io = io;
        this.userSockets = new Map(); // Store user socket connections
    }

    // Handle user connection
    handleConnection(socket) {
        socket.on('authenticate', (userId) => {
            this.userSockets.set(userId, socket.id);
            console.log(`User ${userId} connected`);
        });

        socket.on('disconnect', () => {
            // Remove user from userSockets
            for (let [userId, socketId] of this.userSockets.entries()) {
                if (socketId === socket.id) {
                    this.userSockets.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    }

    // Send notification to specific user
    sendNotification(userId, notification) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.io.to(socketId).emit('notification', notification);
        }
    }

    // Schedule due date notification
   scheduleDueDateNotification(task) {
    const notificationTime = new Date(task.dueDate);
    notificationTime.setHours(notificationTime.getHours() - 1);
    schedule.scheduleJob(notificationTime, () => {
        this.sendNotification(task.createdBy.toString(), {
            type: 'DUE_DATE',
            title: 'Task Due Soon',
            message: `Task "${task.title}" is due in 1 hour`,
            taskId: task._id
        });
        // If user is not connected, send email
        const socketId = this.userSockets.get(task.createdBy.toString());
        if (!socketId) {
            sendEmail(task.createdBy.email, 'Task Due Reminder', `Task "${task.title}" is due in 1 hour!`);
        }
    });
}
}

module.exports = NotificationService;