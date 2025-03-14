const router = require('express').Router();
const validateSchema = require('../../utils/validation/validateSchema');
const {register} = require('./user.controller');

const {userSchemaValidation} = require('./user.schema');


router.post('/register',validateSchema(userSchemaValidation), register);


module.exports = router;

