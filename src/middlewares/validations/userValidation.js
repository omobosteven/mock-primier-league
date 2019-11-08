import { validateAll } from 'indicative/validator';

class UserInputValidation {
    static async validateSignupInput(req, res, next) {
        const rules = {
            username: 'required|alpha_numeric',
            password: 'required|min:6'
        };

        const data = req.body;

        const messages = {
            required: (field) => `${field} is required`,
            'username.alpha_numeric': 'username contains unallowed characters',
            'password.min': 'password is too short',
        };

        validateAll(data, rules, messages)
            .then(() => {
                return next();
            })
            .catch((err) => {
                return res.status(400).send({
                    error: err
                });
            });
    }

    static validateLoginInput(req, res, next) {
        const rules = {
            username: 'required',
            password: 'required',
        };

        const data = req.body;

        const messages = {
            required: (field) => `${field} is required`,
        };

        validateAll(data, rules, messages)
            .then(() => {
                return next();
            })
            .catch((err) => {
                return res.status(400).send({
                    error: err
                });
            });
    }
}

export default UserInputValidation;
