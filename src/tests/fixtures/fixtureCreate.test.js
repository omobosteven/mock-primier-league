import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import models from '../../models';
import testData from '../testData';

const { User, Team, Fixture } = models;

const {
    user, admin, teamTest1, teamTest2, teamTest3
} = testData;

let userToken;
let adminToken;
let team1Id;
let team2Id;
let team3Id;

describe('Test create fixture endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});
        const testUser = await User.create(user);
        const testAdmin = await User.create(admin);
        const team1 = await Team.create(teamTest1);
        const team2 = await Team.create(teamTest2);
        const team3 = await Team.create(teamTest3);

        team1Id = team1.id;
        team2Id = team2.id;
        team3Id = team3.id;

        await Fixture.create({
            home_team: team1Id,
            away_team: team2Id,
            event_date: new Date('2019-10-02T17:00')
        });

        userToken = testUser.generateAuthToken();
        adminToken = testAdmin.generateAuthToken();
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('create a fixture with admin', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team2Id,
                away_team: team3Id,
                event_date: '2019-10-02 17:00'
            });

        expect(res.status).toEqual(201);
        expect(res.body.message).toBe('fixture created successfully');
        expect(res.body.data.home_team.name).toBe('test team2');
        expect(res.body.data.away_team.name).toBe('test team3');
        expect(res.body.data.home_team_goal).toBe(0);
        expect(res.body.data.away_team_goal).toBe(0);
        expect(res.body.data.status).toBe('pending');
        expect(res.body.data.event_date)
            .toBe(new Date('2019-10-02 17:00').toISOString());
        done();
    });

    it('should not create duplicate fixture', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: team2Id,
                event_date: '2019-10-02 17:00'
            });

        expect(res.status).toEqual(409);
        expect(res.body.message).toBe('similar fixture has not been completed');
        done();
    });

    it('should return error with empty input fields', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({});

        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message).toBe('home_team is required');
        expect(res.body.errors[1].message).toBe('away_team is required');
        expect(res.body.errors[2].message).toBe('event_date is required');
        done();
    });

    it('should return error if home and away team matches', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: team1Id,
                event_date: '2019-10-02 17:00'
            });

        expect(res.status).toEqual(400);
        expect(res.body.errors[0].message)
            .toBe('home and away team cannot be the same');
        done();
    });

    it('should return error if event date is not in ISO8601 format',
        async (done) => {
            const res = await request(app)
                .post('/api/v1/fixtures')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Accept', 'application/json')
                .send({
                    home_team: team1Id,
                    away_team: team2Id,
                    event_date: '2019-57-02 92:00'
                });

            expect(res.status).toEqual(400);
            expect(res.body.errors[0].message)
                .toBe('event_date should be in ISO8601 date (YYYY-MM-DD HH:mm) format');
            done();
        });

    it('should return error if home team does not exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: 'team1Id',
                away_team: team2Id,
                event_date: '2019-01-02 12:00'
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('home team does not exist');
        done();
    });

    it('should return error if away team does not exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/fixtures')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Accept', 'application/json')
            .send({
                home_team: team1Id,
                away_team: 'team2Id',
                event_date: '2019-01-02 12:00'
            });

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('away team does not exist');
        done();
    });

    it('should return error if user tries to create a fixture',
        async (done) => {
            const res = await request(app)
                .post('/api/v1/fixtures')
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
