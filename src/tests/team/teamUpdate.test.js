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

describe('Test update team endpoints', () => {
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
                    venue_name: 2345
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message)
                .toBe('team name is less than 2 character');
            expect(res.body.errors[1].message)
                .toBe('team venue_name must be a string');
            done();
        });


    it('should return error if team with name exist', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/teams/${team2Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'test team1',
                code: 'rtm'
            });

        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('team name already exist');
        done();
    });

    it('should return error if team with id does not exist', async (done) => {
        const res = await request(app)
            .patch('/api/v1/teams/24')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                name: 'Chelsea',
                venue_name: 'Stamford'
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('team does not exist');
        done();
    });

    it('should return error if user tries to update a team', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/teams/${team1Id}`)
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
