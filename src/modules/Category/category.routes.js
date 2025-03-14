const router = require('express').Router();  
const {createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory}= require('./category.controller');
const validateSchema = require('../../utils/validation/validateSchema');
const {categorySchemaValidation}= require('./category.schema');



router.post('/add-category', validateSchema(categorySchemaValidation), createCategory);
router.get("/AllCategory", getAllCategory)


// params routes 
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);




module.exports = router;