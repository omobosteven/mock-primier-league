import FindResource from '../services/FindResource';
import Helper from '../helpers/Helper';
import models from '../models';

const { comparePassword } = Helper;
const { User, Team, Fixture } = models;

const {
    findUserWithUsername,
    findDocumentById,
    findFixtureByHomeAwayIds,
    findDocument
} = FindResource;

class Checker {
    static async checkExistingUsernameEmail(req, res, next) {
        try {
            const { username, email } = req.userInput;
            const existingUser = await findDocument(User,
                { email }, { username });

            if (existingUser) {
                const field = existingUser.username === username
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

    static async checkExistingTeam(req, res, next) {
        try {
            const { name, code } = req.teamInput;
            const existingTeam = await findDocument(Team,
                { name }, { code });

            if (existingTeam) {
                const field = existingTeam.name === name
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

    static async checkUserUsernamePassword(req, res, next) {
        try {
            const { username, password } = req.userInput;
            const user = await findUserWithUsername(username);

            if (!user) {
                return res.status(400).send({
                    status: 400,
                    message: 'wrong username or password'
                });
            }

            const passwordMatched = await comparePassword(
                password, user.password
            );

            if (!passwordMatched) {
                return res.status(400).send({
                    status: 400,
                    message: 'wrong username or password'
                });
            }

            req.user = user;
            return next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static verifyAdminRole(req, res, next) {
        const { admin } = req.user;

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

            const team = await findDocumentById(teamId, Team);

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

            const fixture = await findDocumentById(fixtureId, Fixture);

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

            const homeTeam = await findDocumentById(homeTeamId, Team);
            const awayTeam = await findDocumentById(awayTeamId, Team);

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

    static async checkDuplicateFixture(req, res, next) {
        const {
            home_team: homeTeamId,
            away_team: awayTeamId,
        } = req.fixtureInput;

        const fixture = await findFixtureByHomeAwayIds(homeTeamId, awayTeamId);

        if (fixture) {
            return res.status(409).send({
                status: 409,
                message: 'similar fixture has not been completed'
            });
        }

        return next();
    }
}

export default Checker;
