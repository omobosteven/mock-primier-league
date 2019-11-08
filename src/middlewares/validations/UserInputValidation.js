import { validateAll } from 'indicative/validator';
import { sanitize } from 'indicative/sanitizer';

class UserInputValidation {
    static async validateSignupInput(req, res, next) {
        const rules = {
            username: 'required|alpha_numeric|min:2|max:20',
            email: 'required|email',
            password: 'required|min:6'
        };

        const sanitization = {
            username: 'lower_case',
            email: 'normalize_email',
            password: 'trim'
        };

        const messages = {
            required: (field) => `${field} is required`,
            'username.alpha_numeric': 'username contains unallowed characters',
            'username.min': 'username is less than 2 character',
            'username.max': 'username is greater than 20 character',
            'email.email': 'enter a valid email address',
            'password.min': 'password is too short',
        };

        const inputData = req.body;

        validateAll(inputData, rules, messages)
            .then(() => {
                sanitize(inputData, sanitization);
                req.userInput = inputData;
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

        const inputData = req.body;

        const messages = {
            required: (field) => `${field} is required`,
        };

        validateAll(inputData, rules, messages)
            .then(() => {
                req.userInput = inputData;
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
