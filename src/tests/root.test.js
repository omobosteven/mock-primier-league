import request from 'supertest';
import app from '../app';

describe('Test root Endpoint', () => {
    it('should return message on root endpoint', async (done) => {
        const res = await request(app)
            .get('/');
        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('mock premier league!!!');
        done();
    });

    it('should return error if route does not exist', async (done) => {
        const res = await request(app)
            .get('/ksfjd');
        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('Route GET /ksfjd not found.');
        done();
    });
});
