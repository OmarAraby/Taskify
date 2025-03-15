const router = require('express').Router();
const validateSchema = require('../../utils/validation/validateSchema');
const {register, login} = require('./user.controller');

const {userSchemaValidation, loginSchemaValidation} = require('./user.schema');


router.post('/register',validateSchema(userSchemaValidation), register);
router.post('/login',validateSchema(loginSchemaValidation), login);



module.exports = router;

