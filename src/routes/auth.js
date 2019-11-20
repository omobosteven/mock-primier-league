import express from 'express';
import Users from '../controllers/AuthController';
import Checker from '../middlewares/Checker';
import UserInputValidation from
    '../middlewares/validations/UserInputValidation';

const auth = express.Router();

const {
    validateSignupInput,
    validateLoginInput
} = UserInputValidation;

const {
    checkDuplicateUser,
    checkUsernamePassword
} = Checker;

const {
    signupUser,
    signupAdmin,
    loginUser,
} = Users;

auth.post('/register',
    validateSignupInput,
    checkDuplicateUser,
    signupUser);

auth.post('/admin/register',
    validateSignupInput,
    checkDuplicateUser,
    signupAdmin);

auth.post('/login',
    validateLoginInput,
    checkUsernamePassword,
    loginUser);

export default auth;
