import models from '../models';

const { User } = models;

class AuthController {
    static async signupUser(req, res, next) {
        try {
            const { username, email, password } = req.userInput;
            const userPayload = {
                username,
                email,
                password,
            };

            const user = new User(userPayload);
            await user.save();

            const token = user.generateAuthToken();

            return res.status(201).send({
                status: 201,
                message: 'registration successful',
                data: {
                    is_admin: false,
                    token: `Bearer ${token}`
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async signupAdmin(req, res, next) {
        try {
            const { username, email, password } = req.userInput;
            const adminPayload = {
                username,
                email,
                password,
                is_admin: true
            };

            const admin = new User(adminPayload);
            await admin.save();

            const token = admin.generateAuthToken();

            return res.status(201).send({
                status: 201,
                message: 'registration successful',
                data: {
                    is_admin: true,
                    token: `Bearer ${token}`
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async loginUser(req, res, next) {
        try {
            const user = req.user;
            const token = user.generateAuthToken();

            return res.status(200).send({
                status: 200,
                message: 'login successful',
                data: {
                    is_admin: user.is_admin,
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
