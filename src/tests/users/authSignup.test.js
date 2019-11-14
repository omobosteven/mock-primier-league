import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import models from '../../models';
import testData from '../testData';

const { User } = models;

const {
    user,
} = testData;

describe('Test auth Endpoint', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await User.create(user);
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should signup a user successfully', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send({
                username: 'test',
                email: 'test1@test.com',
                password: 'password'
            });
        expect(res.status).toEqual(201);
        expect(res.body.message).toBe('registration successful');
        expect(res.body.data.is_admin).toBe(false);
        done();
    });

    it('should signup an admin successfully', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/admin/register')
            .set('Accept', 'application/json')
            .send({
                username: 'admin',
                email: 'admin@test.com',
                password: 'password'
            });
        expect(res.status).toEqual(201);
        expect(res.body.message).toBe('registration successful');
        expect(res.body.data.is_admin).toBe(true);
        done();
    });


    it('should return error if user already exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password'
            });
        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('username already exist');
        done();
    });

    it('should return error if user inputs are invalid', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send({
            });
        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('username is required');
        expect(res.body.errors[1].message).toBe('email is required');
        done();
    });

    it('should return error if password length is short', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send({
                username: 'test',
                email: 'test24@test.com',
                password: 'passw'
            });
        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('password is too short');
        done();
    });
});
