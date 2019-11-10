import { validateAll, configure } from 'indicative/validator';
import { sanitize } from 'indicative/sanitizer';
import CustomFormatter from './CustomErrorFormat';
import Helper from '../../helpers/Helper';

const {
    removeExtraWhiteSpaces
} = Helper;

configure({
    formatter: CustomFormatter
});

class UserInputValidation {
    static validateSignupInput(req, res, next) {
        const rules = {
            username: 'required|alpha_numeric|min:2|max:20',
            email: 'required|email',
            password: 'required|min:6'
        };

        const sanitization = {
            username: 'lower_case',
            email: 'normalize_email',
        };

        const messages = {
            required: (field) => `${field} is required`,
            'username.alpha_numeric': 'username contains unallowed characters',
            'username.min': 'username is less than 2 character',
            'username.max': 'username is greater than 20 character',
            'email.email': 'enter a valid email address',
            'password.min': 'password is too short',
        };

        const inputData = removeExtraWhiteSpaces(req.body);

        validateAll(inputData, rules, messages)
            .then(() => {
                sanitize(inputData, sanitization);
                req.userInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    errors: error
                });
            });
    }

    static validateLoginInput(req, res, next) {
        const rules = {
            username: 'required',
            password: 'required',
        };

        const inputData = removeExtraWhiteSpaces(req.body);

        const messages = {
            required: (field) => `${field} is required`,
        };

        validateAll(inputData, rules, messages)
            .then(() => {
                req.userInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    errors: error
                });
            });
    }
}

export default UserInputValidation;
