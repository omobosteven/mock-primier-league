import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team } = models;
const { generateToken } = Helper;

const {
    user, admin, teamTest1, teamTest2
} = testData;

let userToken;
let adminToken;

describe('Test create team endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        await Team.create(teamTest1);
        await Team.create(teamTest2);

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });
        adminToken = generateToken({
            user: testAdmin.id,
            admin: testAdmin.is_admin
        });
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should create a team with admin', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'Real Team',
                code: 'rtm',
                venue_name: 'real stadium',
                venue_capacity: 2345
            });

        expect(res.status).toEqual(201);
        expect(res.body.message).toBe('team created successfully');
        expect(res.body.data.name).toBe('real team');
        expect(res.body.data.code).toBe('RTM');
        done();
    });

    it('should return error if team with name exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'test team1',
                code: 'rtm',
                venue_name: 'real stadium',
                venue_capacity: 2345
            });

        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('team name already exist');
        done();
    });

    it('should return error if team with code exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'test team35',
                code: 'tst',
                venue_name: 'real stadium',
                venue_capacity: 2345
            });

        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('team code already exist');
        done();
    });

    it('should return error if inputs are empty', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({});

        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('team name is required');
        expect(res.body.errors[1].message).toBe('team code is required');
        expect(res.body.errors[2].message).toBe('team venue_name is required');
        expect(res.body.errors[3].message)
            .toBe('team venue_capacity is required');
        done();
    });


    it('should return error if inputs invalid', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 123435,
                code: 'tst',
                venue_name: 2345,
                venue_capacity: 2345
            });

        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('team name must be a string');
        expect(res.body.errors[1].message)
            .toBe('team venue_name must be a string');
        done();
    });

    it('should return error if user tries to create a team', async (done) => {
        const res = await request(app)
            .post('/api/v1/teams')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'test team35',
                code: 'tstr',
                venue_name: 'real stadium',
                venue_capacity: 2345
            });

        expect(res.status).toEqual(403);
        expect(res.body.message).toBe('permission denied');
        done();
    });
});
