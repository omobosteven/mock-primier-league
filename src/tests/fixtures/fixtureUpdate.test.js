import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team, Fixture } = models;
const { generateToken } = Helper;

const {
    user, admin, teamTest1, teamTest2
} = testData;

let userToken;
let adminToken;
let team1Id;
let team2Id;
let fixture1Id;
let fixture2Id;

describe('Test update fixture endpoints', () => {
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
        const fixture2 = await Fixture.create({
            home_team: team2Id,
            away_team: team1Id,
            event_date: new Date('2019-11-02T17:00'),
            event_link: 'api/fixtures/test_team2_vs_test_team2/id'
        });

        fixture1Id = fixture1.id;
        fixture2Id = fixture2.id;

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

    it('should update a fixture with admin', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team_goal: 1,
                away_team_goal: 2,
                status: 'completed'
            });

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('fixture updated successfully');
        expect(res.body.data.home_team.name).toBe('test team1');
        expect(res.body.data.away_team.name).toBe('test team2');
        expect(res.body.data.home_team_goal).toBe(1);
        expect(res.body.data.away_team_goal).toBe(2);
        expect(res.body.data.status).toBe('completed');
        done();
    });


    it('should return error if fixture does not exist', async (done) => {
        const res = await request(app)
            .patch('/api/v1/fixtures/shdadh3tugqwe2')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team_goal: 1,
                away_team_goal: 2,
                status: 'completed'
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('fixture does not exist');
        done();
    });

    it('should not create duplicate fixture', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/fixtures/${fixture2Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: team2Id
            });

        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('similar fixture has not been completed');
        done();
    });

    it('should require home team input if away team is exists',
        async (done) => {
            const res = await request(app)
                .patch(`/api/v1/fixtures/${fixture1Id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Accept', 'application/json')
                .send({
                    away_team: team2Id
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message).toBe('home_team is required');
            done();
        });


    it('should require away team input if home team is exists',
        async (done) => {
            const res = await request(app)
                .patch(`/api/v1/fixtures/${fixture1Id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Accept', 'application/json')
                .send({
                    home_team: team2Id
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message).toBe('away_team is required');
            done();
        });

    it('should return error if home and away team matches', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: team1Id,
            });

        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message)
            .toBe('home and away team cannot be the same');
        done();
    });

    it('should return error if event date is not in ISO8601 format',
        async (done) => {
            const res = await request(app)
                .patch(`/api/v1/fixtures/${fixture1Id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Accept', 'application/json')
                .send({
                    event_date: '2019-57-02 92:00'
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message)
                .toBe('event_date should be in ISO8601 date (YYYY-MM-DD HH:mm) format');
            done();
        });

    it('should return error if home team does not exist', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: 'team1Id',
                away_team: team2Id,
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('home team does not exist');
        done();
    });

    it('should return error if away team does not exist', async (done) => {
        const res = await request(app)
            .patch(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: 'team2Id',
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('away team does not exist');
        done();
    });

    it('should return error if user tries to update a fixture',
        async (done) => {
            const res = await request(app)
                .patch(`/api/v1/fixtures/${fixture1Id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Accept', 'application/json')
                .send({
                    home_team: team1Id,
                    away_team: 'team2Id',
                    event_date: '2019-01-02 12:00'
                });

            expect(res.status).toEqual(403);
            expect(res.body.message).toBe('permission denied');
            done();
        });
});
