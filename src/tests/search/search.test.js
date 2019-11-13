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

        await Fixture.create({
            home_team: team1Id,
            away_team: team2Id,
            event_date: new Date('2019-10-02T17:00'),
            event_link: 'api/fixtures/test_team1_vs_test_team2/id'
        });
        await Fixture.create({
            home_team: team2Id,
            away_team: team3Id,
            event_date: new Date('2019-10-02T17:00'),
            event_link: 'api/fixtures/test_team1_vs_test_team3/id'
        });

        userToken = generateToken({
            user: testUser.id,
            admin: testUser.is_admin
        });
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should get teams and fixtures', async (done) => {
        const res = await request(app)
            .get('/api/v1/search?q=team2')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body.data.teams[0].name).toBe('test team2');
        expect(res.body.data.teams.length).toEqual(1);
        expect(res.body.data.fixtures.length).toEqual(2);
        done();
    });

    it('should return error if search query is not provided', async (done) => {
        const res = await request(app)
            .get('/api/v1/search?q=')
            .set('Authorization', `Bearer ${userToken}`)
            .set('Accept', 'application/json');

        expect(res.status).toEqual(400);
        expect(res.body.message)
            .toBe('please enter a search parameter "?q=keyword"');
        done();
    });
});
