import express from 'express';
import root from './root';
import auth from './auth';
import team from './team';
import fixture from './fixture';
import search from './search';

const routes = express.Router();

routes.use('/', root);
routes.use('/api/v1/auth', auth);
routes.use('/api/v1/auth/admin', auth);
routes.use('/api/v1/teams', team);
routes.use('/api/v1/fixtures', fixture);
routes.use('/api/v1/search', search);

export default routes;
