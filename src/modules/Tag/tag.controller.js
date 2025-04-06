const Tag = require('./tag.model');
const APIError = require('../../utils/errors/APIError');
const {asyncHandler} = require('../../middlewares/errorHandler.middleware');



// create tage 
// Create new tag
const createTag = asyncHandler(async (req, res) => {
    const tagData = { ...req.body, createdBy: req.user.id };
    const existingTag = await Tag.findOne({ name: tagData.name });
    
    if (existingTag) {
        throw new APIError('Tag already exists', 400);
    }

    const tag = await Tag.create(tagData);
    res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        tag
    });
});



// get all tags
const getAllTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({createdBy: req.user.id});
    res.json({
        success: true,
        message: 'Tags retrieved successfully',
        count: tags.length,
        tags
    });
});

// get individual tag

const getTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findOne({ 
        _id: req.params.id,
        createdBy: req.user.id 
    });
    if (!tag) {
        return next(new APIError("Tag not found", 404));
    }
    res.json({
        success: true,
        message: "Tag retrieved successfully",
        tag
    });
});


// update tag
 const updateTag = asyncHandler(async(req,res)=>{
    const tag = await Tag.findOneAndUpdate({
        _id: req.params.id,
        createdBy:req.user.id
    },req.body,{
        new: true,
        runValidators: true
    })

    if(!tag){
        return next(new APIError("Tag not found", 404));
    }

    res.json({
        success: true,
        message: "Tag updated successfully",
        tag
    });
 })


 // delete tag

 const deleteTag = asyncHandler(async (req,res)=>{
    const tag = await Tag.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
    });
    if(!tag){
        return next(new APIError("Tag not found", 404));
    }

    res.json({
        success: true,
        message: "Tag deleted successfully"
    });
 }
 )


 module.exports = {
    createTag,
    getAllTags,
    getTag,
    updateTag,
    deleteTag
 }