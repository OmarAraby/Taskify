const router = require('express').Router();
const { protectionMW } = require('../../middlewares/auth.middleware');
const validateSchema = require('../../utils/validation/validateSchema');
const { tagSchemaValidation } = require('./tag.schema');
const {
    createTag,
    getAllTags,
    getTag,
    updateTag,
    deleteTag
} = require('./tag.controller');

// All routes are protected
router.use(protectionMW);

router.route('/')
    .post(validateSchema(tagSchemaValidation), createTag)
    .get(getAllTags);

router.route('/:id')
    .get(getTag)
    .put(validateSchema(tagSchemaValidation), updateTag)
    .delete(deleteTag);

module.exports = router;