import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team } = models;
const { generateToken } = Helper;

const {
    user, teamTest1, teamTest2
} = testData;

let userToken;
let team1Id;

describe('Test retrieve team endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        const testUser = await User.create(user);
        const team1 = await Team.create(teamTest1);
        await Team.create(teamTest2);

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });

        team1Id = team1.id;
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should get a team with id', async (done) => {
        const res = await request(app)
            .get(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.data.name).toBe('test team1');
        expect(res.body.data.code).toBe('TST');
        expect(res.body.data.venue_name).toBe('test stadium');
        done();
    });

    it('should return error if team with id does not exist', async (done) => {
        const res = await request(app)
            .get('/api/v1/teams/24')
            .set('Authorization', `Bearer ${userToken
            }`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('team does not exist');
        done();
    });

    it('should get all teams', async (done) => {
        const res = await request(app)
            .get('/api/v1/teams')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data[0].name).toBe('test team1');
        expect(res.body.data[1].name).toBe('test team2');
        done();
    });
});
