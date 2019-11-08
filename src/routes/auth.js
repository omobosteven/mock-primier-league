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
    checkExistingUsernameEmail,
    checkUserUsernamePassword
} = Checker;

const {
    signupUser
} = Users;

auth.post('/register',
    validateSignupInput,
    checkExistingUsernameEmail,
    signupUser);

auth.post('/login',
    validateLoginInput,
    checkUserUsernamePassword,
    Users.loginUser);

export default auth;
