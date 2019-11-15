import Helper from '../helpers/Helper';
import models from '../models';

const {
    comparePassword,
    verifyMongooseObjectId
} = Helper;
const { User, Team, Fixture } = models;


class Checker {
    static async checkDuplicateUser(req, res, next) {
        try {
            const { username, email } = req.userInput;
            const userExist = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (userExist) {
                const field = userExist.username === username
                    ? 'username' : 'email';

                return res.status(409).send({
                    status: 409,
                    message: `${field} already exist`
                });
            }

            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async checkDuplicateTeam(req, res, next) {
        try {
            const { name, code } = req.teamInput;
            const { team_id: teamId } = req.params;

            const teamExist = await Team.findOne({
                $or: [
                    { name, _id: { $ne: teamId } },
                    { code, _id: { $ne: teamId } }
                ]
            });

            if (teamExist) {
                const field = teamExist.name === name
                    ? 'name' : 'code';

                return res.status(409).send({
                    status: 409,
                    message: `team ${field} already exist`
                });
            }

            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async checkDuplicateFixture(req, res, next) {
        try {
            const {
                fixture_id: fixtureId
            } = req.params;

            const {
                home_team: homeTeamId,
                away_team: awayTeamId
            } = req.fixtureInput;

            const fixture = await Fixture.findOne({
                $and: [
                    { home_team: homeTeamId },
                    { away_team: awayTeamId },
                    { status: 'pending', _id: { $ne: fixtureId } }
                ]
            });

            if (fixture) {
                return res.status(409).send({
                    status: 409,
                    message: 'similar fixture has not been completed'
                });
            }

            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async checkUsernamePassword(req, res, next) {
        try {
            const { username, password } = req.userInput;
            const user = await User.findOne({ username });
            const passwordMatched = user && await comparePassword(
                password, user.password
            );

            if (!user || !passwordMatched) {
                return res.status(400).send({
                    status: 400,
                    message: 'wrong username or password'
                });
            }

            req.decodedUser = user;
            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static verifyAdminRole(req, res, next) {
        const { admin } = req.decodedUser;

        if (!admin) {
            return res.status(403).send({
                status: 403,
                message: 'permission denied'
            });
        }

        return next();
    }

    static async verifyTeamWithId(req, res, next) {
        try {
            const { team_id: teamId } = req.params;
            const documentId = verifyMongooseObjectId(teamId);

            const team = await Team.findById(documentId);

            if (!team) {
                return res.status(404).send({
                    status: 404,
                    message: 'team does not exist'
                });
            }
            req.team = team;
            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async verifyFixtureWithId(req, res, next) {
        try {
            const { fixture_id: fixtureId } = req.params;
            const documentId = verifyMongooseObjectId(fixtureId);

            const fixture = await Fixture.findById(documentId)
                .populate('home_team', 'name code')
                .populate('away_team', 'name code');

            if (!fixture) {
                return res.status(404).send({
                    status: 404,
                    message: 'fixture does not exist'
                });
            }
            req.fixture = fixture;
            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async checkHomeAwayTeamExist(req, res, next) {
        try {
            const {
                home_team: homeTeamId,
                away_team: awayTeamId
            } = req.fixtureInput;

            if (!homeTeamId && !awayTeamId) {
                return next();
            }

            const homeTeamDocumentId = verifyMongooseObjectId(homeTeamId);
            const awayTeamDocumentId = verifyMongooseObjectId(awayTeamId);

            const homeTeam = await Team.findById(homeTeamDocumentId);
            const awayTeam = await Team.findById(awayTeamDocumentId);

            if (!homeTeam || !awayTeam) {
                const team = !homeTeam ? 'home' : 'away';

                return res.status(404).send({
                    status: 404,
                    message: `${team} team does not exist`
                });
            }

            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }
}

export default Checker;
