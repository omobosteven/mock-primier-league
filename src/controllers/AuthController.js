import Helper from '../helpers/Helper';
import models from '../models';

const { User } = models;
const { generateToken } = Helper;

class AuthController {
    static async signupUser(req, res, next) {
        const { username, email, password } = req.userInput;
        const isAdminRole = req.originalUrl.includes('admin');

        try {
            const userPayload = {
                username,
                email,
                password,
                is_admin: isAdminRole
            };

            const user = new User(userPayload);
            const { _id, is_admin: isAdmin } = await user.save();

            const token = generateToken({
                user: _id,
                admin: isAdmin
            });

            return res.status(201).send({
                status: 201,
                message: 'registration successful',
                data: {
                    is_admin: isAdmin,
                    token: `Bearer ${token}`
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async loginUser(req, res, next) {
        const { _id, is_admin: isAdmin } = req.user;

        try {
            const token = generateToken({
                user: _id,
                admin: isAdmin
            });

            return res.status(200).send({
                status: 200,
                message: 'login successful',
                data: {
                    is_admin: isAdmin,
                    token: `Bearer ${token}`
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }
}

export default AuthController;
