import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import models from '../../models';
import testData from '../testData';

const { User } = models;

const {
    user,
    admin
} = testData;

describe('Test auth Endpoint', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await User.create(user);
        await User.create(admin);
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should login user successfully', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'password'
            });
        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('login successful');
        expect(res.body.data.is_admin).toBe(false);
        done();
    });


    it('should login admin successfully', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: 'admin',
                password: 'password'
            });
        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('login successful');
        expect(res.body.data.is_admin).toBe(true);
        done();
    });

    it('should return error if username is wrong', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: 'testuser2',
                password: 'password'
            });
        expect(res.status).toEqual(400);
        expect(res.body.message).toBe('wrong username or password');
        done();
    });


    it('should return error if password is wrong', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                password: 'password2'
            });
        expect(res.status).toEqual(400);
        expect(res.body.message).toBe('wrong username or password');
        done();
    });


    it('should return error if login input fields are empty', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: '',
                password: ''
            });
        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('username is required');
        expect(res.body.errors[1].message).toBe('password is required');
        done();
    });
});
