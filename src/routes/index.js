import express from 'express';
import root from './root';
import auth from './auth';
import team from './team';

const routes = express.Router();

routes.use('/', root);
routes.use('/api/v1/auth', auth);
routes.use('/api/v1/auth/admin', auth);
routes.use('/api/v1/teams', team);

export default routes;
