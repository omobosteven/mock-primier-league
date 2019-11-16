import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team, Fixture } = models;
const { generateToken } = Helper;

const {
    user, teamTest1, teamTest2, teamTest3
} = testData;

let userToken;
let team1Id;
let team2Id;
let team3Id;
let fixture1Id;

describe('Test retrieve fixture endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});
        const testUser = await User.create(user);
        const team1 = await Team.create(teamTest1);
        const team2 = await Team.create(teamTest2);
        const team3 = await Team.create(teamTest3);

        team1Id = team1.id;
        team2Id = team2.id;
        team3Id = team3.id;

        const fixture1 = await Fixture.create({
            home_team: team1Id,
            away_team: team2Id,
            event_date: new Date('2019-10-02T17:00')
        });
        await Fixture.create({
            home_team: team1Id,
            away_team: team3Id,
            event_date: new Date('2019-10-02T17:00')
        });
        await Fixture.create({
            home_team: team2Id,
            away_team: team3Id,
            home_team_goal: 3,
            status: 'completed',
            event_date: new Date('2019-10-02T17:00')
        });

        fixture1Id = fixture1.id;

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should get a fixture', async (done) => {
        const res = await request(app)
            .get(`/api/v1/fixtures/${fixture1Id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.message).toBe('fixture retrieved successfully');
        expect(res.body.data.home_team.name).toBe('test team1');
        expect(res.body.data.away_team.name).toBe('test team2');
        expect(res.body.data.status).toBe('pending');
        done();
    });

    it('should retreive all fixtures', async (done) => {
        const res = await request(app)
            .get('/api/v1/fixtures')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.count).toBe(3);
        done();
    });

    it('should retreive all pending fixtures', async (done) => {
        const res = await request(app)
            .get('/api/v1/fixtures/?status=pending')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.count).toBe(2);
        done();
    });

    it('should retreive all completed fixtures', async (done) => {
        const res = await request(app)
            .get('/api/v1/fixtures/?status=completed')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.count).toBe(1);
        done();
    });

    it('should return empty data if status params is not pending/completed',
        async (done) => {
            const res = await request(app)
                .get('/api/v1/fixtures/?status=tried')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Accept', 'application/json');

            expect(res.status).toEqual(200);
            expect(res.body.count).toBe(0);
            done();
        });

    it('should return error if fixture does not exist', async (done) => {
        const res = await request(app)
            .get('/api/v1/fixtures/shdadh3tugqwe2')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(404);
        expect(res.body.message).toBe('fixture does not exist');
        done();
    });
});
