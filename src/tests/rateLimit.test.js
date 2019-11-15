import request from 'supertest';
import mongoose from 'mongoose';
import RedisStore from 'rate-limit-redis';
import app from '../app';
import Helper from '../helpers/Helper';
import models from '../models';
import testData from './testData';

const { User, Team, Fixture } = models;
const { generateToken } = Helper;

const {
    user, admin, teamTest1
} = testData;

let userToken;
let adminToken;
let team1Id;

jest.mock('rate-limit-redis');

describe('Test retrieve fixture endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        const team1 = await Team.create(teamTest1);

        team1Id = team1.id;

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });
        adminToken = generateToken({
            user: testAdmin.id,
            admin: testAdmin.is_admin
        });

        RedisStore.prototype.incr = jest.fn().mockImplementation((key, cb) => {
            cb(null, 50, 0);
        });
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should return rate limit error for user', async (done) => {
        const res = await request(app)
            .get(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(429);
        expect(res.body.message)
            .toBe('Too many request, please try again later');
        done();
    });

    it('should allow admin account', async (done) => {
        const res = await request(app)
            .get(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.data.name).toBe('test team1');
        expect(res.body.data.code).toBe('TST');
        expect(res.body.data.venue_name).toBe('test stadium');
        done();
    });
});
