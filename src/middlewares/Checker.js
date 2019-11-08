import FindResource from '../services/FindResource';
import Helper from '../helpers/Helper';

const { comparePassword } = Helper;

const {
    findUser,
    findUserWithUsername
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
                    message: 'error',
                    data: { [field]: `${field} already exist` }
                });
            }

            return next();
        } catch (error) {
            /* istanbul ignore next */
            return res.status(500).json({
                status: 500,
                message: 'internal server error'
            });
        }
    }

    static async checkUserUsernamePassword(req, res, next) {
        try {
            const { username, password } = req.userInput;
            const user = await findUserWithUsername(username);

            if (!user) {
                return res.status(400).send({
                    status: 400,
                    error: 'wrong username or password'
                });
            }

            const passwordMatched = await comparePassword(
                password, user.password
            );

            if (!passwordMatched) {
                return res.status(400).send({
                    status: 400,
                    error: 'wrong username or password'
                });
            }

            req.user = user;
            return next();
        } catch (error) {
            /* istanbul ignore next */
            return res.status(500).json({
                status: 500,
                message: 'internal server error'
            });
        }
    }
}

export default Checker;
