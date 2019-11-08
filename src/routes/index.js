import express from 'express';
import auth from './auth';

const routes = express.Router();

routes.use('/api/v1/auth', auth);
routes.use('api/v1/auth/admin', auth);

export default routes;
