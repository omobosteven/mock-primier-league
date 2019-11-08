import Helper from '../helpers/Helper';
import models from '../models';

const { User } = models;
const { generateToken } = Helper;

class AuthController {
    static async signupUser(req, res) {
        const { username, email, password } = req.userInput;
        const isAdmin = req.originalUrl.includes('admin');

        try {
            const userPayload = {
                username,
                email,
                password,
                is_admin: isAdmin
            };

            const user = new User(userPayload);
            const newUser = await user.save();

            const token = generateToken({
                user: newUser.id,
                admin: newUser.isAdmin
            });

            return res.status(201).send({
                status: 201,
                message: 'registration successful',
                token: `Bearer ${token}`
            });
        } catch (err) {
            /* istanbul ignore next */
            return res.status(500).send({
                status: 500,
                message: 'internal server error'
            });
        }
    }

    static async loginUser(req, res) {
        const { id, is_admin: isAdmin } = req.user;

        try {
            const token = generateToken({
                user: id,
                admin: isAdmin
            });

            return res.status(200).send({
                message: 'login successful',
                token: `Bearer ${token}`
            });
        } catch (err) {
            /* istanbul ignore next */
            return res.status(500).json({
                status: 500,
                message: 'internal server error'
            });
        }
    }
}

export default AuthController;
