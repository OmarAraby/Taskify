const router = require('express').Router();
const { protectionMW } = require('../../middlewares/auth.middleware');
const validateSchema = require('../../utils/validation/validateSchema');
const {
    register, 
    login, 
    getAllUsers, 
    updateUser, 
    forgotPassword,
    resetPassword,
    changePassword
} = require('./user.controller');

const {
    userSchemaValidation, 
    loginSchemaValidation, 
    updateProfileSchemaValidation, 
    forgetPassValidationSchema,
    resetPassValidationSchema,
    changePasswordSchema
} = require('./user.schema');

router.post('/register', validateSchema(userSchemaValidation), register);
router.post('/login', validateSchema(loginSchemaValidation), login);
router.get('/users', getAllUsers);
router.put('/update-profile', protectionMW, validateSchema(updateProfileSchemaValidation), updateUser);
router.post('/forgot-password', validateSchema(forgetPassValidationSchema), forgotPassword);
router.patch('/change-password', protectionMW, validateSchema(changePasswordSchema), changePassword);
router.post('/reset-password/:resetToken', validateSchema(resetPassValidationSchema), resetPassword);

module.exports = router;

