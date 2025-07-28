const Task = require('./task.model');
const mongoose = require('mongoose');
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


// Get task statistics for dashboard
const getTaskStats = asyncHandler(async(req, res) => {
    // Convert user ID 
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Date calculations
    const now = new Date();
    const today = new Date(now);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get completion trend data
    const { period = 'week' } = req.query;
    
    let groupBy;
    let dateFormat;
    let trendStartDate;
    
    if (period === 'week') {
        // Last 7 days
        trendStartDate = new Date(now);
        trendStartDate.setDate(now.getDate() - 6);
        trendStartDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } };
        dateFormat = 'day';
    } else if (period === 'month') {
        // Last 30 days
        trendStartDate = new Date(now);
        trendStartDate.setDate(now.getDate() - 29);
        trendStartDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } };
        dateFormat = 'day';
    } else if (period === 'year') {
        // Last 12 months
        trendStartDate = new Date(now);
        trendStartDate.setMonth(now.getMonth() - 11);
        trendStartDate.setDate(1);
        trendStartDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m', date: '$updatedAt' } };
        dateFormat = 'month';
    } else {
        // Default to week if invalid period
        trendStartDate = new Date(now);
        trendStartDate.setDate(now.getDate() - 6);
        trendStartDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } };
        dateFormat = 'day';
    }

    // Run all queries in parallel for better performance
    const [
        statusCountsArray,
        priorityCountsArray,
        dueTodayCount,
        dueThisWeekCount,
        dueThisMonthCount,
        overdueCount,
        recentTasks,
        tasksByCategory,
        completedTasksTrend
    ] = await Promise.all([
        // Status counts
        Task.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        
        // Priority counts
        Task.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        
        // Due today
        Task.countDocuments({
            createdBy: userId,
            dueDate: { $gte: startOfDay, $lte: endOfDay }
        }),
        
        // Due this week
        Task.countDocuments({
            createdBy: userId,
            dueDate: { $gte: startOfWeek, $lte: endOfWeek }
        }),
        
        // Due this month
        Task.countDocuments({
            createdBy: userId,
            dueDate: { $gte: startOfMonth, $lte: endOfMonth }
        }),
        
        // Overdue tasks
        Task.countDocuments({
            createdBy: userId,
            dueDate: { $lt: now },
            status: { $ne: 'completed' }
        }),
        
        // Recent tasks
        Task.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate(['tags', 'category']),
            
        // Tasks by category
        Task.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'categoryInfo'
            }},
            { $unwind: '$categoryInfo' },
            { $project: {
                categoryName: '$categoryInfo.name',
                count: 1
            }}]),
            
        // Completion trend
        Task.aggregate([
            {
                $match: {
                    createdBy: userId,
                    status: 'completed',
                    updatedAt: { $gte: trendStartDate }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
    ]);
    
    // Convert arrays to objects
    const statusCounts = {};
    statusCountsArray.forEach(item => {
        statusCounts[item._id] = item.count;
    });
    
    const priorityCounts = {};
    priorityCountsArray.forEach(item => {
        priorityCounts[item._id] = item.count;
    });

    res.json({
        success: true,
        message: 'Task statistics fetched successfully',
        stats: {
            byStatus: statusCounts,
            byPriority: priorityCounts,
            byDueDate: {
                today: dueTodayCount,
                thisWeek: dueThisWeekCount,
                thisMonth: dueThisMonthCount,
                overdue: overdueCount
            },
            byCategory: tasksByCategory,
            recentTasks,
            completionTrend: {
                period,
                dateFormat,
                data: completedTasksTrend
            }
        }
    });
});



module.exports = {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskStats
};

