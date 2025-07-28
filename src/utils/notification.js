// Notification service singleton module
let notificationService = null;

// Initialize the notification service
function initNotificationService(io) {
    const NotificationService = require('../services/notification.service');
    notificationService = new NotificationService(io);
    return notificationService;
}

// Get the notification service instance
function getNotificationService() {
    if (!notificationService) {
        throw new Error('Notification service not initialized');
    }
    return notificationService;
}

module.exports = {
    initNotificationService,
    getNotificationService
};