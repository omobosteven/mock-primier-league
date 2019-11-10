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
    beforeAll(async () => {
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
