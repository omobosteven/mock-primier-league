import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team, Fixture } = models;
const { generateToken } = Helper;

const {
    user, admin, teamTest1, teamTest2,
} = testData;

let userToken;
let adminToken;
let team1Id;
let team2Id;
let fixture1Id;

describe('Test delete fixture endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        const team1 = await Team.create(teamTest1);
        const team2 = await Team.create(teamTest2);

        team1Id = team1.id;
        team2Id = team2.id;

        const fixture1 = await Fixture.create({
            home_team: team1Id,
            away_team: team2Id,
            event_date: new Date('2019-10-02T17:00'),
            event_link: 'api/fixtures/test_team1_vs_test_team2/id'
        });

        fixture1Id = fixture1.id;

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

    it('should delete a fixture with admin', async (done) => {
        const res = await request(app)
            .delete(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('fixture deleted successfully');
        expect(await Fixture.countDocuments()).toBe(0);
        done();
    });


    it('should return error if fixture does not exist', async (done) => {
        const res = await request(app)
            .delete('/api/v1/fixtures/shdadh3tugqwe2')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('fixture does not exist');
        done();
    });

    it('should return error if user tries to delete a fixture',
        async (done) => {
            const res = await request(app)
                .delete(`/api/v1/fixtures/${fixture1Id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Accept', 'application/json');

            expect(res.status).toEqual(403);
            expect(res.body.message).toBe('permission denied');
            done();
        });
});
