const Category = require('./category.model');
const { asyncHandler } = require('../../middlewares/errorHandler.middleware');
const APIError = require('../../utils/errors/APIError');

const createCategory = asyncHandler(async (req, res,next) => {
    console.log('Request body:', req.body);
    const { name, description } = req.body;
    const createdBy = req.user.id;
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            throw new APIError('Category already exists', 400);
        }
        // Create new category
        const category = await Category.create({ name, description,createdBy });
        console.log('Created category:', category);
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
});

// get all categories
const getAllCategory= asyncHandler(async (req,res,next)=>{
    const categories = await Category.find({createdBy: req.user.id});
    res.json({
        success: true,
        message: 'Categories retrieved successfully',
        categories: categories,
    });
})


// get category by id
const getCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        throw new APIError('Category not found', 404);
    }
    res.json({
        success: true,
        message: 'Category retrieved successfully',
        category: category,
    });
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
    const {id}= req.params;
    const {name,description}= req.body;
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) {
        throw new APIError('Category not found', 404);
    }
    res.json({
        success: true,
        message: 'Category updated successfully',
        category: category,
    });

})

// delete category
const deleteCategory =asyncHandler(async(req,res)=>{
    const {id}=req.params
    const category= await Category.findByIdAndDelete(id);
    if(!category){
        throw new APIError('Category not found', 404);
    }

    res.json({
        success: true,
        message: 'Category deleted successfully',
    });
})



module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};
