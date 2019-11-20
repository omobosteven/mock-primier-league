import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Helper from '../../helpers/Helper';
import models from '../../models';
import testData from '../testData';

const { User, Team, Fixture } = models;
const { generateToken } = Helper;

const {
    teamTest1, teamTest2, teamTest3
} = testData;

let team1Id;
let team2Id;
let team3Id;

describe('Test retrieve fixture endpoints', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});
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
        await Fixture.create({
            home_team: team2Id,
            away_team: team3Id,
            event_date: new Date('2019-10-02T17:00')
        });
    });

    afterAll((done) => {
        mongoose.disconnect();
        done();
    });

    it('should get teams and fixtures', async (done) => {
        const res = await request(app)
            .get('/api/v1/search?q=team2')
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
            .set('Accept', 'application/json');

        expect(res.status).toEqual(400);
        expect(res.body.message)
            .toBe('please enter a search parameter "?q=keyword"');
        done();
    });
});
