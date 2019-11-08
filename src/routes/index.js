import express from 'express';
import users from './users';

const routes = express.Router();

routes.use('/api/users', users);
routes.use('/api/admin', users);

export default routes;
