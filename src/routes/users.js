import express from 'express';
import Users from '../controllers/UsersController';
import UserInputValidation from '../middlewares/validations/userValidation';

const users = express.Router();

users.post('/register', UserInputValidation.validateSignupInput, Users.signupUser);
users.post('/login', UserInputValidation.validateLoginInput, Users.loginUser);

export default users;
