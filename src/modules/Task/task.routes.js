const router = require('express').Router();
const { protectionMW } = require('../../middlewares/auth.middleware');
const validateSchema = require('../../utils/validation/validateSchema');
const { taskSchemaValidation, updateTaskStatusSchema } = require('./task.schema');
const {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskStats
} = require('./task.controller');

// Protect all routes
router.use(protectionMW);

// Task routes
router.route('/')
    .post(validateSchema(taskSchemaValidation), createTask)
    .get(getAllTasks);
// Dashboard statistics route
router.get('/stats', getTaskStats);

router.route('/:id')
    .get(getTask)
    .put(validateSchema(taskSchemaValidation), updateTask)
    .delete(deleteTask);

router.patch('/:id/status', validateSchema(updateTaskStatusSchema), updateTaskStatus);



module.exports = router;