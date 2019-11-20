import express from 'express';
import root from './root';
import auth from './auth';
import team from './team';
import fixture from './fixture';
import search from './search';

const routes = express.Router();

routes.use('/', root);
routes.use('/api/v1/', root);
routes.use('/api/v1/auth', auth);
routes.use('/api/v1/teams', team);
routes.use('/api/v1/fixtures', fixture);
routes.use('/api/v1/search', search);

routes.use((req, res, next) => {
    return res.status(404).send({
        status: 404,
        message: `Route ${req.method} ${req.url} not found.`
    });
});

routes.use((error, req, res, next) => {
    return res.status(500).send({
        status: 500,
        message: 'internal server error'
    });
});

export default routes;
