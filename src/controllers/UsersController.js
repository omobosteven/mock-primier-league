import Utils from '../utilities/utils';
import models from '../models';

const { User } = models;

class UsersController {
    static async signupUser(req, res) {
        const { username, password } = req.body;
        const isAdmin = req.originalUrl.includes('admin');

        try {
            const existingUser = await User.findOne({ username });

            if (existingUser != null) {
                return res.status(409).send({
                    message: 'username already exist'
                });
            }

            const userPayload = {
                username,
                password: password.trim()
            };
            const adminPayload = {
                ...userPayload,
                isAdmin: true
            };

            const payload = isAdmin ? adminPayload : userPayload;
            const user = new User(payload);
            const newUser = await user.save();

            const token = Utils.generateToken({
                user: newUser.id,
                admin: newUser.isAdmin
            });

            return res.status(201).send({
                message: 'registration successful',
                token: `Bearer ${token}`
            });
        } catch (err) {
            return res.status(500).json({ message: 'internal server error' });
        }
    }

    static async loginUser(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });

            if (user == null) {
                return res.status(400).send({
                    error: 'wrong username or password'
                });
            }

            const passwordMatched = await Utils.comparePassword(password, user.password);

            if (passwordMatched) {
                const token = Utils.generateToken({
                    user: user.id,
                    admin: user.isAdmin
                });

                return res.status(200).send({
                    message: 'login successful',
                    token: `Bearer ${token}`
                });
            }

            return res.status(400).send({
                error: 'wrong username or password'
            });
        } catch (err) {
            return res.status(500).json({ message: 'internal server error' });
        }
    }
}

export default UsersController;
