import FindResource from '../services/FindResource';
import Helper from '../helpers/Helper';

const { comparePassword } = Helper;

const {
    findUser,
    findUserWithUsername,
    findTeam,
    findTeamById
} = FindResource;

class Checker {
    static async checkExistingUsernameEmail(req, res, next) {
        try {
            const { username, email } = req.userInput;
            const existingUser = await findUser(email, username);

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
            const existingTeam = await findTeam(name, code);

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

            const team = await findTeamById(teamId);

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
}

export default Checker;
