import models from '../models';
import Helper from '../helpers/Helper';

const { Fixture } = models;

const {
    replaceWhiteSpacesWithHyphen
} = Helper;

class FixtureController {
    static async createFixture(req, res, next) {
        try {
            const {
                home_team: homeTeamId,
                away_team: awayTeamId,
                event_date: eventDate,
            } = req.fixtureInput;

            const eventDateUTC = new Date(`${eventDate}`);

            const fixtureData = {
                home_team: homeTeamId,
                away_team: awayTeamId,
                event_date: eventDateUTC
            };

            const fixture = await new Fixture(fixtureData)
                .populate('home_team', 'name code')
                .populate('away_team', 'name code')
                .execPopulate();

            const homeTeam = replaceWhiteSpacesWithHyphen(
                fixture.home_team.name
            );
            const awayTeam = replaceWhiteSpacesWithHyphen(
                fixture.away_team.name
            );

            const eventLink = `/api/fixtures/${homeTeam
            }-vs-${awayTeam}/${fixture.id}`;
            fixture.event_link = eventLink;
            fixture.save();

            return res.status(201).send({
                status: 201,
                message: 'fixture created successfully',
                data: fixture
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async updateFixture(req, res, next) {
        try {
            const {
                home_team: homeTeamIdInput,
                away_team: awayTeamIdInput,
                home_team_goal: homeTeamGoalInput,
                away_team_goal: awayTeamGoalInput,
                event_date: eventDateInput,
                status: statusInput
            } = req.fixtureInput;

            const {
                _id: fixtureId,
                home_team: homeTeamId,
                away_team: awayTeamId,
                home_team_goal: homeTeamGoal,
                away_team_goal: awayTeamGoal,
                event_date: eventDate,
                status,
            } = req.fixture;

            const eventDateUTCInput = eventDateInput
                ? new Date(`${eventDateInput}`) : eventDate;

            const fixtureData = {
                home_team: homeTeamIdInput || homeTeamId,
                away_team: awayTeamIdInput || awayTeamId,
                home_team_goal: homeTeamGoalInput || homeTeamGoal,
                away_team_goal: awayTeamGoalInput || awayTeamGoal,
                event_date: eventDateUTCInput,
                status: statusInput || status
            };

            const fixture = await Fixture.findByIdAndUpdate(
                fixtureId, fixtureData, { new: true }
            )
                .populate('home_team', 'name code')
                .populate('away_team', 'name code');

            const homeTeam = replaceWhiteSpacesWithHyphen(
                fixture.home_team.name
            );
            const awayTeam = replaceWhiteSpacesWithHyphen(
                fixture.away_team.name
            );

            const eventLink = `/api/fixtures/${homeTeam
            }-vs-${awayTeam}/${fixture.id}`;
            fixture.event_link = eventLink;

            fixture.save();

            return res.status(200).send({
                status: 200,
                message: 'fixture updated successfully',
                data: fixture
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async deleteFixture(req, res, next) {
        try {
            const { _id } = req.fixture;

            const data = await Fixture.findByIdAndRemove({ _id })
                .populate('home_team', 'name code')
                .populate('away_team', 'name code');

            return res.status(200).send({
                status: 200,
                message: 'fixture deleted successfully',
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async getFixture(req, res, next) {
        try {
            const data = req.fixture;

            return res.status(200).send({
                status: 200,
                message: 'fixture retrieved successfully',
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async getAllFixtures(req, res, next) {
        try {
            const data = await Fixture.find()
                .populate({
                    path: 'home_team',
                    select: 'name code',
                })
                .populate({
                    path: 'away_team',
                    select: 'name code'
                });
            return res.status(200).send({
                status: 200,
                message: 'fixtures retrieved successfully',
                count: data.length,
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async getPendingCompletedFixtures(req, res, next) {
        try {
            const status = req.path.slice(1);
            const data = await Fixture.find({
                status
            })
                .populate('home_team', 'name code')
                .populate('away_team', 'name code');
            return res.status(200).send({
                status: 200,
                message: `${status} fixtures retrieved`,
                count: data.length,
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }
}

export default FixtureController;