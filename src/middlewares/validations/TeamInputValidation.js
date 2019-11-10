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

class TeamInputValidaton {
    static validateCreateTeamInput(req, res, next) {
        const rules = {
            name: 'required|string|min:2|max:50',
            code: 'required|alpha_numeric|max:4',
            venue_name: 'required|string|min:2|max:20',
            venue_capacity: 'required|integer'
        };

        const sanitization = {
            name: 'lower_case',
            code: 'upper_case',
            venue_name: 'lower_case',
        };

        const messages = {
            required: (field) => `team ${field} is required`,
            string: (field) => `team ${field} must be a string`,
            'name.min': 'team name is less than 2 character',
            'name.max': 'team name is greater than 50 character',
            'code.alpha_numeric': 'team code contains unallowed characters',
            'code.max': 'team code name is greater than 4 character',
            'venue_name.min': 'team venue name is lesser than 2 character',
            'venue_name.max': 'team venue name is greater than 20 character',
            'venue_capacity.integer': 'enter a number for team venue capacity',
        };

        const inputData = removeExtraWhiteSpaces(req.body);

        validateAll(inputData, rules, messages)
            .then(() => {
                sanitize(inputData, sanitization);
                req.teamInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    status: 400,
                    errors: error
                });
            });
    }

    static validateUpdateTeamInput(req, res, next) {
        const rules = {
            name: 'string|min:2|max:50',
            code: 'string|alpha_numeric|max:4',
            venue_name: 'string|min:2|max:20',
            venue_capacity: 'integer'
        };

        const sanitization = {
            name: 'lower_case|trim',
            code: 'upper_case',
            venue_name: 'trim',
        };


        const messages = {
            string: (field) => `team ${field} must be a string`,
            'name.min': 'team name is less than 2 character',
            'name.max': 'team name is greater than 50 character',
            'code.alpha_numeric': 'team code contains unallowed characters',
            'code.max': 'team code name is greater than 4 character',
            'venue_name.min': 'team venue name is lesser than 2 character',
            'venue_name.max': 'team venue name is greater than 20 character',
            'venue_capacity.integer': 'enter a number for team venue capacity',
        };

        const inputData = removeExtraWhiteSpaces(req.body);

        validateAll(inputData, rules, messages)
            .then(() => {
                sanitize(inputData, sanitization);
                req.teamInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    status: 400,
                    errors: error
                });
            });
    }
}

export default TeamInputValidaton;
