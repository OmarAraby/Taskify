const Task = require('./task.model');
const APIError = require ('../../utils/errors/APIError');
const {asyncHandler} = require('../../middlewares/errorHandler.middleware');
const APIFeatures = require('../../utils/apiFeatures');
const { getNotificationService } = require('../../utils/notification');



// create task
const createTask = asyncHandler(async (req,res,next) => {
    const taskData = {...req.body, createdBy: req.user.id};
    const task = await Task.create(taskData);

    // tag populated
    await task.populate(['tags','category']);

    // Schedule due date notification
    const notificationService = getNotificationService();
    notificationService.scheduleDueDateNotification(task);

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task
    });
});


// get all tasks with our apiFeatures ==> sorting , filter,pagination
const getAllTasks = asyncHandler(async(req,res)=>{
    const features = new APIFeatures(Task.find({createdBy:req.user.id}),req.query)
    .filter()
    .sort()
    .search()
    .paginate();

    // In getAllTasks
    const tasks = await features.query.populate(['tags', 'category']);

    const total = await Task.countDocuments({createdBy:req.user.id});
    
    res.json({
        success: true,
        message: 'Tasks fetched successfully',
        count: tasks.length, // count of tasks that return in response --> after apply filter or search results
        total, // get total tasks count for user without filtering or pageiating
        page: features.page,
        limit: features.limit,
        totalPages: Math.ceil(total / features.limit),
        tasks
    });
    
})


// get individual task
const getTask = asyncHandler(async(req,res) => {
    const task = await Task.findOne({_id: req.params.id, createdBy: req.user.id}).populate(['tags','category']);;
    if(!task){
        throw new APIError('Task not found',404);
    }
    res.json({
        success: true,
        message: 'Task fetched successfully',
        task
    })
});

// update task

const updateTask = asyncHandler(async(req,res) => {
    const task = await Task.findOneAndUpdate({_id: req.params.id, createdBy: req.user.id},
                     req.body, {new: true, runValidators: true}).populate(['tags','category']);
    if(!task){
        throw new APIError('Task not found',404);
    }
    res.json({
        success: true,
        message: 'Task updated successfully',
        task
    })
});

// delete task
const deleteTask = asyncHandler(async(req,res) => {
    const task = await Task.findOneAndDelete({_id: req.params.id, createdBy: req.user.id});
    if(!task){
        throw new APIError('Task not found',404);
    }
    res.json({
        success: true,
        message: 'Task deleted successfully',
        task
    })
});


// update task status

const updateTaskStatus = asyncHandler(async(req,res) => {
    const task = await Task.findOneAndUpdate({_id: req.params.id, createdBy: req.user.id},
                {status: req.body.status}, {new: true}).populate(['tags','category']);
    if(!task){
        throw new APIError('Task not found',404);
    }
    res.json({
        success: true,
        message: 'Task status updated successfully',
        task
    })
});


module.exports = {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus
};

