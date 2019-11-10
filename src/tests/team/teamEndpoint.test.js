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
let team1Id;
let team2Id;

describe('Test team endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        const team1 = await Team.create(teamTest1);
        const team2 = await Team.create(teamTest2);

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });
        adminToken = generateToken({
            user: testAdmin.id,
            admin: testAdmin.is_admin
        });

        team1Id = team1.id;
        team2Id = team2.id;
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

    it('should update a team with admin', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'Manchester',
            });

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('team updated successfully');
        expect(res.body.data.name).toBe('manchester');
        done();
    });

    it('should return error if updating with invalid input field',
        async (done) => {
            const res = await request(app)
                .patch(`/api/v1/teams/${team1Id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Accept', 'application/json')
                .send({
                    name: 'a  ',
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message)
                .toBe('team name is less than 2 character');
            done();
        });

    it('should get a team with id', async (done) => {
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

    it('should return error if team with id does not exist', async (done) => {
        const res = await request(app)
            .get('/api/v1/teams/24')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('team does not exist');
        done();
    });

    it('should get all teams', async (done) => {
        const res = await request(app)
            .get('/api/v1/teams')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data[0].name).toBe('test team1');
        expect(res.body.data[1].name).toBe('test team2');
        done();
    });

    it('should delete a teams with admin', async (done) => {
        const res = await request(app)
            .delete(`/api/v1/teams/${team2Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('team deleted successfully');
        expect(res.body.data.name).toBe('test team2');
        done();
    });
});
