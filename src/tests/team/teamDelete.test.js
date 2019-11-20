import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import models from '../../models';
import testData from '../testData';

const { User, Team } = models;

const {
    user, admin, teamTest1, teamTest2
} = testData;

let userToken;
let adminToken;
let team1Id;

describe('Test team endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        const team1 = await Team.create(teamTest1);
        await Team.create(teamTest2);

        userToken = testUser.generateAuthToken();
        adminToken = testAdmin.generateAuthToken();

        team1Id = team1.id;
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should delete a teams with admin', async (done) => {
        const res = await request(app)
            .delete(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('team deleted successfully');
        expect(await Team.countDocuments()).toBe(1);
        done();
    });

    it('should return error if team with id does not exist', async (done) => {
        const res = await request(app)
            .delete('/api/v1/teams/24')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('team does not exist');
        done();
    });

    it('should return error if user tries to delete a team', async (done) => {
        const res = await request(app)
            .delete(`/api/v1/teams/${team1Id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(403);
        expect(res.body.message).toBe('permission denied');
        done();
    });
});
